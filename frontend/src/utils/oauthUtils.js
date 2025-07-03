import { baseURL, getUserInfo } from "./authUtils";
import { DateTime } from "luxon";

const timeZoneAbbr = {
  EST: "America/New_York",
  EDT: "America/New_York",
  PST: "America/Los_Angeles",
  PDT: "America/Los_Angeles",
};

const findInterviewTimes = async () => {
  const interviews = [];
  try {
    // get user information based on current session

    const user = await getUserInfo();

    if (!user.google_id) {
      // not linked to a google account, no action necessary
      throw Error("User does not have a linked Google account.");
    }

    const data = await getMessages(user);

    if (data.messages) {
      // get each message and parse information to find interview time
      data.messages.forEach(async (message) => {
        const data = await getMessage(user, message);

        let bodyText = null;
        // if plain text email, read directly from body data
        if (data.payload.body.data) {
          const encodedText = data.payload.body.data;
          bodyText = atob(encodedText.replace(/-/g, "+").replace(/_/g, "/"));
        }

        // TODO: set up recursion for multipart email

        if (bodyText) {
          const newInterview = { id: message.id, duration: {} };
          // from text, find date using formatting for abbreviated or full month names
          // text needs to be in "Month dd, yyyy hh:mm ampm timezone" format
          const dateRegexFormat =
            /\b([A-Za-z]{3,9})\s(\d{1,2}),\s(\d{4})\s(\d{1,2}):(\d{2})\s([AP]M)(?:\s([A-Z]{2,4}))?\b/g;

          // TODO: instead search for dateString + timezone separately to avoid separating and then recombining parts
          let matchedText;
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
            // fromFormat(text: string, fmt: string, opts: Object)
            const parsedDate = DateTime.fromFormat(
              date,
              "LLLL d, yyyy h:mm a",
              {
                zone: timeZoneAbbr.timeZone,
              }
            );
            const interviewDate = new Date(parsedDate.toISO());
            newInterview.date = interviewDate;
          }
          // find meeting location as any characters before the next new line
          const locationRegexFormat = /Location:\s*(.*)\s*\n/;
          if ((matchedText = locationRegexFormat.exec(bodyText))) {
            newInterview.location = matchedText[1];
          }

          // find duration as "number unit" with optional second "number unit" (if hours and mintutes)
          const durationRegexFormat =
            /Duration:\s*(\d*)\s*(.*)\s*(\d*\s*.*)?\n/;
          if ((matchedText = durationRegexFormat.exec(bodyText))) {
            if (
              matchedText[2] === "hr" ||
              matchedText[2] === "hour" ||
              matchedText[2] === "hrs" ||
              matchedText[2] === "hours"
            ) {
              newInterview.duration.hours = matchedText[1];

              if (matchedText[3]) {
                newInterview.duration.minutes = matchedText[3];
              }
            } else {
              newInterview.duration.minutes = matchedText[1];
            }
          }

          // find interviewers as "firstname lastname" with option comma-separated list
          const attendeesRegexFormat =
            /Interviewer(\(s\))?:\s*(\w*)\s*(\w*)(,\s*\w*\s*\w*)*\s*\n/;
          if ((matchedText = attendeesRegexFormat.exec(bodyText))) {
            newInterview.interviewee = matchedText[2] + matchedText[3];
          }

          newInterview.title = "MetaU Intern";

          console.log(newInterview);
          interviews.push(newInterview);
        }
      });
    }
    return interviews;
  } catch (error) {
    console.log(error);
    alert("Failed to find interview times.");
  }
};

const getMessages = async (user) => {
  try {
    const response = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/${user.email}/messages?includeSpamTrash=true&q=subject:(Interview Confirmation) to:${user.email}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.access_token}`,
        },
      }
    );
    if (!response.ok) {
      const text = await response.json();
      throw new Error(text.error || "Failed to fetch messages.");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

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
    console.log(error);
    throw error;
  }
};

export { findInterviewTimes };
