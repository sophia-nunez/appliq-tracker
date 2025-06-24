const express = require("express");
const cors = require("cors");

const server = express();
server.use(express.json());
server.use(cors());

server.get("/", (req, res) => {
  res.send("Welcome to my app!");
});

// [CATCH-ALL]
server.use((req, res, next) => {
  res.status(404).json();
});

module.exports = server;
