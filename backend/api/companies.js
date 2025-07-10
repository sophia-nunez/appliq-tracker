const router = require("express").Router();
const { PrismaClient } = require("../generated/prisma");

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
router.get("/companies", isAuthenticated, async (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");

  const search = req.query;

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
    if (search.industry === "all") {
    } else {
      where.industry = search.industry;
    }
  }

  // regardless of search, set orderBy takes precendance
  if (search.orderBy === "alphabetical") {
    orderBy = [{ isFavorite: "desc" }, { name: "asc" }];
  } else if (search.orderBy === "recent") {
    orderBy = [{ isFavorite: "desc" }, { createdAt: "desc" }];
  }

  try {
    const companies = await prisma.company.findMany({ where, orderBy });
    if (companies) {
      res.json(companies);
    } else {
      return res.status(404).json({ error: "No companies found" });
    }
  } catch (err) {
    return res.status(500).json({ error: "Failed to get companies." });
  }
});

// [GET] many companies with optional search
router.get("/companies/industries", isAuthenticated, async (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");

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
  // or should it remove the applications - make decision

  const id = Number(req.params.companyId);
  const changes = { ...req.body, userId: req.session.userId };
  try {
    // Make sure the ID is valid
    const company = await prisma.company.findUnique({
      where: { id, userId: req.session.userId },
    });

    if (!company) {
      return res.status(404).json({ error: "Company not found" });
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
      });
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
