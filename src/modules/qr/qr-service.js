const { generateTemporaryQrId, validateTemporaryQrId } = require("@modules/qr/strategies/qr-strategy");
const logger = require("@utils/logger");

class QrService {
  // Generate QR
  static async generateQRService(user_id, company_id = null) {
    try {
      const lGUID = await generateTemporaryQrId(user_id, company_id);
      logger.info(`GUID generated | user_id: ${user_id} | company_id: ${company_id}`);
      return { lGUID };
    } catch (error) {
      logger.error(`Error generating GUID | user_id: ${user_id}`, { error });
      throw new Error("QR GENERATION FAILED");
    }
  }

  // Validate QR
  static async validateQRService(lGUID) {
    try {
      const record = await validateTemporaryQrId(lGUID);

      if (!record) {
        logger.warn(`GUID not found or expired | lGUID: ${lGUID}`);
        throw new Error("QR NOT FOUND");
      }

      logger.info(`Validated GUID | user_id: ${record.user_id} | company_id: ${record.company_id}`);
      return record;
    } catch (error) {
      logger.error(`Error validating GUID | lGUID: ${lGUID}`, { error });
      throw new Error("QR VALIDATION FAILED");
    }
  }
}

module.exports = QrService;
