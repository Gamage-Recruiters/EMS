import User from "../models/User.js";
import AppError from "../utils/AppError.js";

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
      department
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
        department: user.department
      }
    });

  } catch (error) {
    next(error);
  }
};


// System owner or CEO update developer profile
export const updateDeveloperByAdmin = async (req, res, next) => {
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
      role
    } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return next(new AppError("User not found", 404));
    }

    // Optional: restrict updates to developers only
    if (user.role !== "Developer") {
      return next(new AppError("Only developer profiles can be updated here", 403));
    }

    // Update fields
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;
    user.designation = designation || user.designation;
    user.department = department || user.department;
    user.status = status || user.status;

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
      message: "Developer profile updated successfully",
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        designation: user.designation,
        department: user.department,
        status: user.status
      }
    });

  } catch (error) {
    next(error);
  }
};


// System owner or CEO delete developer profile
export const deleteDeveloperByAdmin = async (req, res, next) => {
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

    // Safety check
    if (user.role !== "Developer") {
      return next(new AppError("Only developers can be deleted using this endpoint", 403));
    }

    await User.deleteOne({ _id: userId });

    res.status(200).json({
      message: "Developer removed successfully"
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


