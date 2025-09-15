const MESSAGES = require("../constants/messages-constants");
const STATUS = require("../constants/status-constants");
const logger = require("../logger/logger");

function handleError(res, type, status = STATUS.ERROR.BAD_REQUEST, extra = null) {
  let message = MESSAGES.ERROR.INTERNAL;

  switch (type) {
    // Errores
    case "REQUIRED_FIELDS": message = MESSAGES.ERROR.REQUIRED_FIELDS; break;
    case "INVALID_EMAIL": message = MESSAGES.ERROR.INVALID_EMAIL; break;
    case "INVALID_PASSWORD": message = MESSAGES.ERROR.INVALID_PASSWORD; break;
    case "USER_NOT_FOUND": message = MESSAGES.ERROR.USER_NOT_FOUND; break;
    case "INVALID_CREDENTIALS": message = MESSAGES.ERROR.INVALID_CREDENTIALS; break;
    case "UNAUTHORIZED": message = MESSAGES.ERROR.UNAUTHORIZED; break;

    // Errores personalizados
    case "QR_GENERATION_FAILED": message = "Failed to generate QR"; break;
    case "QR_NOT_FOUND": message = "QR not found"; break;
    case "QR_VALIDATION_FAILED": message = "Failed to validate QR"; break;

    default: 
      message = MESSAGES.ERROR.INTERNAL;
  }

  // Log interno
  logger.error(`Error type: ${type}, status: ${status}`, { details: extra });

  const statusCode = typeof status === "number" ? status : STATUS.ERROR.INTERNAL;

  return res.status(statusCode).json({ success: false, status: statusCode, message });
}

module.exports = { handleError };
