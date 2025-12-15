const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  room: {
    type: String,
    required: true,
    enum: ['general', 'frontend', 'backend', 'admin']
  },
  sender: {
    id: String,
    name: String,
    role: String,
    department: String
  },
  message: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  isAdminMessage: {
    type: Boolean,
    default: false
  }
});

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ['general', 'frontend', 'backend', 'admin'],
    unique: true
  },
  description: String,
  createdBy: {
    id: String,
    name: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

const userRoomSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  room: {
    type: String,
    required: true,
    enum: ['general', 'frontend', 'backend', 'admin']
  },
  joinedAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

const Message = mongoose.model('Message', messageSchema);
const Room = mongoose.model('Room', roomSchema);
const UserRoom = mongoose.model('UserRoom', userRoomSchema);

module.exports = { Message, Room, UserRoom };