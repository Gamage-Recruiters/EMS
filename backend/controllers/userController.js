import bcrypt from "bcryptjs";
import User from "../models/User.js";
import AppError from "../utils/AppError.js";

/**
 * @desc   Forgot password
 * @route  POST /api/user/forgot-password
 * @access Public
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
 * @desc   Get current logged-in user
 * @route  GET /api/user/me
 * @access Private
 */
  export const getCurrentUser = async (req, res, next) => {
    try {
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
    const user = await User.findById(req.params.id).select(
      "-password -refreshToken"
    );

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Update logged-in user's profile
 * @route  PUT /api/user/me
 * @access Private
 */
export const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    const {
      firstName,
      lastName,
      email,
      designation,
      department,
      contactNumber,
      address,
      city,
      education,
      password
    } = req.body;

    // Basic details
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;

    // Job info
    if (designation) user.designation = designation;
    if (department) user.department = department;

    // Contact info
    if (contactNumber !== undefined) user.contactNumber = contactNumber;
    if (address !== undefined) user.address = address;
    if (city !== undefined) user.city = city;

    // Education (nested object)
    if (education) {
      user.education = {
        institution: education.institution ?? user.education.institution,
        department: education.department ?? user.education.department,
        degree: education.degree ?? user.education.degree,
        location: education.location ?? user.education.location,
        startDate: education.startDate ?? user.education.startDate,
        endDate: education.endDate ?? user.education.endDate,
      };
    }

    // Password update
    if (password) {
      if (password.length < 6) {
        return next(
          new AppError("Password must be at least 6 characters", 400)
        );
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    // ✅ Profile image upload
    if (req.file) {
      user.profileImage = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    }

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profileImage: user.profileImage,
        designation: user.designation,
        department: user.department,
        contactNumber: user.contactNumber,
        address: user.address,
        city: user.city,
        education: user.education
      }
    });
  } catch (error) {
    next(error);
  }
};



export const deleteUserProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    res.status(200).json({
      message: "User account deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};

