const { v4: uuidv4 } = require("uuid");
const redisClient = require("@config/redis-config");

const QR_TEMPORARY_EXPIRES = parseInt(process.env.QR_TEMPORARY_EXPIRES);
const QR_ID_LENGTH = parseInt(process.env.QR_ID_LENGTH);

class QrStrategy {
  // Generate temporary Qr ID
  static async generateTemporaryQrId(user_id, company_id) {
    // Revisar si el usuario ya tiene un QR activo
    const existingQr = await redisClient.get(`user:${user_id}:qr`);
    if (existingQr) {
      throw new Error("QR ALREADY ACTIVE");
    }

    const lGUID = uuidv4().replace(/-/g, "").slice(0, QR_ID_LENGTH);
    const value = JSON.stringify({ user_id, company_id });

    // Guardar el QR con TTL
    await redisClient.setEx(lGUID, QR_TEMPORARY_EXPIRES, value);

    // Guardar referencia al usuario → lGUID con el mismo TTL
    await redisClient.setEx(`user:${user_id}:qr`, QR_TEMPORARY_EXPIRES, lGUID);

    return lGUID;
  }

  // Validate temporary Qr ID
  static async validateTemporaryQrId(lGUID) {
    const record = await redisClient.get(lGUID);
    if (!record) return null;
    return JSON.parse(record);
  }
}

module.exports = QrStrategy;
