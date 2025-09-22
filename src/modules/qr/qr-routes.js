const express = require("express");
const QrController = require("@modules/qr/qr-controller");
const { validToken } = require("@middlewares/jwt-middleware");
const { authorizedRoles } = require("@middlewares/role-middleware");

const router = express.Router();

// POST /qr/generate-qr
router.post("/generate-qr", validToken, authorizedRoles(["admin","user"]), QrController.generateQrController);

// POST /qr/validate-qr
router.post("/validate-qr", validToken, QrController.validateQrController);

module.exports = router;
