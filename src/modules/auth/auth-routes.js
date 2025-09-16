const express = require("express");
const { loginUserController } = require("./auth-controller");

const router = express.Router();

// POST /users/login
router.post("/login", loginUserController);

module.exports = router;
