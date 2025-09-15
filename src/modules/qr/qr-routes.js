const express = require("express");
const { authenticateRequest } = require("../../middlewares/jwt-middleware");
const { generateQrController, validateQrController } = require("./qr-controller");

const router = express.Router();

// POST /users/generate-qr
router.post("/generate-qr", authenticateRequest, generateQrController);

// POST /users/validate-qr
router.post("/validate-qr", authenticateRequest, validateQrController);

module.exports = router;
