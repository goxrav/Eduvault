const express = require("express");
const router = express.Router();
const Note = require("../models/Note");

// CREATE NOTE
router.post("/", async (req, res) => {
  try {
    console.log("BODY RECEIVED:", req.body);

    const { title, subject, uploadedBy } = req.body;

    // 🔥 CHECK DUPLICATE FIRST
    const existing = await Note.findOne({
      title,
      subject,
      uploadedBy,
    });

    if (existing) {
      return res.status(400).json({
        message: "Note already exists",
      });
    }

    // ✅ CREATE NOTE
    const note = new Note(req.body);
    await note.save();

    return res.status(200).json({
      success: true,
      data: note,
    });

  } catch (err) {
    console.log("SERVER ERROR:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json({ message: "Note deleted successfully" });

  } catch (err) {
    res.status(500).json(err);
  }
});



// GET ALL NOTES
router.get("/", async (req, res) => {
  const notes = await Note.find().sort({ createdAt: -1 });
  res.json(notes);
});

module.exports = router;