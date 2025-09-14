require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/mongo_config");
const redisClient = require("./config/redis_config"); // ya conectado
const logger = require("./logger/logger");
const requestLogger = require("./middlewares/logger_middleware");

const authRoutes = require("./routes/auth_routes");
const qrRoutes = require("./routes/qr_routes");

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
