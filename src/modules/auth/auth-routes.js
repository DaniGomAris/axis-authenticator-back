const express = require("express");
const { loginUserController, logoutUserController } = require("./auth-controller");
const { validToken } = require("../../middlewares/jwt-middleware");

const router = express.Router();

// Login user
// POST /auth/login
router.post("/login", loginUserController);

// Logout user
// POST /auth/logout
router.post("/logout", validToken, logoutUserController);

module.exports = router;
