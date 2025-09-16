const User = require("./models/user-model");
const argon2 = require("argon2");

const { validateLogin } = require("./validators/auth-validator");
const { generateToken, invalidateToken } = require("../../auth/jwt-auth");

async function loginUser(email, password) {
  validateLogin(email, password);

  const user = await User.findOne({ email });
  if (!user) throw new Error("USER_NOT_FOUND");

  const isPasswordValid = await argon2.verify(user.password, password);
  if (!isPasswordValid) throw new Error("INVALID_CREDENTIALS");

  // Roles permitidos
  if (!["user", "admin"].includes(user.role)) throw new Error("UNAUTHORIZED");

  const { password: _, ...userWithoutPassword } = user.toObject();

  // Generar JWT
  const token = await generateToken(user._id, user.role);

  return { user: userWithoutPassword, token };
}

async function logoutUser(token) {
  if (!token) throw new Error("TOKEN_REQUIRED");

  // Verificar token para obtener user_id
  const decoded = await verifyToken(token);
  if (!decoded) throw new Error("INVALID_TOKEN");

  await invalidateToken(decoded.user_id);
  return true;
}

module.exports = { loginUser, logoutUser };
