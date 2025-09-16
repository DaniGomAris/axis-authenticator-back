const qrcode = require("qrcode");
const { generateTemporaryQrId, validateTemporaryQrId } = require("../../auth/qr-auth");
const logger = require("../../logger/logger");
const qrConfig = require("../../config/qr-config");

// Generar QR
async function generateQr(user_id, company_id = null) {
  try {
    const lGUID = await generateTemporaryQrId(user_id, company_id);
    const qrImage = await qrcode.toDataURL(lGUID, qrConfig);

    logger.info(`QR generado para user_id=${user_id}, company_id=${company_id}`);

    return { lGUID, qrImage };
  } catch (error) {
    logger.error(`Error generando QR para user_id=${user_id}`, { error });
    throw new Error("QR_GENERATION_FAILED");
  }
}

// Validar QR
async function validateQr(lGUID) {
  try {
    const record = await validateTemporaryQrId(lGUID);

    if (!record) {
      logger.warn(`Validación fallida, QR inexistente: ${lGUID}`);
      throw new Error("QR_NOT_FOUND");
    }

    logger.info(`QR validado correctamente: user_id=${record.user_id}, company_id=${record.company_id}`);
    return record;
  } catch (error) {
    logger.error(`Error validando QR: ${lGUID}`, { error });
    throw new Error(error.message || "QR_VALIDATION_FAILED");
  }
}

module.exports = {
  generateQr,
  validateQr,
};
