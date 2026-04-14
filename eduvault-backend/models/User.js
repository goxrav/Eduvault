const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  name: String,
  email: String,
  photo: String, 

  degree: String,
  branch: String,
  year: Number,
  semester: Number,
}, {
  timestamps: true,}

  
);


userSchema.index({ uid: 1 });

module.exports = mongoose.model("User", userSchema);