import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  // Basic personal details
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },

  // Login and authentication
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  refreshToken: { type: String },
  googleId: { type: String },

  // Contact information
  contactNumber: { type: String, default: '' },
  address: { type: String, default: '' },
  city: { type: String, default: '' },

  // Role and permissions
  role: {
    type: String,
    enum: ['CEO', 'SystemAdmin', 'TL', 'ATL', 'PM', 'Developer', 'Unassigned'],
    default: 'Unassigned',
  },

  // Profile information
  profileImage: { type: String, default: '' },

  // Job-related info
  designation: { type: String },
  department: { type: String },
  joinedDate: { type: Date, default: Date.now },

  // Education information
  education: {
    institution: { type: String, default: '' },
    department: { type: String, default: '' },
    degree: { type: String, default: '' },
    location: { type: String, default: '' },
    startDate: { type: Date },
    endDate: { type: Date }
  },

  // Account state
  status: { 
    type: String, 
    enum: ['Active', 'Inactive'], 
    default: 'Active' 
  },
}, { timestamps: true });

export default mongoose.model('User', userSchema);
