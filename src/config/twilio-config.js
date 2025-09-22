const twilio = require("twilio");
const logger = require("@utils/logger");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken  = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;

if (!accountSid || !authToken || !fromNumber) {
  throw new Error("Missing Twilio ENV");
}

const twilioClient = twilio(accountSid, authToken);

try {
  if (fromNumber.startsWith("+")) {
    logger.info("Twilio configured ready");
  } else {
    logger.warn("Twilio configured, but the phone number is not correct format (+)");
  }
} catch (error) {
  logger.error("Error configuring Twilio:", error.message);
}

module.exports = { twilioClient, fromNumber };
