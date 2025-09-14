const MESSAGES = require("../constants/messages_constants");
const logger = require("../logger/logger");

function handleValidation(type, context = {}) {
  let message;

  switch (type) {
    case "LOGIN_SUCCESS":
      message = MESSAGES.SUCCESS.LOGIN;
      break;

    case "LOGIN_FAILED":
      message = MESSAGES.ERROR.LOGIN_FAILED;
      break;

    case "INVALID_TOKEN":
      message = MESSAGES.ERROR.INVALID_TOKEN;
      break;

    default:
      message = MESSAGES.ERROR.UNKNOWN;
      break;
  }

  if (type.includes("SUCCESS")) {
    logger.info(`Validación exitosa [${type}] - Context: ${JSON.stringify(context)}`);
  } else {
    logger.warn(`Validación fallida [${type}] - Context: ${JSON.stringify(context)}`);
  }

  return message;
}

module.exports = { handleValidation };
