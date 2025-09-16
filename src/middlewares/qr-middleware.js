const { validateTemporaryQrId } = require("../auth/qr-auth");
const { handleError } = require("../handlers/error-handler");
const STATUS = require("../constants/status-constants");

async function validQr(req, res, next) {
  try {
    const { lGUID } = req.body;
    if (!lGUID) {
      return handleError(res, "QR_NOT_FOUND", STATUS.ERROR.BAD_REQUEST);
    }

    const record = await validateTemporaryQrId(lGUID);
    if (!record) {
      return handleError(res, "QR_NOT_FOUND", STATUS.ERROR.NOT_FOUND);
    }

    // Info del QR
    req.qr = record;

    next();
  } catch (err) {
    return handleError(res, "QR_VALIDATION_FAILED", STATUS.ERROR.UNAUTHORIZED, err);
  }
}

module.exports = { validQr };
