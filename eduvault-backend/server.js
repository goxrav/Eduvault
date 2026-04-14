const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const compression = require("compression");

const app = express();
app.use(cors());
app.use(express.json());
app.use (compression());

app.use("/api/notes", require("./routes/noteRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.get("/", (req, res) => {
  res.send("API running 🚀");
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(5000, () => console.log("Server running on port 5000"));
  