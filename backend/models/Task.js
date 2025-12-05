import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  project: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Project', 
    required: true 
  },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
  assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
  title: { type: String, required: true },
  description: { type: String },
  status: { 
    type: String, 
    enum: ['Pending', 'In Progress', 'On Hold', 'Completed'], 
    default: 'Pending' 
  }
}, { timestamps: true });

export default mongoose.model('Task', taskSchema);