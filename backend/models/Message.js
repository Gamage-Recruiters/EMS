import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    channelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Channel',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
    editedAt: {
      type: Date,
    },
    attachments: [
      {
        url: String,
        type: String,
        filename: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Virtual for formatted time
messageSchema.virtual('time').get(function () {
  return this.createdAt.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
});

// Populate user data when querying
messageSchema.pre('find', function (next) {
  this.populate({
    path: 'userId',
    select: 'username avatarColor',
  });
  next();
});

const Message = mongoose.model('Message', messageSchema);
export default Message;