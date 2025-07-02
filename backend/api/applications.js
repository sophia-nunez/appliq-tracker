const router = require("express").Router();
const { PrismaClient } = require("../generated/prisma");

const prisma = new PrismaClient();

router.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  next();
});

const isAuthenticated = (req, res, next) => {
  if (!req.session.userId) {
    return res
      .status(401)
      .json({ error: "You must be logged in to view this page." });
  }
  next();
};

// [GET] many applications with optional search
router.get("/applications", isAuthenticated, async (req, res, next) => {
  const search = req.query;

  const where = { userId: req.session.userId };
  // order featured first, then by most recent
  let orderBy = [{ isFeatured: "desc" }, { appliedAt: "desc" }];

  if (search.text) {
    // if given search text, look in title, company, notes, and description for a match
    where.OR = [
      { title: { contains: search.text, mode: "insensitive" } },
      { companyName: { contains: search.text, mode: "insensitive" } },
      { description: { contains: search.text, mode: "insensitive" } },
      { notes: { contains: search.text, mode: "insensitive" } },
    ];
  }

  if (search.category) {
    // if cat query, search by category
    if (search.category === "all") {
    } else {
      where.categories = {
        some: { name: search.category },
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
router.get("/applications/:id", isAuthenticated, async (req, res, next) => {
  const id = parseInt(req.params.id);
  try {
    const application = await prisma.application.findUnique({
      where: { id, userId: req.session.userId },
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

// returns existing category or new one based on name given
const addCategories = async (userId, category) => {
  // check if already exists
  const existing = await prisma.category.findFirst({
    where: { name: category.name },
  });
  if (existing) {
    // if category exists, return it
    return existing;
  } else {
    // if new, create category and return
    const newCategory = await prisma.category.create({
      data: {
        userId,
        name: category.name,
      },
    });

    return newCategory;
  }
};

// [POST] create application
router.post("/applications", isAuthenticated, async (req, res, next) => {
  let data = {};
  if (req.body.removedCategories) {
    const { removedCategories, ...data } = req.body;
  } else {
    data = { ...req.body };
  }
  const newApplication = { ...data, userId: req.session.userId };
  let categories = { connect: [] };
  try {
    // Validate that new application has required fields
    const newApplicationValid =
      newApplication.title !== undefined &&
      newApplication.companyName !== undefined &&
      newApplication.status !== undefined &&
      newApplication.userId !== undefined;
    if (newApplicationValid) {
      // try to find company to add companyId
      const existingCompany = await prisma.company.findFirst({
        where: { userId: req.session.userId, name: newApplication.companyName },
      });
      if (existingCompany) {
        newApplication.companyId = existingCompany.id;
      }
      // adding categories, either add existing or create new one
      if (newApplication.categories) {
        for (const item of newApplication.categories) {
          // for each category name, get appropriate category
          const toAdd = await addCategories(req.session.userId, item);
          // and add to connection list
          categories.connect.push({ id: toAdd.id });
        }
        // replace categories
        newApplication.categories = categories;
      }

      const created = await prisma.application.create({ data: newApplication });
      return res.status(201).json(created);
    } else {
      return res.status(400).json({ error: "Missing required fields" });
    }
  } catch (err) {
    return res.status(500).json({ error: "Failed to create application." });
  }
});

router.put("/applications/:appId", isAuthenticated, async (req, res, next) => {
  const id = Number(req.params.appId);
  // separate field of categories to be removed
  const { removedCategories, ...data } = req.body;
  const updatedApp = { ...data, userId: req.session.userId };
  let categories = { connect: [], disconnect: removedCategories };
  try {
    // Make sure the ID is valid
    const application = await prisma.application.findUnique({
      where: { id, userId: req.session.userId },
    });

    if (!application) {
      return res.status(400).json({ error: "Application not found" });
    }

    // Validate that application has required fields
    const updatedAppValid = updatedApp.userId !== undefined;
    if (updatedAppValid) {
      if (updatedApp.companyName) {
        // if companyName is changed, check if that company exists
        const existingCompany = await prisma.company.findFirst({
          where: { userId: req.session.userId, name: updatedApp.companyName },
        });
        if (existingCompany) {
          updatedApp.companyId = existingCompany.id;
        } else {
          // if no matching company, remove any existing companyId
          updatedApp.companyId = null;
        }
      }

      // set updated time to now
      updatedApp.updatedAt = new Date();

      // add categories as needed
      if (updatedApp.categories) {
        for (const item of updatedApp.categories) {
          // for each category name, get appropriate category
          const toAdd = await addCategories(req.session.userId, item);
          // and add to connection list
          categories.connect.push({ id: toAdd.id });
        }
        // replace categories
        updatedApp.categories = categories;
      }
      const updated = await prisma.application.update({
        data: updatedApp,
        where: { id },
      });
      return res.status(201).json();
    } else {
      return res
        .status(400)
        .json({ error: "Application modifications are invalid" });
    }
  } catch (err) {
    return res.status(401).json({ error: "Failed to update application." });
  }
});

// [DELETE] delete application
router.delete("/applications/:id", isAuthenticated, async (req, res, next) => {
  const id = Number(req.params.id);
  try {
    const application = await prisma.application.findUnique({
      where: { id, userId: req.session.userId },
    });
    if (application) {
      const deleted = await prisma.application.delete({ where: { id } });
      res.json(deleted);
    } else {
      return res.status(404).json({ error: "Application not found" });
    }
  } catch (err) {
    return res.status(401).json({ error: "Failed to delete application." });
  }
});

// TODO: [PUT] modify application

module.exports = router;
