const router = require("express").Router();
const { PrismaClient } = require("../generated/prisma");
const Order = require("../data/enums");
const { Client } = require("@elastic/elasticsearch");
const { OAuth2Client } = require("google-auth-library");
const { timeZoneAbbr } = require("../data/timezones");
const { DateTime } = require("luxon");

// env variables
require("dotenv").config();
const ELASTIC_API_KEY = process.env.ELASTIC_API_KEY;
const URL = process.env.ELASTIC_URL;
const ELASTIC_INDEX = process.env.ELASTIC_INDEX;

const client = new Client({
  node: URL,
  auth: {
    apiKey: ELASTIC_API_KEY,
  },
  tls: { rejectUnauthorized: false },
});

const prisma = new PrismaClient();
const middleware = require("../middleware/middleware");
router.use(middleware);

// verification function from Google dev
// https://developers.google.com/identity/sign-in/web/backend-auth#node.js
const googleClient = new OAuth2Client();
async function verify() {
  const ticket = await googleClient.verifyIdToken({
    idToken: token,
    audience: process.env.WEB_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  const userid = payload["sub"];
}

router.post("/scheduler/email", async (req, res) => {
  // OIDC authentication
  try {
    // get authorization header
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ error: "Missing or invalid authorization header" });
    }
    // get token after "Bearer "
    const token = header.split(" ")[1];

    console.log("token: ", token);
    const payload = await verify(token);
  } catch (error) {
    console.log("verify error: ", error);
    return res.status(401).json({ error: "Invalid authorization token" });
  }

  try {
    const users = await prisma.user.findMany({
      where: { auth_provider: "google" },
    });

    await Promise.all(
      users.map(async (user) => {
        // read from email, timestamp will be 24 hours before (job interval)
        try {
          // check access token with function below
          const updated = await checkAccess(user);

          // look for emails, parse, and add interview dates to corresponding applications
          const interviews = await findInterviewTimes(updated);

          await prisma.user.update({
            data: { emailScanned: new Date() },
            where: { id: updated.id },
          });
        } catch (error) {
          // continue to next user
        }
      })
    );
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: "Failed to sync emails for all users." });
  }
});

