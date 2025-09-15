const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  _id: String, 
  document_type: { type: String, required: true },
  role: { type: String, enum: ["user", "admin", "master"], default: "user" },
  name: { type: String, required: true },
  last_name1: { type: String, required: true },
  last_name2: { type: String },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  clyper: { type: String },
  password: { type: String, required: true },
  companies: [{ type: String, ref: "Company" }]
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema, "users");
