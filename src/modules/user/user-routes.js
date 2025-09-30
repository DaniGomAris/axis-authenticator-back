const express = require("express");
const UserController = require("@modules/user/user-controller");
const { validToken } = require("@middlewares/jwt-middleware");

const router = express.Router();

// Get user info
// GET /user/:userId
router.get("/:userId", validToken, UserController.getUserInfoController);

// Change password
// POST /user/change-password-with-otp
router.post("/change-password-with-otp", UserController.changePasswordWithOtpController);

module.exports = router;
