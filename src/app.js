require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/mongo-config");
const redisClient = require("./config/redis-config");
const logger = require("./logger/logger");
const requestLogger = require("./middlewares/logger-middleware");

const authRoutes = require("./modules/auth/auth-routes");
const qrRoutes = require("./modules/qr/qr-routes");

const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(requestLogger);

// Conexión a MongoDB
connectDB();

// Rutas
app.use("/auth", authRoutes);
app.use("/qr", qrRoutes);

// Endpoint de prueba
app.get("/", (req, res) => {
  res.json({ message: "Node.js API conectada a MongoDB y Redis" });
  logger.http("GET / llamado");
});

module.exports = app;
