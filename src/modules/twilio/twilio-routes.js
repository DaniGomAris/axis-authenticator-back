const express = require("express");
const TwilioController = require("./twilio-controller");

const router = express.Router();

// Send otp
// POST /twilio/send-otp
router.post("/send-otp", TwilioController.sendOtp);

// Verify otp
// POST /twilio/verify-otp
router.post("/verify-otp", TwilioController.verifyOtp);

module.exports = router;
