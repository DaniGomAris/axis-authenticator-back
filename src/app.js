require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("@config/mongo-config");
const redisClient = require("@config/redis-config");
const twilioClient = require("@config/twilio-config");

const logger = require("@utils/logger");
const { handleError } = require("@handlers/error-handler");

const authRoutes = require("@modules/auth/auth-routes");
const qrRoutes = require("@modules/qr/qr-routes");
const twilioRoutes = require("@modules/twilio/twilio-routes.js");

const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: "*" }));

// MOngo DB connection
connectDB();

// Routes
app.use("/auth", authRoutes);
app.use("/qr", qrRoutes);
app.use("/twilio", twilioRoutes);

// Global middleware
app.use((err, req, res, next) => {
  handleError(res, err);
});

// Endpoint de prueba
app.get("/", (req, res) => {
  res.json({ message: "Node.js API connected to MongoDB & Redis & twilio" });
  logger.http("GET / llamado");
});

module.exports = app;
