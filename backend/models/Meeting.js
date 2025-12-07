import mongoose from 'mongoose';

const meetingSchema = new mongoose.Schema({
  scheduledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
  team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  date: { type: Date, required: true },
  time: { type: String },
  agenda: { type: String }
}, { timestamps: true });

export default mongoose.model('Meeting', meetingSchema);