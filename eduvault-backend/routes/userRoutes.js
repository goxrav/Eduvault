const express = require("express");
const router = express.Router();
const User = require("../models/User");


// 🔥 CREATE OR GET USER (USED BY GOOGLE LOGIN)
router.post("/", async (req, res) => {
  try {
    const {
      uid,
      name,
      email,
      photo,
      degree,
      branch,
      year,
      semester,
    } = req.body;

    if (!uid || !email) {
      return res.status(400).json({ message: "UID and Email required" });
    }

    let user = await User.findOne({ uid });

    if (!user) {
      user = await User.create({
        uid,
        name,
        email,
        photo,
        degree,
        branch,
        year,
        semester,
      });
    }

    res.status(200).json(user);

  } catch (err) {
    console.error("User error:", err);
    res.status(500).json({ error: err.message });
  }
});


// 🔥 GET USER BY UID
router.get("/:uid", async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.params.uid });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 🔥 UPDATE USER
router.put("/:uid", async (req, res) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { uid: req.params.uid },
      req.body,
      { new: true } // ✅ FIXED (you used wrong option earlier)
    );

    res.json(updatedUser);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;