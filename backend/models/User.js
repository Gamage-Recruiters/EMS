import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  // Basic personal details
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },

  // Login and authentication
  email: { type: String, required: true, unique: true },
  password: {
    type: String,
    required: function () {
      return !this.googleId;
    },
  },
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
}, { timestamps: true });

export default mongoose.model('User', userSchema);
