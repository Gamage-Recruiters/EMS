import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
  teamName: { type: String, required: true },
  description: { type: String },
  createdDate: { type: Date, default: Date.now },
  teamLead: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  members: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  departments: {
    frontend: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    backend: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    hr: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    admin: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    maintenance: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  }
}, { timestamps: true });

export default mongoose.model('Team', teamSchema);