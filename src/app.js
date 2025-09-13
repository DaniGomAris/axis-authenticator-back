require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/mongo_config");
const redisClient = require("./config/redis_config");

const authRoutes = require("./routes/auth_routes");
const qrRoutes = require("./routes/qr_routes");

const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: "*" }));

// Connect to MongoDB
connectDB();

// Connect to Redis
(async () => {
  try {
    await redisClient.connect();
    console.log("Redis conectado");
  } catch (err) {
    console.error("Error conectando a Redis:", err);
  }
})();

// Routes
app.use("/auth", authRoutes);
app.use("/qr", qrRoutes);

// Test endpoint
app.get("/", (req, res) => {
  res.json({ message: "Node.js API connecting to MongoDB y Redis" });
});

module.exports = app;
