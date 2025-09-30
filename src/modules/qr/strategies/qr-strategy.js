const { v4: uuidv4 } = require("uuid");
const redisClient = require("@config/redis-config");

const QR_TEMPORARY_EXPIRES = parseInt(process.env.QR_TEMPORARY_EXPIRES);
const QR_ID_LENGTH = parseInt(process.env.QR_ID_LENGTH);

class QrStrategy {
  // Generate temporary Qr ID
  static async generateTemporaryQrId(user_id, company_id) {
    // Validate qr is active for user
    const existingQr = await redisClient.get(`user:${user_id}:qr`);
    if (existingQr) {
      throw new Error("QR ALREADY ACTIVE");
    }

    const lGUID = uuidv4().replace(/-/g, "").slice(0, QR_ID_LENGTH);
    const value = JSON.stringify({ user_id, company_id });

    // Save Qr with TTL
    await redisClient.setEx(lGUID, QR_TEMPORARY_EXPIRES, value);

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
