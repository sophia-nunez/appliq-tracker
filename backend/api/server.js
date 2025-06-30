const express = require("express");
const session = require("express-session");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const bcrypt = require("bcrypt");
const { PrismaClient } = require("../generated/prisma");

const applicationRouter = require("./applications");
const categoryRouter = require("./categories");
const companyRouter = require("./companies");

const prisma = new PrismaClient();
const server = express();
let sessionConfig = {
  name: "session",
  secret: process.env.SESSION_SECRET,
  rolling: true,
  cookie: {
    httpOnly: true,
    domain: "localhost",
    secure: false,
    sameSite: "lax",
  },
  resave: false,
  saveUninitialized: false,
};

server.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

server.use(session(sessionConfig));
server.use(express.json());
server.use(cors());
server.use(applicationRouter);
server.use(categoryRouter);
server.use(companyRouter);

server.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  next();
});

// user authentication
server.post("/register", async (req, res) => {
  const { username, password } = req.body;

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
      data: { username, password: hashedPassword },
    });
    res.status(201).json({ id: newUser.id, username: newUser.username });
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

    res.json({ id: user.id, username: user.username });
  } catch (err) {
    return res.status(401).json({ error: "Login failed." });
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

server.get("/me", async (req, res) => {
  if (!req.session.userId) {
    return res
      .status(401)
      .json({ message: "Not logged in: " + req.session.userId });
  }

  const user = await prisma.user.findUnique({
    where: { id: req.session.userId },
    select: { id: true, username: true },
  });
  res.json({ id: user.id, username: user.username });
});

// [CATCH-ALL]
server.use((req, res, next) => {
  res.status(404).json();
});

module.exports = server;
