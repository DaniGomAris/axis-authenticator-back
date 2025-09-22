const TwilioService = require("./twilio-service");
const { handleError } = require("@handlers/error-handler");
const logger = require("@utils/logger");

class TwilioController {
  static async sendOtp(req, res) {
    try {
      const { phone } = req.body;
      const result = await TwilioService.sendOtp(phone);
      res.status(200).json(result);
    } catch (err) {
      logger.error(`sendOtpController error: ${err.message}`);
      handleError(res, err);
    }
  }

  static async verifyOtp(req, res) {
    try {
      const { phone, otp } = req.body;
      const result = await TwilioService.verifyOtp(phone, otp);
      res.status(200).json(result);
    } catch (err) {
      logger.error(`verifyOtpController error: ${err.message}`);
      handleError(res, err);
    }
  }
}

module.exports = TwilioController;
