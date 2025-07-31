const router = require("express").Router();
const { PrismaClient } = require("../generated/prisma");

const prisma = new PrismaClient();

const middleware = require("../middleware/middleware");
const { logDDMessage } = require("../utils/logUtils");

const isAuthenticated = (req, res, next) => {
  if (!req.session.userId) {
    return res
      .status(401)
      .json({ error: "You must be logged in to view this page." });
  }
  next();
};

router.use(middleware);

// [GET] many categories
router.get("/categories", isAuthenticated, async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      where: { users: { some: { id: req.session.userId } } },
    });
    if (categories) {
      res.json(categories);
    } else {
      return res.status(404).json({
        error: "Categories not found.",
      });
    }
  } catch (err) {
    logDDMessage(
      `Error getting categories for user ID: ${req.session.userId}.\nError Status: ${err.status}\nError Message: ${err.message}`,
      LogStatus.ERROR
    );
    res.status(500).json({ error: "Failed to get categories." });
  }
});

// [GET] one category by id
router.get("/categories/:id", isAuthenticated, async (req, res, next) => {
  const id = parseInt(req.params.id);
  try {
    const category = await prisma.category.findUnique({
      where: { id, users: { some: { id: req.session.userId } } },
    });
    if (category) {
      res.json(category);
    } else {
      return res.status(404).json({
        error: "Category not found.",
      });
    }
  } catch (err) {
    logDDMessage(
      `Error getting category ID: ${id}.\nError Status: ${err.status}\nError Message: ${err.message}`,
      LogStatus.ERROR
    );
    res.status(404).json({ error: "Failed to get category." });
  }
});

// [GET] one category by name
router.get(
  "/categories/name/:name",
  isAuthenticated,
  async (req, res, next) => {
    const name = parseInt(req.params.name);
    try {
      const category = await prisma.category.findUnique({
        where: { name, users: { some: { id: req.session.userId } } },
      });
      if (category) {
        res.json(category);
      } else {
        return res.status(404).json({
          error: "Category not found.",
        });
      }
    } catch (err) {
      logDDMessage(
        `Error getting category with name: ${name}.\nError Status: ${err.status}\nError Message: ${err.message}`,
        LogStatus.ERROR
      );
      res.status(500).json({ error: "Failed to get category." });
    }
  }
);

// [POST] create category
router.post("/categories", isAuthenticated, async (req, res, next) => {
  const newCategory = {
    ...req.body,
    users: { connect: { id: req.session.userId } },
  };
  try {
    // Validate that new category has required fields
    const newCategoryValid =
      newCategory.name !== undefined && newCategory.name.length < 21;
    if (newCategoryValid) {
      const created = await prisma.category.create({ data: newCategory });
      res.status(201).json(created);
    } else {
      return res.status(422).json({
        error: "Name is required and must be less than 20 characters.",
      });
    }
  } catch (err) {
    logDDMessage(
      `Error creating category.\nError Status: ${err.status}\nError Message: ${err.message}`,
      LogStatus.ERROR
    );
    res.status(500).json({ error: "Failed to create category." });
  }
});

// [DELETE] delete category
router.delete("/categories/:id", isAuthenticated, async (req, res, next) => {
  const id = Number(req.params.id);
  try {
    const category = await prisma.category.findUnique({
      where: { id, users: { some: { id: req.session.userId } } },
    });
    if (category) {
      const deleted = await prisma.category.delete({ where: { id } });
      res.json(deleted);
    } else {
      return res.status(404).json({
        error: "Category not found.",
      });
    }
  } catch (err) {
    logDDMessage(
      `Error deleting category ID: ${id}.\nError Status: ${err.status}\nError Message: ${err.message}`,
      LogStatus.ERROR
    );
    res.status(404).json({ error: "Failed to delete category." });
  }
});

module.exports = router;
