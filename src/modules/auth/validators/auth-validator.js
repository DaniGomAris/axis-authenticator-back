const MESSAGES = require("../../../constants/messages-constants");

function validateLogin(email, password) {
  if (!email || !password) {
    throw new Error(MESSAGES.ERROR.REQUIRED_FIELDS);
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})*$/;
  if (!emailRegex.test(email)) {
    throw new Error(MESSAGES.ERROR.INVALID_EMAIL);
  }

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&])[A-Za-z0-9@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    throw new Error(MESSAGES.ERROR.INVALID_PASSWORD);
  }

  return true;
}

module.exports = { validateLogin };
