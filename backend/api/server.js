require("dotenv").config();
const express = require("express");
const session = require("express-session");
const rateLimit = require("express-rate-limit");
const { OAuth2Client } = require("google-auth-library");
const cors = require("cors");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const { PrismaClient } = require("../generated/prisma");

// api routes
const applicationRouter = require("./applications");
const categoryRouter = require("./categories");
const companyRouter = require("./companies");
const noteRouter = require("./notes");
const searchRouter = require("./search");
const chronRouter = require("./chron");
const middleware = require("../middleware/middleware");
const { createCalendarURL } = require("../data/links");
const { encrypt, decrypt } = require("../utils/encryptionUtils");

// node environment indicators
const DEV = process.env.DEV;
const PROD = process.env.PROD;
const CURR_ENV = process.env.NODE_ENV;

const prisma = new PrismaClient();
const server = express();

const oAuth2Client = new OAuth2Client(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  "postmessage"
);

// set session config based on DEV or PROD
let sessionConfig = {};
if (CURR_ENV === "local") {
  sessionConfig = {
    name: "session",
    secret: process.env.SESSION_SECRET,
    rolling: true,
    cookie: {
      httpOnly: true,
      domain: "localhost",
      secure: false,
      sameSite: "lax",
      maxAge: 36000000, // 10 hours
    },
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(new PrismaClient(), {
      checkPeriod: 2 * 60 * 1000, //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  };
} else {
  sessionConfig = {
    name: "session",
    secret: process.env.SESSION_SECRET,
    rolling: true,
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 36000000, // 10 hours
    },
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(new PrismaClient(), {
      checkPeriod: 2 * 60 * 1000, //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  };
}

server.use(
  cors({
    origin: PROD || DEV,
    credentials: true,
  })
);

server.set("trust proxy", 1);
server.use(session(sessionConfig));
server.use(express.json());
server.use(cors());
server.use(chronRouter);
server.use(middleware);

server.use(applicationRouter);
server.use(categoryRouter);
server.use(companyRouter);
server.use(noteRouter);
server.use(searchRouter);

// user authentication
server.post("/register", async (req, res) => {
  const { username, password, colorScheme } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required." });
  }

  const existingUser = await prisma.user.findUnique({
    where: { username },
  });

  if (existingUser) {
    return res.status(400).json({ error: "Username already taken." });
  }

  if (password.length < 7) {
    return res
      .status(400)
      .json({ error: "Password must be at least 7 characters long." });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: { username, password: hashedPassword, colorScheme },
    });

    req.session.userId = newUser.id;

    res.status(201).json({
      id: newUser.id,
      type: newUser.auth_provider,
      username: newUser.username,
      colorScheme: newUser.colorScheme,
    });
  } catch (err) {
    return res.status(400).json({ error: "Failed to create account." });
  }
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 7,
  message: { error: "Too many failed login attempts. Try again later." },
});

server.post("/login", loginLimiter, async (req, res) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required." });
    }
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid username or password." });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!user || !isValidPassword) {
      return res.status(400).json({ error: "Invalid username or password." });
    }

    req.session.userId = user.id;

    res.json({
      id: user.id,
      type: user.auth_provider,
      username: user.username,
      colorScheme: user.colorScheme,
    });
  } catch (err) {
    return res.status(401).json({ error: "Login failed." });
  }
});

// get token information for user
server.post("/auth/google", async (req, res) => {
  try {
    const { tokens } = await oAuth2Client.getToken(req.body.code); // exchange code for tokens

    res.json(tokens);
  } catch (err) {
    res.status(500).json({ message: "Unable to authorize Google account." });
  }
});

