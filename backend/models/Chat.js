import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: function() {
      return this.isGroupChat;
    }
  },
  isGroupChat: {
    type: Boolean,
    default: false
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: function() {
      return this.isGroupChat;
    }
  },
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  unreadCount: {
    type: Map,
    of: Number,
    default: {}
  },
  // For group chats
  avatar: {
    type: String,
    default: 'https://res.cloudinary.com/demo/image/upload/v1712756246/default_group.png'
  },
  description: {
    type: String,
    maxlength: [200, 'Description cannot exceed 200 characters']
  },
  // Soft delete
  isArchived: {
    type: Boolean,
    default: false
  },
  archivedBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    archivedAt: Date
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for messages
chatSchema.virtual('messages', {
  ref: 'Message',
  localField: '_id',
  foreignField: 'chat'
});

// Indexes
chatSchema.index({ participants: 1 });
chatSchema.index({ updatedAt: -1 });
chatSchema.index({ 'unreadCount': 1 });

// Static method to find or create one-on-one chat
chatSchema.statics.findOrCreateOneOnOne = async function(user1Id, user2Id) {
  const chat = await this.findOne({
    isGroupChat: false,
    participants: { $all: [user1Id, user2Id], $size: 2 }
  }).populate('participants', 'name email avatar');

  if (chat) return chat;

  // Create new one-on-one chat
  const newChat = new this({
    isGroupChat: false,
    participants: [user1Id, user2Id]
  });

  await newChat.save();
  
  return await this.findById(newChat._id).populate('participants', 'name email avatar');
};

// Method to update unread count
chatSchema.methods.incrementUnreadCount = function(userId) {
  const currentCount = this.unreadCount.get(userId.toString()) || 0;
  this.unreadCount.set(userId.toString(), currentCount + 1);
  return this.save();
};

// Method to reset unread count
chatSchema.methods.resetUnreadCount = function(userId) {
  this.unreadCount.set(userId.toString(), 0);
  return this.save();
};

// Method to check if user is participant
chatSchema.methods.isParticipant = function(userId) {
  return this.participants.some(participant => 
    participant._id.toString() === userId.toString()
  );
};

const Chat = mongoose.model('Chat', chatSchema);
export default Chat;