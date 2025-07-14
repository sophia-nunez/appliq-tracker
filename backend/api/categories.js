const router = require("express").Router();
const { PrismaClient } = require("../generated/prisma");

const prisma = new PrismaClient();

// [GET] many categories
router.get("/categories", async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany();
    if (categories) {
      res.json(categories);
    } else {
      next({ status: 404, message: `No categories found` });
    }
  } catch (err) {
    next(err);
  }
});

// [GET] one category by id
router.get("/categories/:id", async (req, res, next) => {
  const id = parseInt(req.params.id);
  try {
    const category = await prisma.category.findUnique({ where: { id } });
    if (category) {
      res.json(category);
    } else {
      next({ status: 404, message: "Category not found" });
    }
  } catch (err) {
    next(err);
  }
});

// TODO: add GET for category by name ?

// [POST] create category
router.post("/categories", async (req, res, next) => {
  const newCategory = req.body;
  try {
    // Validate that new category has required fields
    // TODO: add user
    const newCategoryValid =
      newCategory.name !== undefined && newCategory.userId !== undefined;
    if (newCategoryValid) {
      const created = await prisma.category.create({ data: newCategory });
      res.status(201).json(created);
    } else {
      next({
        status: 422,
        message: "name is required",
      });
    }
  } catch (err) {
    next(err);
  }
});

// [DELETE] delete category
router.delete("/categories/:id", async (req, res, next) => {
  const id = Number(req.params.id);
  try {
    const category = await prisma.category.findUnique({ where: { id } });
    if (category) {
      const deleted = await prisma.category.delete({ where: { id } });
      res.json(deleted);
    } else {
      next({ status: 404, message: "Category not found" });
    }
  } catch (err) {
    next(err);
  }
});

// TODO: [PUT] modify category (add Application)

module.exports = router;
