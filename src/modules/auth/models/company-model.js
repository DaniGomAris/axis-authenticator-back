const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  admin_user_id: { type: String, ref: "User" },
  status: { type: String, enum: ["active", "inactive"], default: "active" }
});


module.exports = mongoose.model("Company", companySchema, "companies");
