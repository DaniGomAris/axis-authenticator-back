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

// Get user info
// GET / auth/user-info/:userId
router.get("/user-info/:userId", validToken, AuthController.getUserInfoController);

// Change password
// POST / auth/change-password/:userId
router.post("/change-password/:userId", validToken, AuthController.changePasswordController);

module.exports = router;
