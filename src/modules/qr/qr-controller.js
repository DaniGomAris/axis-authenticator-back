const { generateQr, validateQr } = require("@modules/qr/qr-service");
const { handleError } = require("@handlers/error-handler");
const logger = require("@utils/logger");

// Generate GUID
async function generateQrController(req, res) {
  try {
    const user_id = req.user.user_id;
    const company_id = req.body?.company_id || null;

    const { lGUID } = await generateQr(user_id, company_id);

    res.status(200).json({
      success: true,
      status: "ok",
      lGUID,
    });
    logger.info("GUID generado exitosamente en controller");
  } catch (err) {
    handleError(res, err);
  }
}

// Validar GUID
async function validateQrController(req, res) {
  try {
    const { lGUID } = req.body;
    const record = await validateQr(lGUID);

    res.status(200).json({
      success: true,
      status: "ok",
      user_id: record.user_id,
      company_id: record.company_id,
    });
    logger.info("GUID validado exitosamente en controller");
  } catch (err) {
    handleError(res, err);
  }
}

module.exports = {
  generateQrController,
  validateQrController,
};
