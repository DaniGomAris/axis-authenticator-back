const { v4: uuidv4 } = require("uuid");
const redisClient = require("@config/redis-config");

const QR_TEMPORARY_EXPIRES = parseInt(process.env.QR_TEMPORARY_EXPIRES);
const QR_ID_LENGTH = parseInt(process.env.QR_ID_LENGTH);

class QrStrategy {
  // Generate temporary Qr ID
  static async generateTemporaryQrId(user_id, company_id) {
    // Validate if user have active qr
    const existingQr = await redisClient.get(`qr:${user_id}`);
    if (existingQr) {
      throw new Error("QR ALREADY ACTIVE");
    }

    // Generate LGUID
    const lGUID = uuidv4().replace(/-/g, "").slice(0, QR_ID_LENGTH);

    // Save in Redis with TTL
    await redisClient.setEx(
      `qr:${user_id}`,
      QR_TEMPORARY_EXPIRES,
      JSON.stringify({ lGUID, user_id, company_id })
    );

    return lGUID;
  }

  // Validate temporary Qr ID
  static async validateTemporaryQrId(lGUID) {
    // Find in all active keys
    const keys = await redisClient.keys("qr:*");

    for (const key of keys) {
      const record = await redisClient.get(key);
      if (record) {
        const parsed = JSON.parse(record);
        if (parsed.lGUID === lGUID) {
          return parsed;
        }
      }
    }

    return null; // Expired or not found
  }
}

module.exports = QrStrategy;
