const twilio = require("twilio");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken  = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;

if (!accountSid || !authToken || !fromNumber) {
  throw new Error("There are no ENV for Twilio");
}

const twilioClient = twilio(accountSid, authToken);

module.exports = { twilioClient, fromNumber };
