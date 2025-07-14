const router = require("express").Router();
const { PrismaClient } = require("../generated/prisma");
const { Client } = require("@elastic/elasticsearch");

// env variables
require("dotenv").config();
const ELASTIC_API_KEY = process.env.ELASTIC_API_KEY;
const URL = process.env.ELASTIC_URL;

// middleware
const middleware = require("../middleware/middleware");
router.use(middleware);

const prisma = new PrismaClient();
const client = new Client({
  node: URL,
  auth: {
    apiKey: ELASTIC_API_KEY,
  },
  tls: { rejectUnauthorized: false },
});

const isAuthenticated = (req, res, next) => {
  if (!req.session.userId) {
    return res
      .status(401)
      .json({ error: "You must be logged in to view this page." });
  }
  next();
};

// [GET] many applications with search
router.get("/applications/search", isAuthenticated, async (req, res, next) => {
  const search = req.query;

  let from = 0;
  if (search.page) {
    from = (search.page - 1) * 20;
  }

  let query = {
    bool: {
      must: [
        {
          query_string: {
            query: `${search.text}*`, // search term
            fields: ["public_application_title^2", "*"], // boost title so matches in title are more important
            analyze_wildcard: true,
          },
        },
        {
          match: {
            public_application_userid: req.session.userId, // user id
          },
        },
      ],
    },
  };

  try {
    const applications = await client.search({
      index: "content-postgresql-ac4b",
      from,
      size: 20,
      query,
    });
    if (applications) {
      // get list of ids
      const idList = applications.hits.hits.map((application) => {
        return application._source.public_application_id;
      });

      // get all applications from db
      const fullApplications = await prisma.application.findMany({
        where: {
          id: { in: idList },
        },
      });

      res.json(fullApplications);
    } else {
      next({ status: 404, message: `No applications found` });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Failed to get applications." });
  }
});

// TODO pages by having page number, then (20*pagenumber - 20) to get "from" field

module.exports = router;
