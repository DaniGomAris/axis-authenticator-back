const TwilioService = require("./twilio-service");
const logger = require("@utils/logger");
const { handleError } = require("@handlers/error-handler");

class TwilioController {

  // Send OTP
  static async sendOtpController(req, res) {
    try {
      const { phone } = req.body;
      const result = await TwilioService.sendOtpService(phone);
      res.status(200).json(result);
    } catch (err) {
      logger.error(`sendOtpController error: ${err.message}`);
      handleError(res, err);
    }
  }

  // Verify OTP
  static async verifyOtpController(req, res) {
    try {
      const { phone, otp } = req.body;
      const result = await TwilioService.verifyOtpService(phone, otp);
      res.status(200).json(result);
    } catch (err) {
      logger.error(`verifyOtpController error: ${err.message}`);
      handleError(res, err);
    }
  }
}

module.exports = TwilioController;
