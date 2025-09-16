const User = require("./models/user-model");
const argon2 = require("argon2");
const { validateLogin } = require("./validators/auth-validator");
const { generateToken } = require("../../auth/jwt-auth");

async function loginUser(email, password) {
  // Validaciones iniciales
  validateLogin(email, password);

  // Buscar usuario
  const user = await User.findOne({ email });
  if (!user) throw new Error("USER_NOT_FOUND");

  // Validar contraseña
  const isPasswordValid = await argon2.verify(user.password, password);
  if (!isPasswordValid) throw new Error("INVALID_CREDENTIALS");

  // Validar roles permitidos
  if (!["user", "admin"].includes(user.role)) throw new Error("UNAUTHORIZED");

  // Quitar contraseña del objeto de usuario
  const { password: _, ...userWithoutPassword } = user.toObject();

  // Generar JWT
  const token = generateToken(user._id, user.role);

  return { user: userWithoutPassword, token };
}

module.exports = { loginUser };
