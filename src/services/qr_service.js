const qrcode = require("qrcode");
const { generateTemporaryQrId, validateTemporaryQrId } = require("../auth/qr_auth");

async function generateQr(user_id, company_id) {
  try {
    const lGUID = await generateTemporaryQrId(user_id, company_id);
    const qrImage = await qrcode.toDataURL(lGUID);

    return { lGUID, qrImage };
  } catch (error) {
    throw new Error("Error generating QR image");
  }
}

async function validateQr(lGUID) {
  const record = await validateTemporaryQrId(lGUID);
  if (!record) return null;

  return {
    user_id: record.user_id,
    company_id: record.company_id
  };
}

module.exports = {
  generateQr,
  validateQr
};
