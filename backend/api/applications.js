const router = require("express").Router();
const { PrismaClient } = require("../generated/prisma");

const prisma = new PrismaClient();

router.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  next();
});

// [GET] many applications with optional search
router.get("/applications", async (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");

  const search = req.query;

  const where = {};
  // order featured first, then by most recent
  let orderBy = [{ isFeatured: "desc" }, { appliedAt: "desc" }];

  if (search.title) {
    // if title query, search by title
    where.title = {
      contains: search.title,
      mode: "insensitive",
    };
  }

  if (search.category) {
    // if cat query, search by category
    if (search.category === "all") {
    } else {
      where.categories = {
        contains: search.category,
      };
    }
  }

  try {
    const applications = await prisma.application.findMany({ where, orderBy });
    if (applications) {
      res.json(applications);
    } else {
      next({ status: 404, message: `No applications found` });
    }
  } catch (err) {
    return res.status(401).json({ error: "Failed to get applications." });
  }
});

// [GET] one application by id
router.get("/applications/:id", async (req, res, next) => {
  const id = parseInt(req.params.id);
  try {
    const application = await prisma.application.findUnique({
      where: { id },
      include: { categories: true },
    });
    if (application) {
      res.json(application);
    } else {
      next({ status: 404, message: "Application not found" });
    }
  } catch (err) {
    return res.status(401).json({ error: "Application not found." });
  }
});

// [POST] create application
router.post("/applications", async (req, res, next) => {
  const newApplication = { ...req.body, userId: req.session.userId };
  try {
    // Validate that new application has required fields
    // TODO add companyId from name if possible (find company)
    // TODO same for category and user
    const newApplicationValid =
      newApplication.title !== undefined &&
      newApplication.companyName !== undefined &&
      newApplication.status !== undefined &&
      newApplication.userId !== undefined;
    if (newApplicationValid) {
      const created = await prisma.application.create({ data: newApplication });
      return res.status(201).json(created);
    } else {
      return res.status(400).json({ error: "Missing required fields" });
    }
  } catch (err) {
    return res.status(401).json({ error: "Failed to create application." });
  }
});

// [DELETE] delete application
router.delete("/applications/:id", async (req, res, next) => {
  const id = Number(req.params.id);
  try {
    const application = await prisma.application.findUnique({ where: { id } });
    if (application) {
      const deleted = await prisma.application.delete({ where: { id } });
      res.json(deleted);
    } else {
      next({ status: 404, message: "Application not found" });
    }
  } catch (err) {
    return res.status(401).json({ error: "Failed to delete application." });
  }
});

// TODO: [PUT] modify application

module.exports = router;
