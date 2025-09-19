const { v4: uuidv4 } = require("uuid");
const redisClient = require("../config/redis-config");

const QR_TEMPORARY_EXPIRES = parseInt(process.env.QR_TEMPORARY_EXPIRES);
const QR_ID_LENGTH = parseInt(process.env.QR_ID_LENGTH);

// Generate temporal LGUID and save in redis with TTL
async function generateTemporaryQrId(user_id, company_id) {
  const lGUID = uuidv4().replace(/-/g, "").slice(0, QR_ID_LENGTH);
  const value = JSON.stringify({ user_id, company_id });
  
  // TTL
  await redisClient.setEx(lGUID, Math.floor(QR_TEMPORARY_EXPIRES), value);

  return lGUID;
}


// Validate temporal LGUID
async function validateTemporaryQrId(lGUID) {
  const record = await redisClient.get(lGUID);
  if (!record) return null;

  return JSON.parse(record);
}

module.exports = {
  generateTemporaryQrId,
  validateTemporaryQrId
};
