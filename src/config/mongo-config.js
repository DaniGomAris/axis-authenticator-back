const mongoose = require("mongoose");
const logger = require("@utils/logger");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.DB_NAME,
    });
    logger.info("Connected to MongoDB");
  } catch (error) {
    logger.error("Connection error to MongoDB:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
