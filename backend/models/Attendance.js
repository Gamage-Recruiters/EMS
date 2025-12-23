import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  employee: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  date: { type: Date, required: true },
  checkInTime: { type: Date },
  checkOutTime: { type: Date },
  status: { 
    type: String, 
    enum: ['Present', 'Absent', 'Late', 'On Leave'], 
    default: 'Absent' 
  },
  workingHours: { type: Number, default: 0 },
  isLeaveDay: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Attendance', attendanceSchema);