const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    title: String,
    subject: String,

  
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
noteSchema.index({ createdAt: -1 });
noteSchema.index({ subject: 1 });
noteSchema.index({ uploadedBy: 1 });
noteSchema.index({ title: "text" });

module.exports = mongoose.model("Note", noteSchema);