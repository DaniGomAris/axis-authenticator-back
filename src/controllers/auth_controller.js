const { loginUser } = require("../services/user_service");

async function login(req, res) {
  const { email, password } = req.body;

  const result = await loginUser(email, password, res);

  if (result?.success) {
    return res.status(200).json(result);
  }
}

module.exports = { login };
