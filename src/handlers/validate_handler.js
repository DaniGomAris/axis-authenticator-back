const MESSAGES = require("../constants/messages_constants");

function handleValidation(type) {
  switch(type) {
    case "LOGIN_SUCCESS": return MESSAGES.SUCCESS.LOGIN;
    default: return MESSAGES.SUCCESS.INTERNAL;
  }
}

module.exports = { handleValidation };
