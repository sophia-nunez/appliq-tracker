const router = require("express").Router();
const { PrismaClient } = require("../generated/prisma");
const { Client } = require("@elastic/elasticsearch");

// env variables
require("dotenv").config();
const ELASTIC_API_KEY = process.env.ELASTIC_API_KEY;
const URL = process.env.ELASTIC_URL;
const ELASTIC_INDEX = process.env.ELASTIC_INDEX;

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

const APPS_PER_PAGE = 10;

// [GET] many applications with search
router.get("/applications/search", isAuthenticated, async (req, res, next) => {
  const search = req.query;

  // if no page given, default to 0 (initial page)
  const pageNum = Number(search.page);
  const page = isFinite(pageNum) && pageNum > 0 ? pageNum - 1 : 0;
  const from = page * 20;

  let query = {
    bool: {
      must: [
        {
          query_string: {
            query: `${search.text}*`, // search term
            fields: ["title^2", "*"], // boost title so matches in title are more important
            analyze_wildcard: true,
          },
        },
        {
          match: {
            userId: req.session.userId, // user id
          },
        },
      ],
    },
  };

  try {
    const applications = await client.search({
      track_total_hits: true,
      index: ELASTIC_INDEX,
      from,
      size: APPS_PER_PAGE,
      query,
    });
    if (applications) {
      // get list of ids
      const idList = applications.hits.hits.map((application) => {
        return application._source.id;
      });

      // get all applications from db
      const fullApplications = await prisma.application.findMany({
        where: {
          id: { in: idList },
        },
        include: {
          company: {
            select: {
              name: true,
            },
          },
        },
      });

      res.json({
        totalPages: Math.ceil(applications.hits.total.value / APPS_PER_PAGE),
        applications: fullApplications,
      });
    } else {
      next({ status: 404, message: `No applications found` });
    }
  } catch (err) {
    return res.status(500).json({ error: "Failed to get applications." });
  }
});

module.exports = router;