const getNewAccessToken = async (user) => {
  // get new access token using refresh token
  const params = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: user.refresh_token,
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
  }).toString();

  // google requires the information to be URL
  try {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    });

    if (!response.ok) {
      throw new Error("Token refresh failed.");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

// checks if user needs new access token and regenerates
const checkAccess = async (user) => {
  const expiration = new Date(user.token_expiry);
  const deadline = new Date();

  if (expiration <= deadline) {
    // refresh token
    try {
      const credentials = await getNewAccessToken(user);
      // find new expiration date
      const now = new Date();
      const token_expiry = new Date(
        now.getTime() + credentials.expires_in * 1000
      );
      const updated = await prisma.user.update({
        data: { access_token: credentials.access_token },
        where: { id: user.id },
      });

      return updated;
    } catch (error) {
      res.status(401).json({
        error: "Failed to update Google login.",
      });
    }
  }

  return user;
};

// functions for email scanning

// gets new messages for user, parses them, then adds interviews
// helper methods below
const findInterviewTimes = async (user) => {
  const interviews = [];
  try {
    if (!user.google_id) {
      // not linked to a google account, no action necessary
      return;
    }

    // get all new messages from inbox that contain "interview confirmation"
    const data = await getMessages(user);

    if (data.messages) {
      // get each message and parse information to find interview time
      for (const message of data.messages) {
        const data = await getMessage(user, message);
        const newInterview = await parseMessage(message, data);

        // if data was able to be obtained from the message, add interview object to list
        if (newInterview) {
          interviews.push(newInterview);
        }
      }
    }

    // using the interview list, match interviews to applications to update or create
    setInterviewTime(user, interviews);

    return interviews;
  } catch (error) {
    throw new Error("Failed to find interview times from email.");
  }
};

// using the given interviews, tries to find a matching application and update the interviewAt field
// if no matching application, creates a new one with provided information
const setInterviewTime = async (user, interviews) => {
  if (interviews && interviews.length > 0) {
    // only use interviews that have date set
    const interviewDates = interviews.filter((interview) => {
      return interview.date;
    });

    interviewDates.forEach(async (interview) => {
      try {
        // try to find application with matching company and title
        const application = await matchApplication(user, interview);

        if (application.id) {
          // if id, an application was matched (edit)
          // check if interview date is assigned by an email, and if that email is the same one
          if (application.emailId !== interview.id) {
            try {
              let updatedApp = {
                interviewAt: new Date(interview.date),
                emailId: interview.id,
                categories: ["Autogenerated"],
                updatedAt: new Date(),
                interviewUpdated: new Date(),
              };

              // add category
              const connectedCats = await addCategories(
                user.id,
                updatedApp.categories
              );

              // update application data
              updatedApp.categories = { connect: connectedCats };

              const updated = await prisma.application.update({
                data: updatedApp,
                where: { id: updatedApp.id },
                include: {
                  company: {
                    select: {
                      name: true,
                    },
                  },
                  categories: {
                    select: {
                      name: true,
                      id: true,
                    },
                  },
                },
              });

              // format for elastic insert
              const { companyName, company, ...app } = updated;
              const document = { ...app, companyName: company.name };
              // updates document in the index
              const elasticResponse = await client.index({
                index: ELASTIC_INDEX,
                id: document.id.toString(),
                document,
              });
            } catch (err) {
              return res
                .status(500)
                .json({ error: "Failed to update application." });
            }
          } // if same email already used to set date, don't update
          // further handling can be added here if overwriting a set interview date is not the desired behavior
        } else {
          // if no matching application found, make new one
          const newApplication = {
            user: { connect: { id: user.id } },
            appliedAt: new Date(),
            title: interview.title,
            companyName: interview.company,
            emailId: interview.id,
            interviewAt: new Date(interview.date),
            status: "Interview",
            description:
              "This application was auto-generated with information from an Interview Confirmation email. Make sure to check the details, as information may be incorrect.",
            categories: [{ name: "Autogenerated" }],
            interviewUpdated: new Date(),
          };

          try {
            // try to find company to add companyId or make new company
            let connectedCompanyId;
            const existingCompany = await prisma.company.findFirst({
              where: {
                userId: user.id,
                name: newApplication.companyName,
              },
            });
            if (existingCompany) {
              connectedCompanyId = existingCompany.id;
            } else {
              const newCompany = await prisma.company.create({
                data: {
                  userId: user.id,
                  name: newApplication.companyName,
                },
              });
              connectedCompanyId = newCompany.id;
            }
            // connect the company to the application
            newApplication.company = { connect: { id: connectedCompanyId } };

            // add category
            const connectedCats = await addCategories(
              user.id,
              newApplication.categories
            );

            // update application data
            newApplication.categories = { connect: connectedCats };

            const created = await prisma.application.create({
              data: newApplication,
              include: {
                company: {
                  select: {
                    name: true,
                  },
                },
                categories: {
                  select: {
                    name: true,
                    id: true,
                  },
                },
              },
            });

            // format for elastic insert
            const { companyName, company, ...app } = created;
            const document = { ...app, companyName: company.name };
            // updates elastic index with new document
            const elasticResponse = await client.index({
              index: ELASTIC_INDEX,
              id: document.id.toString(),
              document,
            });
          } catch (err) {
            return res
              .status(500)
              .json({ error: "Failed to create application." });
          }
        }
      } catch (error) {
        // failed to set interview, skip
      }
    });
  }
};

// tries to find matching application by title and company
const matchApplication = async (user, interview) => {
  try {
    const applications = await prisma.application.findMany({
      where: {
        title: interview.title,
        company: { name: interview.company },
        userId: user.id,
      },
      include: { company: { select: { name: true } } },
    });
    if (applications.length > 0) {
      return applications[0];
    }
    return {};
  } catch (err) {
    throw err;
  }
};

const addCategories = async (userId, categories) => {
  let connected = [];
  for (const item of categories) {
    // returns category, either existing or new based on name
    const upsertCategory = await prisma.category.upsert({
      where: {
        name: item.name,
      },
      update: {},
      create: {
        name: item.name,
      },
    });
    // connects category to the user
    await prisma.category.update({
      where: { id: upsertCategory.id },
      data: {
        users: {
          connect: { id: userId },
        },
      },
    });

    // adds category to connect for application
    connected.push({ id: upsertCategory.id });
  }

  return connected;
};

// recursively scans parts array until text/plain is found, otherwise returns null
const findBodyText = (payload) => {
  if (payload.parts) {
    for (const part of payload.parts) {
      if (part.mimeType === "text/plain" && part.body?.data) {
        // base case: part is plain text, decode and return
        const decodedText = atob(
          part.body.data.replace(/-/g, "+").replace(/_/g, "/")
        );
        return decodedText;
      } else if (part.mimeType?.startsWith("multipart/") && part.parts) {
        // continue to next layer of parts
        return findBodyText(part);
      }
    }
  }
  // base case: no more parts, return null
  return null;
};

// given a message, attempts to read text and extract interview information
// currently, plain text must match Regex formattting to be read in
const parseMessage = async (message, data) => {
  let bodyText = null;
  // if plain text email, read directly from body data
  if (data.payload.body.data) {
    const encodedText = data.payload.body.data;
    bodyText = atob(encodedText.replace(/-/g, "+").replace(/_/g, "/"));
  } else {
    bodyText = findBodyText(data.payload);
  }

  if (bodyText) {
    const newInterview = { id: message.id, duration: {} };

    // TODO: instead search for dateString + timezone separately to avoid separating and then recombining parts
    let matchedText;
    // find meeting location as any characters before the next new line
    const positionRegexFormat = /Position:\s*(.*)\s*\n/;
    if ((matchedText = positionRegexFormat.exec(bodyText))) {
      newInterview.title = matchedText[1];
    } else {
      newInterview.title = "Unknown Position";
    }

    const companyRegexFormat = /Company:\s*(.*)\s*\n/;
    if ((matchedText = companyRegexFormat.exec(bodyText))) {
      newInterview.company = matchedText[1];
    } else {
      newInterview.company = "No Associated Company";
    }

    // from text, find date using formatting for abbreviated or full month names
    // text needs to be in "Month d, yyyy h:mm ampm timezone" format
    const dateRegexFormat =
      /\b([A-Za-z]{3,9})\s(\d{1,2}),\s(\d{4})\s(\d{1,2}):(\d{2})\s([AP]M)(?:\s([A-Z]{2,4}))?\b/g;
    if ((matchedText = dateRegexFormat.exec(bodyText))) {
      // get each value and separate timezone
      const month = matchedText[1];
      const day = matchedText[2];
      const year = matchedText[3];
      const hour = matchedText[4];
      const minute = matchedText[5];
      const ampm = matchedText[6];
      let timezone;
      if (matchedText[7]) {
        timezone = matchedText[7];
      } else {
        timezone = "local";
      }

      // string recombining parts into needed format (minus timezone)
      const date = `${month} ${day}, ${year} ${hour}:${minute} ${ampm}`;
      const parsedDate = DateTime.fromFormat(date, "LLLL d, yyyy h:mm a", {
        zone: timeZoneAbbr.timeZone,
      });
      const interviewDate = new Date(parsedDate.toISO());
      newInterview.date = interviewDate;
      newInterview.timeZone = parsedDate.zoneName;
    }
    // find meeting location as any characters before the next new line
    const locationRegexFormat = /Location:\s*(.*)\s*\n/;
    if ((matchedText = locationRegexFormat.exec(bodyText))) {
      newInterview.location = matchedText[1];
    } else {
      newInterview.location = "Unknown Location";
    }

    // find duration as "number unit" with optional second "number unit" (if hours and mintutes)
    const durationRegexFormat = /Duration:\s*(\d*)\s*(.*)\s*(\d*\s*.*)?\n/;
    if ((matchedText = durationRegexFormat.exec(bodyText))) {
      try {
        if (
          matchedText[2] === "hr" ||
          matchedText[2] === "hour" ||
          matchedText[2] === "hrs" ||
          matchedText[2] === "hours"
        ) {
          newInterview.duration.hours = parseInt(matchedText[1]);

          if (matchedText[3]) {
            newInterview.duration.minutes = parseInt(matchedText[3]);
          }
        } else {
          newInterview.duration.minutes = parseInt(matchedText[1]);
        }
      } catch (err) {
        // duration formatting unreadable, continue
      }
    }

    // find interviewers as "firstname lastname" with option comma-separated list
    const attendeesRegexFormat =
      /Interviewer(\(s\))?:\s*(\w*)\s*(\w*)(,\s*\w*\s*\w*)*\s*\n/;
    if ((matchedText = attendeesRegexFormat.exec(bodyText))) {
      newInterview.interviewee = matchedText[2] + matchedText[3];
    }

    return newInterview;
  }
  // if information can not be extracted, return null
  return null;
};

// gets new emails (since email last scanned) from user's inbox containing "interview confirmation" keywords
const getMessages = async (user) => {
  // first scan happens on initial login, chron job should call from interval of scan (1 day prior for daily scans)
  let searchTime = null;

  // emailScanned is upated when job runs, otherwise when user interacts with the page
  if (user.emailScanned) {
    // if user logged in since last job, use this time
    const scanDate = new Date(user.emailScanned);
    searchTime = Math.floor(scanDate.getTime() / 1000);
  } else {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    searchTime = Math.floor(yesterday.getTime() / 1000);
  }
  const apiURL = `https://gmail.googleapis.com/gmail/v1/users/${user.email}/messages?includeSpamTrash=true&q=subject:(Interview Confirmation) to:${user.email} after:${searchTime}`;

  try {
    const response = await fetch(apiURL, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.access_token}`,
      },
    });
    if (!response.ok) {
      const text = await response.json();
      throw new Error(text.error || "Failed to fetch messages.");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

// using email id, gets the data for that message from Gmail API
const getMessage = async (user, message) => {
  try {
    const response = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/${user.email}/messages/${message.id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.access_token}`,
        },
      }
    );
    if (!response.ok) {
      const text = await response.json();
      throw new Error(text.error);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    throw error;
  }
};

module.exports = router;
