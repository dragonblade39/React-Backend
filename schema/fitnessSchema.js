const mongoose = require("mongoose");

const fitnessSchema = new mongoose.Schema(
  {
    name: { type: String },
    username: { type: String },
    email: { type: String },
    password: { type: String },
    gender: { type: String },
  },
  {
    collection: "Signup",
  }
);

module.exports = mongoose.model("Signup", fitnessSchema);
