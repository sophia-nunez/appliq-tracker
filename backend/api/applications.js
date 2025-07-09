const router = require("express").Router();
const { PrismaClient } = require("../generated/prisma");

const prisma = new PrismaClient();

const middleware = require("../middleware/middleware");

router.use(middleware);

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
      { status: { contains: search.text, mode: "insensitive" } },
    ];
    // prioritize matches in position title
    orderBy = {
      _relevance: {
        fields: ["title"],
        search: search.text,
        sort: "asc",
      },
    };
  }

  // regardless of search, set orderBy takes precendance
  if (search.orderBy === "alphabetical") {
    orderBy = [{ isFeatured: "desc" }, { title: "asc" }];
  } else if (search.orderBy === "recent") {
    orderBy = [{ isFeatured: "desc" }, { appliedAt: "desc" }];
  } else if (search.orderBy === "interviewDate") {
    orderBy = [{ isFeatured: "desc" }, { interviewAt: "asc" }];
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

  if (search.status) {
    // filter for featured types (favorite, upcoming interview, signed/offer)
    where.OR = [
      { isFeatured: true },
      { interviewAt: { gt: new Date() } },
      { status: "Offer" },
      { status: "Signed" },
    ];
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

// [GET] get summary data for main chart
router.get(
  "/applications/data/group/:type",
  isAuthenticated,
  async (req, res, next) => {
    const where = { userId: req.session.userId };
    const type = req.params.type;

    try {
      const applications = await prisma.application.groupBy({
        where,
        by: [type],
        _count: {
          _all: true,
        },
      });
      if (applications) {
        res.json(applications);
      } else {
        next({ status: 404, message: `No applications found` });
      }
    } catch (err) {
      return res.status(401).json({ error: "Failed to get applications." });
    }
  }
);

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

// GET one application by title and company
// [GET] one application by id
router.get(
  "/applications/:company/:title",
  isAuthenticated,
  async (req, res, next) => {
    const companyName = req.params.company;
    const title = req.params.title;
    try {
      const applications = await prisma.application.findMany({
        where: { title, companyName, userId: req.session.userId },
      });
      if (applications.length > 0) {
        return res.json(applications[0]);
      }
      return res.status(200).json({});
    } catch (err) {
      return res.status(401).json({ error: "Application not found." });
    }
  }
);

// [POST] create application
router.post("/applications", isAuthenticated, async (req, res, next) => {
  const { removedCategories, ...data } = req.body;
  const newApplication = {
    ...data,
    user: { connect: { id: req.session.userId } },
  };
  let categories = { connectOrCreate: [] };
  try {
    // Validate that new application has required fields
    const newApplicationValid =
      newApplication.title !== undefined &&
      newApplication.companyName !== undefined &&
      newApplication.status !== undefined;

    if (newApplicationValid) {
      // try to find company to add companyId
      const existingCompany = await prisma.company.findFirst({
        where: { userId: req.session.userId, name: newApplication.companyName },
      });
      if (existingCompany) {
        newApplication.company = { connect: { id: existingCompany.id } };
      }
      // adding categories, either add existing or create new one
      if (newApplication.categories) {
        for (const item of newApplication.categories) {
          // connects existing or makes new one
          categories.connectOrCreate.push({
            where: { name: item.name },
            create: {
              name: item.name,
              users: { connect: { id: req.session.userId } },
            },
          });
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
  let categories = { connectOrCreate: [], disconnect: removedCategories };
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
          // connect existing or create new one
          categories.connectOrCreate.push({
            where: { name: item.name },
            create: {
              name: item.name,
              users: { connect: { id: req.session.userId } },
            },
          });
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

module.exports = router;
