const { LogStatus } = require("../data/enums");

require("dotenv").config();

const DATADOG_API_KEY = process.env.DATADOG_API_KEY;
const DEV = process.env.DEV;
const PROD = process.env.PROD;

// creates log using param and sends to datadog intake endpoint
async function logDDMessage(message, status) {
  if (!Object.values(LogStatus).includes(status)) {
    return false;
  }
  const logMessage = {
    message: message || "Log with unknown message",
    status,
    ddsource: "nodejs",
    service: PROD || DEV,
    ddtags: "env:production,team:web",
  };
  try {
    // Validate that new note has required fields
    const created = await fetch(
      "https://http-intake.logs.us5.datadoghq.com/api/v2/logs",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "DD-API-KEY": DATADOG_API_KEY,
        },
        body: JSON.stringify(logMessage),
      }
    );
    return true;
  } catch (err) {
    return false;
  }
}

module.exports = { logDDMessage };
