const { generateQr } = require("../services/qr_service");

async function generateQrController(req, res) {
  try {
    const user_id = req.user.sub;
    const company_id = req.user.company_id || null;

    const { lGUID, qrImage } = await generateQr(user_id, company_id);

    res.json({ success: true, lGUID, qr: qrImage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error generating QR" });
  }
}

module.exports = { generateQrController };
