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

// [GET] many categories
router.get("/categories", isAuthenticated, async (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");

  try {
    const categories = await prisma.category.findMany({
      where: { userId: req.session.userId },
    });
    if (categories) {
      res.json(categories);
    } else {
      return res.status(404).json({
        error: "Categories not found.",
      });
    }
  } catch (err) {
    next(err);
  }
});

// [GET] one category by id
router.get("/categories/:id", isAuthenticated, async (req, res, next) => {
  const id = parseInt(req.params.id);
  try {
    const category = await prisma.category.findUnique({
      where: { id, userId: req.session.userId },
    });
    if (category) {
      res.json(category);
    } else {
      return res.status(404).json({
        error: "Category not found.",
      });
    }
  } catch (err) {
    next(err);
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
        where: { name, userId: req.session.userId },
      });
      if (category) {
        res.json(category);
      } else {
        return res.status(404).json({
          error: "Category not found.",
        });
      }
    } catch (err) {
      next(err);
    }
  }
);

// [POST] create category
router.post("/categories", isAuthenticated, async (req, res, next) => {
  const newCategory = req.body;
  try {
    // Validate that new category has required fields
    // TODO: add user
    const newCategoryValid =
      newCategory.name !== undefined &&
      newCategory.name.length < 21 &&
      newCategory.userId !== undefined;
    if (newCategoryValid) {
      const created = await prisma.category.create({ data: newCategory });
      res.status(201).json(created);
    } else {
      return res.status(422).json({
        error: "Name is required and must be less than 20 characters.",
      });
    }
  } catch (err) {
    next(err);
  }
});

// [DELETE] delete category
router.delete("/categories/:id", isAuthenticated, async (req, res, next) => {
  const id = Number(req.params.id);
  try {
    const category = await prisma.category.findUnique({
      where: { id, userId: req.session.userId },
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
    next(err);
  }
});

// TODO: [PUT] modify category (add Application)

module.exports = router;
