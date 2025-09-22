const QrService = require("@modules/qr/qr-service");
const logger = require("@utils/logger");
const { handleError } = require("@handlers/error-handler");

class QrController {

  // Generate GUID
  static async generateQrController(req, res) {
    try {
      const user_id = req.user.user_id;
      const company_id = req.body?.company_id || null;

      const { lGUID } = await QrService.generateQrService(user_id, company_id);

      res.status(200).json({
        success: true,
        status: "ok",
        lGUID,
      });
      logger.info("GUID generated successfully");
    } catch (err) {
      logger.error(`generateQrController error: ${err.message}`);
      handleError(res, err);
    }
  }

  // Verify GUID
  static async validateQrController(req, res) {
    try {
      const { lGUID } = req.body;
      const record = await QrService.validateQrService(lGUID);

      res.status(200).json({
        success: true,
        status: "ok",
        user_id: record.user_id,
        company_id: record.company_id,
      });
      logger.info("GUID validated successfully");
    } catch (err) {
      logger.error(`validateQrController error: ${err.message}`);
      handleError(res, err);
    }
  }
}

module.exports = QrController;
