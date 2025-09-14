const { generateQr, validateQr } = require("../services/qr_service");

async function generateQrController(req, res) {
  const user_id = req.user.sub;
  const company_id = req.user.company_id || null;

  return generateQr(user_id, company_id, res);
}

async function validateQrController(req, res) {
  const { lGUID } = req.body; 

  return validateQr(lGUID, res);
}

module.exports = { generateQrController, validateQrController };
