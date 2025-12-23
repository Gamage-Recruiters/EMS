import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  projectName: { type: String, required: true },
  description: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
  status: { 
    type: String, 
    enum: ['Active', 'Completed', 'On Hold', 'Cancelled'],
    default: 'Active' 
  }
}, { timestamps: true });

export default mongoose.model('Project', projectSchema);