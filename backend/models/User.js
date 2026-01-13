import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // Basic personal details
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },

    // Login and authentication
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    refreshToken: { type: String },
    googleId: { type: String },

    // Role and permissions
    role: {
      type: String,
      enum: ["CEO", "TL", "DEVELOPER", "SYSTEM_OWNER", "HR"],
      default: "DEVELOPER",
    },

    // Profile information
    profilePicture: { type: String, default: null },
    phone: { type: String, default: null },
    department: { type: String, default: null },
    position: { type: String, default: null },
    address: { type: String, default: null },
    city: { type: String, default: null },
    state: { type: String, default: null },
    country: { type: String, default: null },
    zipCode: { type: String, default: null },

    // Education details
    education: [
      {
        school: String,
        degree: String,
        field: String,
        startYear: Number,
        endYear: Number,
      },
    ],

    // Job-related info
    jobDetails: {
      joinDate: Date,
      designation: String,
      department: String,
      manager: mongoose.Schema.Types.ObjectId,
    },

    // Account state
    isActive: { type: Boolean, default: true },
    emailVerified: { type: Boolean, default: false },
    passwordResetToken: String,
    passwordResetExpire: Date,
    lastLogin: Date,
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
