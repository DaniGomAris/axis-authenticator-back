require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/mongo_config");
const redisClient = require("./config/redis_config");
const logger = require("./logger/logger");
const requestLogger = require("./middlewares/logger_middleware");

const authRoutes = require("./routes/auth_routes");
const qrRoutes = require("./routes/qr_routes");

const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(requestLogger);

// Connect to MongoDB
connectDB()
  .then(() => logger.info("MongoDB conectado"))
  .catch((err) => logger.error("Error conectando a MongoDB", err));

// Connect to Redis
(async () => {
  try {
    await redisClient.connect();
    logger.info("Redis conectado");
  } catch (err) {
    logger.error("Error conectando a Redis", err);
  }
})();

// Routes
app.use("/auth", authRoutes);
app.use("/qr", qrRoutes);

// Test endpoint
app.get("/", (req, res) => {
  res.json({ message: "Node.js API connecting to MongoDB y Redis" });
  logger.http("GET / llamado");
});

module.exports = app;
