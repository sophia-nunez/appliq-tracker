const router = require("express").Router();
const { PrismaClient } = require("../generated/prisma");

const prisma = new PrismaClient();

const getNewAccessToken = async (user) => {
  // get new access token using refresh token
  let payload = {
    grant_type: "refresh_token",
    refresh_token: user.refresh_token,
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
  };

  try {
    const response = await fetch(
      `https://oauth2.googleapis.com/token`,
      payload,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json;",
        },
      }
    );

    console.log(response);
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
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");

  if (req.session.userId) {
    const user = await prisma.user.findUnique({
      where: { id: req.session.userId },
      select: {
        auth_provider: true,
        refresh_token: true,
        token_expiry: true,
      },
    });

    // TODO: get token refresh completed
    if (user.auth_provider === "google") {
      const expiration = new Date(user.token_expiry);
      const deadline = new Date();
      if (expiration <= deadline) {
        // refresh token
        const credentials = getNewAccessToken(user);
        console.log(credentials);
      }
    }
  }
  next();
});

module.exports = router;
