const express = require("express");
const { loginUserController, logoutUserController, verifyTokenController } = require("@modules/auth/auth-controller");
const { validToken } = require("@middlewares/jwt-middleware");

const router = express.Router();

// Login user
// POST /auth/login
router.post("/login", loginUserController);

// Logout user
// POST /auth/logout
router.post("/logout", validToken, logoutUserController);

// Verify user token
// GET / auth/verify-token
router.get("/verify-token", verifyTokenController);

module.exports = router;
