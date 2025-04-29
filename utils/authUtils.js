import userModel from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
//validate user credentials
const validateUserCredentials = async (email, password) => {
  try {
    // Find user by email
    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
      return { success: false, message: "Invalid credentials" };
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return { success: false, message: "Invalid credentials" };
    }

    // Remove password before returning
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    return { success: true, user: userWithoutPassword };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
const generateAuthToken = (user) => {
  const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
  const JWT_SECRET = process.env.JWT_SECRET;
  return jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

export { validateUserCredentials, generateAuthToken };
