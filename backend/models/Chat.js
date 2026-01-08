import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  chatName: { type: String },
  participants: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Employee' 
  }]
}, { timestamps: true });

export default mongoose.model('Chat', chatSchema);