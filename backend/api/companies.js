const router = require("express").Router();
const { PrismaClient } = require("../generated/prisma");
const Order = require("../data/enums");
const { Client } = require("@elastic/elasticsearch");

// env variables
require("dotenv").config();
const ELASTIC_API_KEY = process.env.ELASTIC_API_KEY;
const URL = process.env.ELASTIC_URL;
const ELASTIC_INDEX = process.env.ELASTIC_INDEX;

const client = new Client({
  node: URL,
  auth: {
    apiKey: ELASTIC_API_KEY,
  },
  tls: { rejectUnauthorized: false },
});

const prisma = new PrismaClient();
const middleware = require("../middleware/middleware");

const isAuthenticated = (req, res, next) => {
  if (!req.session.userId) {
    return res
      .status(401)
      .json({ error: "You must be logged in to view this page." });
  }
  next();
};

router.use(middleware);

// [GET] many companies with optional search
router.get("/companies", async (req, res, next) => {
  const search = req.query;

  // if no page given, default to 0 (initial page)
  const pageNum = Number(search.page);
  const page = isFinite(pageNum) && pageNum > 0 ? pageNum - 1 : 0;
  // perPage minimum is 5
  const perPageNum = Number(search.perPage);
  const perPage = isFinite(perPageNum) && perPageNum > 5 ? perPageNum : 5;

  const where = { userId: req.session.userId };
  // order favorite first, then by most recent
  let orderBy = [{ isFavorite: "desc" }, { favoritedAt: "desc" }];

  if (search.name) {
    // if title query, search by title
    where.name = {
      contains: search.name,
      mode: "insensitive",
    };
  }

  if (search.industry) {
    // if industry query, search by industry
    if (search.industry !== "all") {
      where.industry = search.industry;
    }
  }

  // regardless of search, set orderBy takes precendance
  switch (search.orderBy) {
    case Order.ALPHABETICAL:
      orderBy = [{ isFavorite: "desc" }, { name: "asc" }];
      break;
    case Order.RECENT:
      orderBy = [{ isFavorite: "desc" }, { createdAt: "desc" }];
      break;
  }

  try {
    let totalPages = 1;
    const count = await prisma.company.count({
      where,
    });
    if (count) {
      // return total pages based on count
      totalPages = Math.ceil(count / perPage);
    }

    const companies = await prisma.company.findMany({
      where,
      orderBy,
      skip: page * perPage,
      take: perPage,
    });

    if (companies) {
      const data = { companies, totalPages };
      res.json(data);
    } else {
      return res.status(404).json({ error: "No companies found" });
    }
  } catch (err) {
    return res.status(500).json({ error: "Failed to get companies." });
  }
});

// [GET] many companies with optional search
router.get("/companies/industries", isAuthenticated, async (req, res, next) => {
  const where = { userId: req.session.userId };

  try {
    const industries = await prisma.company.findMany({ where });
    if (industries) {
      res.json(industries);
    } else {
      return res.status(404).json({ error: "No companies found" });
    }
  } catch (err) {
    return res.status(500).json({ error: "Failed to get companies." });
  }
});

// [GET] one company by id
router.get("/companies/:id", async (req, res, next) => {
  const id = parseInt(req.params.id);
  try {
    const company = await prisma.company.findUnique({
      where: { id, userId: req.session.userId },
      include: { applications: true },
    });
    if (company) {
      res.json(company);
    } else {
      return res.status(404).json({ error: "Company not found" });
    }
  } catch (err) {
    return res.status(500).json({ error: "Failed to get company" });
  }
});

// [GET] one company by name
router.get("/companies/:name", async (req, res, next) => {
  const name = parseInt(req.params.name);
  try {
    const company = await prisma.company.findUnique({
      where: { name, userId: req.session.userId },
    });
    if (company) {
      res.json(company);
    } else {
      return res.status(404).json({ error: "Company not found" });
    }
  } catch (err) {
    return res.status(500).json({ error: "Failed to get company" });
  }
});

