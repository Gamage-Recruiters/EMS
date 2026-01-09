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

  // Account state
  status: { 
    type: String, 
    enum: ['Active', 'Inactive'], 
    default: 'Active' 
  },

  // Contact information
  contactNumber: { type: String, default: '' },
  address: { type: String, default: '' },
  city: { type: String, default: '' },

  // Education details
  education: {
    institution: { type: String, default: '' },
    department: { type: String, default: '' },
    degree: { type: String, default: '' },
    location: { type: String, default: '' },
    startDate: { type: Date },
    endDate: { type: Date }
  }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
