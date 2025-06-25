const express = require("express");
const session = require("express-session");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const bcrypt = require("bcrypt");
const { PrismaClient } = require("../generated/prisma");

const prisma = new PrismaClient();
const server = express();
let sessionConfig = {
  name: "sessionId",
  secret: process.env.SESSION_SECRET,
  rolling: true,
  cookie: {
    maxAge: 1000 * 60 * 15,
    secure: process.env.RENDER ? true : false,
    httpOnly: false,
  },
  resave: false,
  saveUninitialized: false,
};

server.use(session(sessionConfig));
server.use(express.json());
server.use(cors());

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
    res.status(201).json({ message: "Account created successfully!" });
  } catch (err) {
    return res.status(400).json({ error: "Failed to create account." });
  }
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 7,
  message: { error: "Too many failed login attempts. Try again later." },
});

server.post("/login", async (req, res) => {
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

    res.json({ message: "Login successful." });
  } catch (err) {
    return res.status(401).json({ error: "Login failed." });
  }
});

server.get("/me", async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Not logged in" });
  }

  const user = await prisma.user.findUnique({
    where: { id: req.session.userId },
    select: { username: true },
  });

  res.json({ id: req.session.userId, username: user.username });
});

// [CATCH-ALL]
server.use((req, res, next) => {
  res.status(404).json();
});

module.exports = server;
