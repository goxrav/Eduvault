const express = require("express");
const router = express.Router();
const Note = require("../models/Note");


router.post("/", async (req, res) => {
  try {
    console.log("BODY RECEIVED:", req.body);

    const { title, subject, uploadedBy } = req.body;


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




router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10, subject, userId, search } = req.query;

    let query = {};

 
    if (subject) {
      query.subject = subject;
    }

  
    if (userId) {
      query.uploadedBy = userId;
    }

  
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    const notes = await Note.find(query)
      .select("title subject fileUrl createdAt uploadedBy branch semester userName")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();

   
   

    res.json(notes);

  } catch (err) {
    console.error("Fetch notes error:", err);
    res.status(500).json({ error: "Failed to fetch notes" });
  }
});

module.exports = router;