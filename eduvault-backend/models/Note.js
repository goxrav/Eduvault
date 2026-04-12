const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    title: String,
    subject: String,

    // 🔥 IMPORTANT
    branch: String,
    semester: Number,

    userEmail: String,
    userName: String,
    fileUrl: String,
    uploadedBy: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Note", noteSchema);