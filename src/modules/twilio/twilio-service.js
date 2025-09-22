import { redisClient } from "../../config/redis-config.js";
import { twilioClient, fromNumber } from "../../config/twilio-config.js";
import logger from "@utils/logger";

const TWILIO_OTP_EXPIRES = process.env.TWILIO_EXPIRES;
const TWILIO_VERIFIED_EXPIRES = process.env.TWILIO_EXPIRES;

class TwilioService {
  static async sendOtp(phone) {
    try {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      // Guardar en Redis
      await redisClient.setEx(`otp:${phone}`, TWILIO_OTP_EXPIRES, otp);

      // Enviar SMS
      await twilioClient.messages.create({
        body: `Tu código de verificación es: ${otp}`,
        from: fromNumber,
        to: phone,
      });

      logger.info(`OTP enviado a ${phone}`);
      return { success: true, message: "OTP enviado" };
    } catch (err) {
      logger.error(`Error enviando OTP a ${phone}: ${err.message}`);
      throw new Error("OTP SEND FAILED");
    }
  }

  static async verifyOtp(phone, otp) {
    if (!otp) {
      logger.warn(`Verificación fallida: OTP requerido para ${phone}`);
      throw new Error("OTP REQUIRED");
    }

    const storedOtp = await redisClient.get(`otp:${phone}`);
    if (!storedOtp) {
      logger.warn(`Verificación fallida: OTP expirado para ${phone}`);
      throw new Error("OTP EXPIRED");
    }

    if (storedOtp !== otp) {
      logger.warn(`Verificación fallida: OTP incorrecto para ${phone}`);
      throw new Error("OTP INCORRECT");
    }

    // OTP válido
    await redisClient.del(`otp:${phone}`);
    await redisClient.setEx(`otp-verified:${phone}`, TWILIO_VERIFIED_EXPIRES, "true");

    logger.info(`OTP verificado correctamente para ${phone}`);
    return { success: true, message: "OTP verificado" };
  }
}

export default TwilioService;