// checks if google account already has profile (login), otherwise registers
server.post("/auth/google/login", async (req, res) => {
  const {
    expiry_date,
    sub,
    name,
    given_name,
    picture,
    email,
    access_token,
    refresh_token,
  } = req.body;

  if (!access_token || !sub || !email) {
    return res
      .status(400)
      .json({ error: "Google login failed - missing profile information." });
  }

  // encrypt important tokens
  const encryptedAccessToken = encrypt(access_token);
  let encryptedRefreshToken = refresh_token;
  if (refresh_token) {
    encryptedRefreshToken = encrypt(refresh_token);
  }

  const token_expiry = new Date(expiry_date);

  const existingUser = await prisma.user.findUnique({
    where: { google_id: sub },
  });

  if (existingUser) {
    // accounts exists, set logged in user
    req.session.userId = existingUser.id;

    const updated = await prisma.user.update({
      data: {
        access_token: encryptedAccessToken,
        refresh_token: encryptedRefreshToken,
        token_expiry,
      },
      where: { google_id: sub },
    });

    res.status(201).json({
      id: existingUser.id,
      type: existingUser.auth_provider,
      username: existingUser.name,
    });
  } else {
    try {
      // create "Interviews - Appliq" calendar
      const response = await fetch(createCalendarURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify({
          summary: "Interviews - Appliq",
          description:
            "Interviews generated by Appliq, a job application tracker found at https://appliq-tracker.onrender.com",
        }),
      });
      if (!response.ok) {
        const text = await response.json();
        throw new Error();
      }

      // calendar resource - contains information on created calendar, including id
      const calendar = await response.json();

      // create user with google information including appliq calendar
      const newUser = await prisma.user.create({
        data: {
          email,
          name: given_name,
          auth_provider: "google",
          google_id: sub,
          access_token: encryptedAccessToken,
          refresh_token: encryptedRefreshToken,
          token_expiry,
          calendarId: calendar.id,
        },
      });

      req.session.userId = newUser.id;

      res.status(201).json({
        id: newUser.id,
        type: newUser.auth_provider,
        username: newUser.name,
      });
    } catch (err) {
      return res.status(400).json({ error: "Failed to create account." });
    }
  }
});

server.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to log out" });
    }
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out successfully" });
  });
});

server.post("/track/login", async (req, res) => {
  // update login time
  if (req.session.userId) {
    await prisma.user.update({
      where: { id: req.session.userId },
      data: { lastLogin: new Date() },
    });

    res.status(204).end();
  } else {
    res.status(401).json({ error: "Failed to update. User is not logged in." });
  }
});

server.get("/me", async (req, res) => {
  if (!req.session.userId) {
    return res
      .status(401)
      .json({ message: "Not logged in: " + req.session.userId });
  }

  const user = await prisma.user.findUnique({
    where: { id: req.session.userId },
    select: {
      id: true,
      username: true,
      name: true,
      auth_provider: true,
      colorScheme: true,
    },
  });
  if (user.auth_provider === "google") {
    return res.json({
      id: user.id,
      username: user.name,
      type: user.auth_provider,
      colorScheme: user.colorScheme,
    });
  }
  res.json({
    id: user.id,
    username: user.username,
    type: user.auth_provider,
    colorScheme: user.colorScheme,
  });
});

server.get("/user", async (req, res) => {
  if (!req.session.userId) {
    return res
      .status(401)
      .json({ message: "Not logged in: " + req.session.userId });
  }

  const user = await prisma.user.findUnique({
    where: { id: req.session.userId },
    select: {
      id: true,
      username: true,
      name: true,
      email: true,
      auth_provider: true,
      google_id: true,
      access_token: true,
      emailScanned: true,
      calendarId: true,
    },
  });

  if (user.access_token) {
    const { access_token, ...rest } = user;
    const decryptedAccessToken = decrypt(access_token);
    return res.json({ access_token: decryptedAccessToken, ...rest });
  }
  res.json(user);
});

server.put("/user", async (req, res) => {
  const { emailScanned, colorScheme } = req.body;
  if (!req.session.userId) {
    return res
      .status(401)
      .json({ message: "Not logged in: " + req.session.userId });
  }

  let data;
  if (emailScanned) {
    data = { emailScanned };
  } else if (colorScheme) {
    data = { colorScheme };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.session.userId },
    });

    if (user) {
      const updated = await prisma.user.update({
        data,
        where: { id: req.session.userId },
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User updated successfully" });
  } catch (error) {
    return res.status(400).json({ error: "Failed to update account." });
  }
});

// [CATCH-ALL]
server.use((req, res, next) => {
  res.status(404).json();
});

module.exports = server;
