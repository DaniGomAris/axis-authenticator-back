const express = require("express");
const { authenticateRequest } = require("../middlewares/jwt_middleware");
const { generateQrController } = require("../controllers/qr_controller");

const router = express.Router();

// POST /users/generate-qr
router.post("/generate-qr", authenticateRequest, generateQrController);

module.exports = router;
