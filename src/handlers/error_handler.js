const MESSAGES = require("../constants/messages_constants");
const STATUS = require("../constants/status_constants");

function handleError(res, type, status = STATUS.ERROR.BAD_REQUEST) {
  let message = MESSAGES.ERROR.INTERNAL;

  switch (type) {
    case "REQUIRED_FIELDS": message = MESSAGES.ERROR.REQUIRED_FIELDS; break;
    case "INVALID_EMAIL": message = MESSAGES.ERROR.INVALID_EMAIL; break;
    case "INVALID_PASSWORD": message = MESSAGES.ERROR.INVALID_PASSWORD; break;
    case "USER_NOT_FOUND": message = MESSAGES.ERROR.USER_NOT_FOUND; break;
    case "INVALID_CREDENTIALS": message = MESSAGES.ERROR.INVALID_CREDENTIALS; break;
    case "INAUTHORIZED": message = MESSAGES.ERROR.INAUTHORIZED; break;
    case "INTERNAL": default: message = MESSAGES.ERROR.INTERNAL;
  }

  return res.status(status).json({ success: false, status, message });
}

module.exports = { handleError };
