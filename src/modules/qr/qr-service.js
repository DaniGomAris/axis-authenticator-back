const { generateTemporaryQrId, validateTemporaryQrId } = require("../../auth/qr-auth");
const logger = require("../../utils/logger");

// Generar GUID temporal
async function generateQr(user_id, company_id = null) {
  try {
    const lGUID = await generateTemporaryQrId(user_id, company_id);

    logger.info(`GUID generado | user_id: ${user_id} | company_id: ${company_id}`);
    return { lGUID };
  } catch (error) {
    logger.error(`Error generando GUID | user_id: ${user_id}`, { error });
    throw new Error("QR GENERATION FAILED");
  }
}

// Validar GUID temporal
async function validateQr(lGUID) {
  try {
    const record = await validateTemporaryQrId(lGUID);

    if (!record) {
      logger.warn(`GUID no encontrado o expirado | lGUID: ${lGUID}`);
      throw new Error("QR NOT FOUND");
    }

    logger.info(`GUID validado | user_id: ${record.user_id} | company_id: ${record.company_id}`);
    return record;
  } catch (error) {
    logger.error(`Error validando GUID | lGUID: ${lGUID}`, { error });
    throw new Error("QR VALIDATION FAILED");
  }
}

module.exports = {
  generateQr,
  validateQr,
};
