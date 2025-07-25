const router = require("express").Router();
require("dotenv").config();
const { PrismaClient } = require("../generated/prisma");

const prisma = new PrismaClient();
const DEV = process.env.DEV;
const PROD = process.env.PROD;

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

router.use(async (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", PROD || DEV);

  // get user information to check access
  if (req.session.userId) {
    const user = await prisma.user.findUnique({
      where: { id: req.session.userId },
      select: {
        auth_provider: true,
        refresh_token: true,
        token_expiry: true,
      },
    });

    // if google user and access is expired, get new token
    if (user.auth_provider === "google") {
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
            data: { access_token: credentials.access_token, token_expiry },
            where: { id: req.session.userId },
          });
        } catch (error) {
          req.session.destroy(() => {
            res.clearCookie("connect.sid");
            res.status(401).json({
              error: "Failed to update Google login. Please log in again.",
            });
          });
          return;
        }
      }
    }
  }
  next();
});

module.exports = router;
