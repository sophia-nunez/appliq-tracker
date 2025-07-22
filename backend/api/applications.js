const router = require("express").Router();
const { PrismaClient } = require("../generated/prisma");
const { Order, Periods } = require("../data/enums");

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

const APPS_PER_PAGE = 10;

// [GET] many applications with optional search
router.get("/applications", isAuthenticated, async (req, res, next) => {
  const search = req.query;
  // if no page given, default to 0 (initial page)
  const pageNum = Number(search.page);
  const page = isFinite(pageNum) && pageNum > 0 ? pageNum - 1 : 0;

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
  switch (search.orderBy) {
    case Order.ALPHABETICAL:
      orderBy = [{ isFeatured: "desc" }, { title: "asc" }];
      break;
    case Order.RECENT:
      orderBy = [{ isFeatured: "desc" }, { appliedAt: "desc" }];
      break;
    case Order.INTERVIEW:
      orderBy = [{ isFeatured: "desc" }, { interviewAt: "asc" }];
      break;
  }

  if (search.category) {
    // if cat query, search by category
    if (search.category !== "all") {
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
    const applications = await prisma.application.findMany({
      where,
      include: { company: { select: { name: true } } },
      orderBy,
      skip: page * APPS_PER_PAGE,
      take: APPS_PER_PAGE,
    });
    if (applications) {
      res.json(applications);
    } else {
      next({ status: 404, message: `No applications found` });
    }
  } catch (err) {
    return res.status(500).json({ error: "Failed to get applications." });
  }
});

router.get(
  "/applications/totalpages",
  isAuthenticated,
  async (req, res, next) => {
    const search = req.query;
    const where = { userId: req.session.userId };

    if (search.text) {
      // if given search text, look in title, company, notes, and description for a match
      where.OR = [
        { title: { contains: search.text, mode: "insensitive" } },
        { companyName: { contains: search.text, mode: "insensitive" } },
        { description: { contains: search.text, mode: "insensitive" } },
        { notes: { contains: search.text, mode: "insensitive" } },
        { status: { contains: search.text, mode: "insensitive" } },
      ];
    }

    if (search.category) {
      // if cat query, search by category
      if (search.category !== "all") {
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

    // count total application that match
    try {
      const count = await prisma.application.count({
        where,
      });
      return res.json(Math.ceil(count / APPS_PER_PAGE));
    } catch (err) {
      return res.status(500).json({ error: "Failed to get applications." });
    }
  }
);

// [GET] get data --> number of applications group by given type/field
router.get(
  "/applications/data/group/:type",
  isAuthenticated,
  async (req, res, next) => {
    const type = req.params.type;

    try {
      const applications = await prisma.application.groupBy({
        where: { userId: req.session.userId },
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

// [GET] get data --> number of applications group by given type/field
router.get(
  "/applications/data/dateRange/:period",
  isAuthenticated,
  async (req, res, next) => {
    const userId = req.session.userId;
    const period = req.params.period;

    if (!Object.values(Periods).includes(period)) {
      // invalid period
      return res.status(422).json({ error: "Invalid date range" });
    }

    let query = `
          SELECT DATE("appliedAt") AS day, CAST(COUNT(*) AS INT) as count
          FROM "Application"
          WHERE "userId" = ${userId}
          GROUP BY day
          ORDER BY day;
        `;
    if (period === Periods.CUSTOM) {
      const { start, end } = req.query;

      const startDate = start.substring(0, 10);
      const endDate = end.substring(0, 10);

      query = `
          SELECT DATE("appliedAt") AS day, CAST(COUNT(*) AS INT) as count
          FROM "Application"
          WHERE "userId" = ${userId} AND "appliedAt" BETWEEN '${startDate}' and '${endDate}'
          GROUP BY day
          ORDER BY day;
        `;
    } else if (period !== Periods.ALL) {
      query = `
          SELECT DATE("appliedAt") AS day, CAST(COUNT(*) AS INT) as count
          FROM "Application"
          WHERE "userId" = ${userId} AND "appliedAt" >= NOW() - INTERVAL '1 ${period}'
          GROUP BY day
          ORDER BY day;
        `;
    }

    try {
      const applications = await prisma.$queryRawUnsafe(query);

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

// [GET] company data orderBy number of applications of given status
router.get(
  "/applications/data/company/:orderBy",
  isAuthenticated,
  async (req, res, next) => {
    const sort = req.params.orderBy;
    const userId = req.session.userId;

    try {
      const applications = await prisma.application.groupBy({
        by: ["companyName", "status"],
        where: {
          userId: req.session.userId,
        },
        _count: {
          _all: true,
        },
      });

      if (applications) {
        res.json(applications);
      } else {
        return res.status(404).json({ error: "No applications found" });
      }
    } catch (err) {
      return res
        .status(500)
        .json({ error: "Failed to get grouped applications." });
    }
  }
);

// [GET] one application by id
router.get("/applications/id/:id", isAuthenticated, async (req, res, next) => {
  const id = parseInt(req.params.id);
  try {
    const application = await prisma.application.findUnique({
      where: { id, userId: req.session.userId },
      include: { categories: true, company: { select: { name: true } } },
    });
    if (application) {
      res.json(application);
    } else {
      next({ status: 404, message: "Application not found" });
    }
  } catch (err) {
    return res.status(500).json({ error: "Application not found." });
  }
});

// GET one application by title and company
// [GET] one application by id
router.get(
  "/applications/interview/:company/:title",
  isAuthenticated,
  async (req, res, next) => {
    const companyName = req.params.company;
    const title = req.params.title;
    try {
      const applications = await prisma.application.findMany({
        where: {
          title,
          company: { name: companyName },
          userId: req.session.userId,
        },
        include: { company: { select: { name: true } } },
      });
      if (applications.length > 0) {
        return res.json(applications[0]);
      }
      return res.status(200).json({});
    } catch (err) {
      return res.status(404).json({ error: "Application not found." });
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
  try {
    // Validate that new application has required fields
    const newApplicationValid =
      newApplication.title !== undefined &&
      newApplication.status !== undefined &&
      newApplication.companyName !== undefined;

    if (newApplicationValid) {
      // try to find company to add companyId or make new company
      let connectedCompanyId;
      const existingCompany = await prisma.company.findFirst({
        where: { userId: req.session.userId, name: newApplication.companyName },
      });
      if (existingCompany) {
        connectedCompanyId = existingCompany.id;
      } else {
        const newCompany = await prisma.company.create({
          data: {
            userId: req.session.userId,
            name: newApplication.companyName,
          },
        });
        connectedCompanyId = newCompany.id;
      }
      // connect the company to the application
      newApplication.company = { connect: { id: connectedCompanyId } };

      let categories = { connect: [] };
      // adding categories, either add existing or create new one
      if (newApplication.categories) {
        // add categories to connect
        const connectedCats = await addCategories(
          req.session.userId,
          newApplication.categories
        );
        // replace categories to connect with matched list of ids
        categories.connect = connectedCats;
      }
      // update application category data
      newApplication.categories = categories;

      const created = await prisma.application.create({
        data: newApplication,
        include: {
          company: {
            select: {
              name: true,
            },
          },
        },
      });
      return res.status(201).json(created);
    } else {
      return res.status(400).json({ error: "Missing required fields" });
    }
  } catch (err) {
    return res.status(500).json({ error: "Failed to create application." });
  }
});

router.put(
  "/applications/edit/:appId",
  isAuthenticated,
  async (req, res, next) => {
    // separate field of categories to be removed
    const { id, userId, companyId, removedCategories, ...data } = req.body;
    if (userId !== req.session.userId) {
      return res
        .status(401)
        .json({ message: "Application does not belong to signed in user." });
    }
    const updatedApp = { ...data };
    try {
      // Make sure the ID is valid
      const application = await prisma.application.findUnique({
        where: { id, userId },
      });

      if (!application) {
        return res.status(400).json({ error: "Application not found" });
      }

      // Validate that application has required fields
      const updatedAppValid = id !== undefined;
      if (updatedAppValid) {
        if (updatedApp.companyName) {
          // if companyName is changed, check if that company exists
          const existingCompany = await prisma.company.findFirst({
            where: { userId, name: updatedApp.companyName },
          });
          if (existingCompany) {
            updatedApp.company = { connect: { id: existingCompany.id } };
          } else {
            // if no matching company, make new company
            const newCompany = await prisma.company.create({
              data: {
                userId,
                name: updatedApp.companyName,
              },
            });
            updatedApp.company = { connect: { id: newCompany.id } };
          }
        }

        // set updated time to now
        updatedApp.updatedAt = new Date();

        // object for category connections and removals
        let categories = { connect: [], disconnect: removedCategories };
        if (updatedApp.categories) {
          // add categories to connect
          const connectedCats = await addCategories(
            userId,
            updatedApp.categories
          );
          // replace categories to connect with matched list of ids
          categories.connect = connectedCats;
        }
        // update application data
        updatedApp.categories = categories;

        const updated = await prisma.application.update({
          data: updatedApp,
          where: { id },
          include: {
            company: {
              select: {
                name: true,
              },
            },
          },
        });
        return res.status(201).json(updated);
      } else {
        return res
          .status(400)
          .json({ error: "Application modifications are invalid" });
      }
    } catch (err) {
      return res.status(500).json({ error: "Failed to update application." });
    }
  }
);

const addCategories = async (userId, categories) => {
  let connected = [];
  for (const item of categories) {
    // returns category, either existing or new based on name
    const upsertCategory = await prisma.category.upsert({
      where: {
        name: item.name,
      },
      update: {},
      create: {
        name: item.name,
      },
    });
    // connects category to the user
    await prisma.category.update({
      where: { id: upsertCategory.id },
      data: {
        users: {
          connect: { id: userId },
        },
      },
    });

    // adds category to connect for application
    connected.push({ id: upsertCategory.id });
  }

  return connected;
};

// [DELETE] delete application
router.delete(
  "/applications/delete/:id",
  isAuthenticated,
  async (req, res, next) => {
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
      return res.status(500).json({ error: "Failed to delete application." });
    }
  }
);

module.exports = router;
