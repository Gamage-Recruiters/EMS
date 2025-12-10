import bcrypt from "bcryptjs";
import User from "../models/User.js";
import AppError from "../utils/AppError.js";

/**
 * @desc   Forgot password
 * @route  POST /api/user/forgot-password
 * @access Public
 * Body: { email, newPassword }
 */
export const forgotPassword = async (req, res, next) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return next(new AppError("Email and newPassword are required", 400));
    }

    const user = await User.findOne({ email });

    if (!user) {
      // For assignment we can be honest and say not found
      return next(new AppError("User with this email not found", 404));
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.status(200).json({
      message: "Password reset successfully",
    });
  } catch (error) {
    next(error);
  }
};