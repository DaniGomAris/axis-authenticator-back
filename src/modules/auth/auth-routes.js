const express = require("express");
const { loginUserController, logoutUserController } = require("./auth-controller");
const { validToken } = require("../../middlewares/jwt-middleware");

const router = express.Router();

// POST /users/login
router.post("/login", loginUserController);

// POST /users/logout
router.post("/logout", validToken, logoutUserController);

module.exports = router;
