const express = require("express");
const TwilioController = require("./twilio-controller");

const router = express.Router();

// Send otp
// POST /twilio/send-otp
router.post("/send-otp", TwilioController.sendOtpController);

// Verify otp
// POST /twilio/verify-otp
router.post("/verify-otp", TwilioController.verifyOtpController);

module.exports = router;
