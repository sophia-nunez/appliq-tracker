const router = require("express").Router();
const { PrismaClient } = require("../generated/prisma");

const prisma = new PrismaClient();

// [GET] many companies with optional search
router.get("/companies", async (req, res, next) => {
  const search = req.query;

  const where = {};
  // order favorite first, then by most recent
  let orderBy = [{ isFavorite: "desc" }, { favoritedAt: "desc" }];

  if (search.name) {
    // if title query, search by title
    where.name = {
      contains: search.name,
      mode: "insensitive",
    };
  }

  if (search.category) {
    // if industry query, search by industry
    if (search.industry === "all") {
    } else {
      where.industry = {
        contains: search.industry,
      };
    }
  }

  try {
    const companies = await prisma.company.findMany({ where, orderBy });
    if (companies) {
      res.json(companies);
    } else {
      next({ status: 404, message: `No companies found` });
    }
  } catch (err) {
    next(err);
  }
});

// [GET] one company by id
router.get("/companies/:id", async (req, res, next) => {
  const id = parseInt(req.params.id);
  try {
    const company = await prisma.company.findUnique({ where: { id } });
    if (company) {
      res.json(company);
    } else {
      next({ status: 404, message: "Company not found" });
    }
  } catch (err) {
    next(err);
  }
});

// [POST] create company
router.post("/companies", async (req, res, next) => {
  const newCompany = req.body;
  try {
    // Validate that new company has required fields
    // TODO check for duplicate by name
    const newCompanyValid =
      newCompany.name !== undefined && newCompany.userId !== undefined;
    if (newCompanyValid) {
      const created = await prisma.company.create({ data: newCompany });
      res.status(201).json(created);
    } else {
      next({
        status: 422,
        message: "company name required",
      });
    }
  } catch (err) {
    next(err);
  }
});

// [DELETE] delete company
router.delete("/companies/:id", async (req, res, next) => {
  const id = Number(req.params.id);
  try {
    const company = await prisma.company.findUnique({ where: { id } });
    if (company) {
      const deleted = await prisma.company.delete({ where: { id } });
      res.json(deleted);
    } else {
      next({ status: 404, message: "Company not found" });
    }
  } catch (err) {
    next(err);
  }
});

// [PUT] modify company

module.exports = router;
