import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['CEO', 'TL', 'ATL', 'PM', 'Developer'], 
    required: true 
  },
  designation: { type: String },
  department: { type: String },
  joinedDate: { type: Date, default: Date.now },
  status: { 
    type: String, 
    enum: ['Active', 'Inactive'], 
    default: 'Active' 
  }
}, { timestamps: true });

export default mongoose.model('Employee', employeeSchema);