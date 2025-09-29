const redisClient = require("../../config/redis-config");
const logger = require("@utils/logger");
const { twilioClient, fromNumber } = require("../../config/twilio-config");

const TWILIO_OTP_EXPIRES = parseInt(process.env.TWILIO_OTP_EXPIRES);
const TWILIO_VERIFIED_EXPIRES = parseInt(process.env.TWILIO_VERIFIED_EXPIRES);

class TwilioService {

  // Send OTP
  static async sendOtpService(phone) {
    try {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      // Save in Redis
      await redisClient.setEx(`otp:${phone}`, TWILIO_OTP_EXPIRES, otp);

      // Send SMS
      await twilioClient.messages.create({
        body: `Tu código de verificación es: ${otp}`,
        from: fromNumber,
        to: phone,
      });

      logger.info(`OTP send yo ${phone}`);
      return { success: true, message: "OTP enviado" };
    } catch (err) {
      logger.error(`Error sending OTP to ${phone}: ${err.message}`);
      throw new Error("OTP SEND FAILED");
    }
  }

  // Verify OTP
  static async verifyOtpService(phone, otp) {
    if (!otp) {
      logger.warn(`Verification failed: OTP required for ${phone}`);
      throw new Error("OTP REQUIRED");
    }

    const storedOtp = await redisClient.get(`otp:${phone}`);
    if (!storedOtp) {
      logger.warn(`Verification failed: OTP expired for ${phone}`);
      throw new Error("OTP EXPIRED");
    }

    if (storedOtp !== otp) {
      logger.warn(`Verification failed: OTP wrong for ${phone}`);
      throw new Error("OTP INCORRECT");
    }

    // Valid OTP
    await redisClient.del(`otp:${phone}`);
    await redisClient.setEx(`otp-verified:${phone}`, TWILIO_VERIFIED_EXPIRES, "true");

    logger.info(`OTP verified successfully for ${phone}`);
    return { success: true, message: "OTP verificado" };
  }
}

module.exports = TwilioService;
