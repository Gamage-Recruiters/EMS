import bcrypt from "bcryptjs";
import User from "../models/User.js";
import AppError from "../utils/AppError.js";
import { updateUserProfile as authUpdateUserProfile } from "./authController.js";


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

    if (newPassword.length < 6) {
    return next(new AppError("Password must be at least 6 characters", 400));
    }

    const user = await User.findOne({ email });

    if (!user) {
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


/**
 * @desc   Get current logged-in user details
 * @route  GET /api/user/me
 * @access Private
 */
export const getCurrentUser = async (req, res, next) => {
  try {
    // protect middleware already attached user in req.user (without password)
    if (!req.user) {
      return next(new AppError("User not found in request", 401));
    }

    res.status(200).json(req.user);
  } catch (error) {
    next(error);
  }
};


/**
 * @desc   Get all users
 * @route  GET /api/user
 * @access Private 
 */
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password -refreshToken");
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};


/**
 * @desc   Get user by ID
 * @route  GET /api/user/:id
 * @access Private
 */
export const getUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId).select("-password -refreshToken");

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};


/**
 * @desc   Update user profile
 * @route  PUT /api/user/me
 * @access Private
 */

export const updateUserProfile = (req, res, next) => {
  // simply call the existing function
  return authUpdateUserProfile(req, res, next);
};