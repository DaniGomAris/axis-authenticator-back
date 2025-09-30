const express = require("express");
const AuthController = require("@modules/auth/auth-controller");
const { validToken } = require("@middlewares/jwt-middleware");

const router = express.Router();

// Login user
// POST /auth/login
router.post("/login", AuthController.loginUserController);

// Logout user
// POST /auth/logout
router.post("/logout", validToken, AuthController.logoutUserController);

// Verify user token
// GET / auth/verify-token
router.get("/verify-token", AuthController.verifyTokenController);

module.exports = router;
