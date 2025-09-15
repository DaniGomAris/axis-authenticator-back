const qrcode = require("qrcode");
const { generateTemporaryQrId, validateTemporaryQrId } = require("../../auth/qr-auth");
const { handleError } = require("../../handlers/error-handler");
const STATUS = require("../../constants/status-constants");
const logger = require("../../logger/logger");

async function generateQr(user_id, company_id, res) {
  try {
    const lGUID = await generateTemporaryQrId(user_id, company_id);
    const qrImage = await qrcode.toDataURL(lGUID);

    logger.info(`QR generado para id: ${user_id}, company_id=${company_id}`);

    return res.status(STATUS.SUCCESS.OK).json({
      success: true,
      lGUID,
      qr: qrImage,
    });
  } catch (error) {
    return handleError(res, "QR_GENERATION_FAILED", STATUS.ERROR.INTERNAL, error);
  }
}

async function validateQr(lGUID, res) {
  try {
    const record = await validateTemporaryQrId(lGUID);

    if (!record) {
      logger.warn(`Validacion con QR inexistente: ${lGUID}`);
      return handleError(res, "QR_NOT_FOUND", STATUS.ERROR.NOT_FOUND);
    }

    logger.info(`QR validado correctamente para id: ${record.user_id}, company_id:${record.company_id}`);

    return res.status(STATUS.SUCCESS.OK).json({
      success: true,
      user_id: record.user_id,
      company_id: record.company_id,
    });
  } catch (err) {
    return handleError(res, "QR_VALIDATION_FAILED", STATUS.ERROR.INTERNAL, err);
  }
}

module.exports = {
  generateQr,
  validateQr,
};
