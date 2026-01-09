import User from "../models/User.js";
import AppError from "../utils/AppError.js";
import bcrypt from "bcryptjs";

//System owner or CEO add a developer
export const addUserByAdmin = async (req, res, next) => {
  try {
    const actorRole = req.user.role;

    // Authorization check
    if (actorRole !== 'CEO' && actorRole !== 'SystemAdmin') {
      return next(new AppError('Not authorized to add users', 403));
    }

    const {
      firstName,
      lastName,
      email,
      password,
      role,
      designation,
      department,
      contactNumber,
      address,
      city,
      education
    } = req.body;

    // Basic validation
    if (!firstName || !lastName || !email || !password || !role) {
      return next(new AppError('Missing required fields', 400));
    }

    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError('User already exists with this email', 400));
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      designation,
      department,
      contactNumber: contactNumber || '',
      address: address || '',
      city: city || '',
      profileImage: req.file ? req.file.filename : '',
      education: {
        institution: education?.institution || '',
        department: education?.department || '',
        degree: education?.degree || '',
        location: education?.location || '',
        startDate: education?.startDate ? new Date(education.startDate) : undefined,
        endDate: education?.endDate ? new Date(education.endDate) : undefined
      },
      status: 'Active'
    });

    res.status(201).json({
      message: 'User added successfully',
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        designation: user.designation,
        department: user.department,
        contactNumber: user.contactNumber,
        address: user.address,
        city: user.city,
        profileImage: user.profileImage,
        education: user.education
      }
    });

  } catch (error) {
    next(error);
  }
};


// System owner or CEO update user profile
export const updateUserByAdmin = async (req, res, next) => {
  try {
    const actorRole = req.user.role;

    // Authorization
    if (actorRole !== "CEO" && actorRole !== "SystemAdmin") {
      return next(new AppError("Not authorized to update users", 403));
    }

    const { userId } = req.params;
    const {
      firstName,
      lastName,
      email,
      password,
      designation,
      department,
      status,
      role,
      contactNumber,
      address,
      city,
      education
    } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return next(new AppError("User not found", 404));
    }

    // Update fields
    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (email !== undefined) user.email = email;
    if (designation !== undefined) user.designation = designation;
    if (department !== undefined) user.department = department;
    if (status !== undefined) user.status = status;
    if (contactNumber !== undefined) user.contactNumber = contactNumber;
    if (address !== undefined) user.address = address;
    if (city !== undefined) user.city = city;
    if (req.file) user.profileImage = req.file.filename;
    
    // Update education fields
    if (education !== undefined) {
      if (education.institution !== undefined) user.education.institution = education.institution;
      if (education.department !== undefined) user.education.department = education.department;
      if (education.degree !== undefined) user.education.degree = education.degree;
      if (education.location !== undefined) user.education.location = education.location;
      if (education.startDate !== undefined) user.education.startDate = education.startDate ? new Date(education.startDate) : null;
      if (education.endDate !== undefined) user.education.endDate = education.endDate ? new Date(education.endDate) : null;
    }

    // Role change (optional)
    if (role) {
      user.role = role;
    }

    // Password update (if provided)
    if (password) {
      if (password.length < 6) {
        return next(new AppError("Password must be at least 6 characters", 400));
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    res.status(200).json({
      message: "User profile updated successfully",
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        designation: user.designation,
        department: user.department,
        status: user.status,
        contactNumber: user.contactNumber,
        address: user.address,
        city: user.city,
        profileImage: user.profileImage,
        education: user.education
      }
    });

  } catch (error) {
    next(error);
  }
};


// System owner or CEO delete user profile
export const deleteUserByAdmin = async (req, res, next) => {
  try {
    const actorRole = req.user.role;

    // Authorization
    if (actorRole !== "CEO" && actorRole !== "SystemAdmin") {
      return next(new AppError("Not authorized to delete users", 403));
    }

    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return next(new AppError("User not found", 404));
    }

    await User.deleteOne({ _id: userId });

    res.status(200).json({
      message: "User removed successfully"
    });

  } catch (error) {
    next(error);
  }
};


// View all employees
export const getAllEmployees = async (req, res, next) => {
  try {
    const actorRole = req.user.role;

    if (actorRole !== "CEO" && actorRole !== "SystemAdmin") {
      return next(new AppError("Not authorized to view employees", 403));
    }

    const employees = await User.find()
      .select("-password -refreshToken") // Security: exclude sensitive fields
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: employees.length,
      employees
    });

  } catch (error) {
    next(error);
  }
};


// View single employee details
export const getEmployeeById = async (req, res, next) => {
  try {
    const actorRole = req.user.role;

    if (actorRole !== "CEO" && actorRole !== "SystemAdmin") {
      return next(new AppError("Not authorized to view employee details", 403));
    }

    const { userId } = req.params;

    const user = await User.findById(userId)
      .select("-password -refreshToken");

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    res.status(200).json({
      user
    });

  } catch (error) {
    next(error);
  }
};

// Get employees by name (firstName or lastName)
export const getEmployeesByName = async (req, res, next) => {
  try {
    const actorRole = req.user.role;

    if (actorRole !== "CEO" && actorRole !== "SystemAdmin") {
      return next(new AppError("Not authorized to view employees", 403));
    }

    const { name } = req.query;

    if (!name) {
      return next(new AppError("Name query parameter is required", 400));
    }

    const employees = await User.find({
      $or: [
        { firstName: { $regex: name, $options: "i" } },
        { lastName: { $regex: name, $options: "i" } }
      ]
    }).select("-password -refreshToken");

    res.status(200).json({
      count: employees.length,
      employees
    });

  } catch (error) {
    next(error);
  }
};


