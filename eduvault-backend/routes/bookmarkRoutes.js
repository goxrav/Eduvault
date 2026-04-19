const express = require("express");
const Bookmark = require("../models/Bookmark");
const Note = require("../models/Note");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { userId, noteId } = req.body;

    const bookmark = await Bookmark.create({ userId, noteId });

    res.status(201).json(bookmark);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Already bookmarked" });
    }
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:noteId/:userId", async (req, res) => {
  try {
    const { noteId, userId } = req.params;

    await Bookmark.findOneAndDelete({ noteId, userId });

    res.json({ message: "Bookmark removed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const bookmarks = await Bookmark.find({ userId }).populate("noteId");

    res.json(bookmarks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;