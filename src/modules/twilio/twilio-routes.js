import { Router } from "express";
import TwilioController from "./twilio-controller.js";

const router = Router();

// Send otp
// POST /twilio/send-otp
router.post("/send-otp", TwilioController.sendOtp);

// Verify otp
// POST /twilio/verify-otp
router.post("/verify-otp", TwilioController.verifyOtp);

export default router;
