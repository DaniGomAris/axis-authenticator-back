const express = require("express");
const { validToken } = require("../../middlewares/jwt-middleware");
const { authorizedRoles } = require("../../middlewares/role-middleware");
const { generateQrController, validateQrController } = require("./qr-controller");

const router = express.Router();

// POST /users/generate-qr
router.post("/generate-qr", validToken, authorizedRoles("admin","user"), generateQrController);

// POST /users/validate-qr
router.post("/validate-qr", validToken, validateQrController);

module.exports = router;