// [POST] create company
router.post("/companies", isAuthenticated, async (req, res, next) => {
  const newCompany = { ...req.body, userId: req.session.userId };
  let matchingApplications = [];
  try {
    // Validate that new company has required fields
    const newCompanyValid =
      newCompany.name !== undefined && newCompany.userId !== undefined;
    if (newCompanyValid) {
      const existingCompany = await prisma.company.findFirst({
        where: { name: newCompany.name, userId: req.session.userId },
      });
      if (!existingCompany) {
        matchingApplications = await prisma.application.findMany({
          where: { userId: req.session.userId, companyName: newCompany.name },
        });

        // create new company
        const created = await prisma.company.create({ data: newCompany });

        // add company id to applications with matching company names
        for (const application of matchingApplications) {
          await prisma.application.update({
            data: { companyId: created.id },
            where: { userId: req.session.userId, id: application.id },
          });
        }

        // also add company id and name to elastic
        const operations = matchingApplications.flatMap((application) => {
          return [
            {
              update: {
                _id: application.id,
                _index: ELASTIC_INDEX,
              },
            },
            {
              doc: {
                companyId: created.id,
                companyName: created.name,
              },
            },
          ];
        });

        if (operations && operations.length > 0) {
          const elasticResponse = await client.bulk({
            operations,
          });
        }

        res.status(201).json(created);
      } else {
        return res.status(422).json({ error: "Duplicate company." });
      }
    } else {
      return res.status(422).json({ error: "Company name required" });
    }
  } catch (err) {
    return res.status(500).json({ error: "Failed to create company." });
  }
});

// [PUT] update company
router.put("/companies/:companyId", isAuthenticated, async (req, res, next) => {
  // TODO if company name is updated, update applications with that company as well

  const { id, userId, createdAt, applications, ...rest } = req.body;
  const changes = { ...rest, userId };
  if (userId !== req.session.userId) {
    return res
      .status(401)
      .json({ message: "Application does not belong to signed in user." });
  }
  try {
    // Make sure the ID is valid
    const company = await prisma.company.findUnique({
      where: { id, userId },
    });

    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }

    // make sure name isn't being changed to another existing company
    if (changes.name && changes.name !== company.name) {
      const existingCompany = await prisma.company.findFirst({
        where: { name: changes.name, userId },
      });

      if (existingCompany) {
        return res.status(422).json({
          error:
            "Company with this name already exists. Please try a different name.",
        });
      }
    }

    // check if isFavorite is changing
    if (changes.isFavorite !== company.isFavorite) {
      if (changes.isFavorite) {
        // if set to favorite, set favoritedAt to current time
        changes.favoritedAt = new Date();
      } else {
        // unfavoriting, set to createdAt for sorting
        changes.favoritedAt = company.createdAt;
      }
    }

    // Validate that company has required fields
    const changesValid = changes.userId !== undefined;
    if (changesValid) {
      const updated = await prisma.company.update({
        data: changes,
        where: { id },
        include: {
          applications: true,
        },
      });

      const operations = updated.applications.flatMap((application) => {
        return [
          {
            update: {
              _id: application.id,
              _index: ELASTIC_INDEX,
            },
          },
          {
            doc: {
              companyName: updated.name,
            },
          },
        ];
      });

      if (operations && operations.length > 0) {
        const elasticResponse = await client.bulk({
          operations,
        });
      }

      return res.status(201).json(updated);
    } else {
      return res
        .status(400)
        .json({ error: "Company modifications are invalid" });
    }
  } catch (err) {
    return res.status(500).json({ error: "Failed to update company." });
  }
});

// [DELETE] delete company
router.delete("/companies/:id", async (req, res, next) => {
  const id = Number(req.params.id);
  try {
    const company = await prisma.company.findUnique({
      where: { id, userId: req.session.userId },
    });
    if (company) {
      const deleted = await prisma.company.delete({ where: { id } });
      res.json(deleted);
    } else {
      return res.status(404).json({ error: "Company not found" });
    }
  } catch (err) {
    return res.status(500).json({ error: "Failed to get company" });
  }
});

module.exports = router;
