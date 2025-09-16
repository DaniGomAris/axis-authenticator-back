const { generateQr, validateQr } = require("./qr-service");
const { handleError } = require("../../handlers/error-handler");
const STATUS = require("../../constants/status-constants");

// Generar QR
async function generateQrController(req, res) {
  try {
    const user_id = req.user.user_id;
    const company_id = req.body?.company_id || null;

    const { lGUID, qrImage } = await generateQr(user_id, company_id);

    return res.status(STATUS.SUCCESS.OK).json({
      success: true,
      lGUID,
      qr: qrImage,
    });
  } catch (err) {
    return handleError(res, err.message, STATUS.ERROR.INTERNAL, err);
  }
}

// Validar QR
async function validateQrController(req, res) {
  try {
    const { lGUID } = req.body;
    const record = await validateQr(lGUID);

    return res.status(STATUS.SUCCESS.OK).json({
      success: true,
      user_id: record.user_id,
      company_id: record.company_id,
    });
  } catch (err) {
    return handleError(res, err.message, STATUS.ERROR.INTERNAL, err);
  }
}

module.exports = {
  generateQrController,
  validateQrController,
};
