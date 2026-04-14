const express = require("express");
const router = express.Router();
const User = require("../models/User");

// CREATE USER
router.post("/", async (req, res) => {
  try {
    const {
      uid,
      name,
      email,
      degree,
      branch,
      year,
      semester,
    } = req.body;

    let user = await User.findOne({ uid });

    if (!user) {
      user = new User({
        uid,
        name,
        email,
        degree,
        branch,
        year,
        semester,
      });

      await user.save();
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET USER BY UID 🔥
router.get("/:uid", async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.params.uid });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/:uid", async (req, res) => {
  try {
    const { uid } = req.params;

    const updatedUser = await User.findOneAndUpdate(
      { uid: req.params.uid },
      req.body,
      { returnDocument: "after" }
    );

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/api/users', async (req, res) => {
  try {
    const { uid, name, email, profilePic } = req.body;

    // find existing or create new
    let user = await User.findOne({ uid }).lean();

    if (!user) {
      user = await User.create({ uid, name, email, profilePic });
    }

    res.status(200).json(user);

  } catch (error) {
    console.error('User save error:', error);
    res.status(500).json({ message: 'Failed to save user' });
  }
});

module.exports = router;