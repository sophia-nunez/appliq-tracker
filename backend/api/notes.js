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

// [GET] many notes
router.get("/notes", isAuthenticated, async (req, res, next) => {
  try {
    const notes = await prisma.note.findMany({
      where: { userId: req.session.userId },
    });
    if (notes) {
      res.json(notes);
    } else {
      return res.status(404).json({
        error: "Notes not found.",
      });
    }
  } catch (err) {
    next(err);
  }
});

// [GET] one note by id
router.get("/notes/:id", isAuthenticated, async (req, res, next) => {
  const id = parseInt(req.params.id);
  try {
    const note = await prisma.note.findUnique({
      where: { id, userId: req.session.userId },
    });
    if (note) {
      res.json(note);
    } else {
      return res.status(404).json({
        error: "Note not found.",
      });
    }
  } catch (err) {
    next(err);
  }
});

// [POST] create note
router.post("/notes", isAuthenticated, async (req, res, next) => {
  const newNote = { ...req.body, userId: req.session.userId };
  try {
    // Validate that new note has required fields
    const newNoteValid =
      newNote.task !== undefined && newNote.userId !== undefined;
    if (newNoteValid) {
      const created = await prisma.note.create({ data: newNote });
      res.status(201).json(created);
    } else {
      return res.status(422).json({
        error: "Task name is required.",
      });
    }
  } catch (err) {
    next(err);
  }
});

// [DELETE] delete note
router.delete("/notes/:id", isAuthenticated, async (req, res, next) => {
  const id = Number(req.params.id);
  try {
    const note = await prisma.note.findUnique({
      where: { id, userId: req.session.userId },
    });
    if (note) {
      const deleted = await prisma.note.delete({ where: { id } });
      res.json(deleted);
    } else {
      return res.status(404).json({
        error: "Note not found.",
      });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
