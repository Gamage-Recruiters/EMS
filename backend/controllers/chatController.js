// controllers/chatController.js
import Channel from '../models/Channel.js';
import Message from '../models/Message.js';
import User from '../models/User.js';
import AppError from '../utils/AppError.js';

// ==================== CHANNEL CONTROLLERS ====================

// @desc    Get all channels user has access to
export const getChannels = async (req, res, next) => {
  try {
    let channels;

    if (req.user.role === 'CEO') {
      // CEO can see all channels
      channels = await Channel.find({ isActive: true })
        .populate('createdBy', 'firstName lastName role')
        .populate('members', 'firstName lastName email role profileImage')
        .sort({ createdAt: -1 });
    } else if (req.user.role === 'TL' || req.user.role === 'PM') {
      // TL/PM can see all channels
      channels = await Channel.find({ isActive: true })
        .populate('createdBy', 'firstName lastName role')
        .populate('members', 'firstName lastName email role profileImage')
        .sort({ createdAt: -1 });
    } else {
      // Regular employees see only channels they're members of
      channels = await Channel.find({
        members: req.user._id,
        isActive: true,
      })
        .populate('createdBy', 'firstName lastName role')
        .populate('members', 'firstName lastName email role profileImage')
        .sort({ createdAt: -1 });
    }

    res.json({
      success: true,
      count: channels.length,
      channels,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new channel
export const createChannel = async (req, res, next) => {
  try {
    if (!['CEO', 'TL', 'PM'].includes(req.user.role)) {
      return next(new AppError('Only CEO, TL, or PM can create channels', 403));
    }

    const { name, type, memberIds, description } = req.body;

    if (!name || !type) {
      return next(new AppError('Channel name and type are required', 400));
    }

    // Validate type
    if (!['regular', 'notice', 'private'].includes(type)) {
      return next(new AppError('Invalid channel type', 400));
    }

    // Create channel
    const channel = await Channel.create({
      name,
      type,
      createdBy: req.user._id,
      members: memberIds || [req.user._id],
      description: description || '',
    });

    const populatedChannel = await Channel.findById(channel._id)
      .populate('createdBy', 'firstName lastName role')
      .populate('members', 'firstName lastName email role profileImage');

    res.status(201).json({
      success: true,
      channel: populatedChannel,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get channel by ID
export const getChannelById = async (req, res, next) => {
  try {
    const { channelId } = req.params;

    const channel = await Channel.findById(channelId)
      .populate('createdBy', 'firstName lastName role')
      .populate('members', 'firstName lastName email role profileImage');

    if (!channel) {
      return next(new AppError('Channel not found', 404));
    }

    // Check if user has access
    const isMember = channel.members.some(
      (member) => member._id.toString() === req.user._id.toString()
    );

    const canAccess =
      req.user.role === 'CEO' ||
      req.user.role === 'TL' ||
      req.user.role === 'PM' ||
      isMember;

    if (!canAccess) {
      return next(new AppError('You do not have access to this channel', 403));
    }

    res.json({
      success: true,
      channel,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add member to channel
export const addMemberToChannel = async (req, res, next) => {
  try {
    if (!['CEO', 'TL', 'PM'].includes(req.user.role)) {
      return next(new AppError('Only CEO, TL, or PM can add members', 403));
    }

    const { channelId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return next(new AppError('User ID is required', 400));
    }

    const channel = await Channel.findById(channelId);

    if (!channel) {
      return next(new AppError('Channel not found', 404));
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    // Add member if not already present
    if (!channel.members.includes(userId)) {
      channel.members.push(userId);
      await channel.save();
    }

    const updatedChannel = await Channel.findById(channelId)
      .populate('createdBy', 'firstName lastName role')
      .populate('members', 'firstName lastName email role profileImage');

    res.json({
      success: true,
      message: 'Member added successfully',
      channel: updatedChannel,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove member from channel
export const removeMemberFromChannel = async (req, res, next) => {
  try {
    if (!['CEO', 'TL', 'PM'].includes(req.user.role)) {
      return next(new AppError('Only CEO, TL, or PM can remove members', 403));
    }

    const { channelId, userId } = req.params;

    const channel = await Channel.findById(channelId);

    if (!channel) {
      return next(new AppError('Channel not found', 404));
    }

    // Remove member
    channel.members = channel.members.filter(
      (memberId) => memberId.toString() !== userId
    );

    await channel.save();

    const updatedChannel = await Channel.findById(channelId)
      .populate('createdBy', 'firstName lastName role')
      .populate('members', 'firstName lastName email role profileImage');

    res.json({
      success: true,
      message: 'Member removed successfully',
      channel: updatedChannel,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete channel
export const deleteChannel = async (req, res, next) => {
  try {
    if (req.user.role !== 'CEO') {
      return next(new AppError('Only CEO can delete channels', 403));
    }

    const { channelId } = req.params;

    const channel = await Channel.findById(channelId);

    if (!channel) {
      return next(new AppError('Channel not found', 404));
    }

    // Soft delete
    channel.isActive = false;
    await channel.save();

    res.json({
      success: true,
      message: 'Channel deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// ==================== MESSAGE CONTROLLERS ====================

// @desc    Get messages for a channel
export const getMessages = async (req, res, next) => {
  try {
    const { channelId } = req.params;
    const { limit = 50, skip = 0 } = req.query;

    const channel = await Channel.findById(channelId);

    if (!channel) {
      return next(new AppError('Channel not found', 404));
    }

    // Check if user has access
    const isMember = channel.members.some(
      (memberId) => memberId.toString() === req.user._id.toString()
    );

    const canAccess =
      req.user.role === 'CEO' ||
      req.user.role === 'TL' ||
      req.user.role === 'PM' ||
      isMember;

    if (!canAccess) {
      return next(new AppError('You do not have access to this channel', 403));
    }

    const messages = await Message.find({ channelId })
      .populate('userId', 'firstName lastName email role profileImage')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    res.json({
      success: true,
      count: messages.length,
      messages: messages.reverse(),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send a message to channel
export const sendMessage = async (req, res, next) => {
  try {
    const { channelId } = req.params;
    const { text, attachments } = req.body;

    if (!text || !text.trim()) {
      return next(new AppError('Message text is required', 400));
    }

    const channel = await Channel.findById(channelId);

    if (!channel) {
      return next(new AppError('Channel not found', 404));
    }

    // Check permissions
    let canSend = false;

    if (req.user.role === 'CEO') {
      // CEO can send to any channel
      canSend = true;
    } else if (req.user.role === 'TL' || req.user.role === 'PM') {
      // TL/PM can send to any channel
      canSend = true;
    } else {
      // Regular employees can only send to channels they're members of
      // and cannot send to notice channels
      const isMember = channel.members.some(
        (memberId) => memberId.toString() === req.user._id.toString()
      );
      canSend = isMember && channel.type !== 'notice';
    }

    if (!canSend) {
      return next(
        new AppError('You do not have permission to send messages in this channel', 403)
      );
    }

    // Create message
    const message = await Message.create({
      channelId,
      userId: req.user._id,
      text: text.trim(),
      attachments: attachments || [],
    });

    const populatedMessage = await Message.findById(message._id)
      .populate('userId', 'firstName lastName email role profileImage');

    res.status(201).json({
      success: true,
      message: populatedMessage,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Edit a message
export const editMessage = async (req, res, next) => {
  try {
    const { messageId } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return next(new AppError('Message text is required', 400));
    }

    const message = await Message.findById(messageId);

    if (!message) {
      return next(new AppError('Message not found', 404));
    }

    // Only message owner can edit
    if (message.userId.toString() !== req.user._id.toString()) {
      return next(new AppError('You can only edit your own messages', 403));
    }

    message.text = text.trim();
    message.isEdited = true;
    message.editedAt = new Date();
    await message.save();

    const updatedMessage = await Message.findById(messageId)
      .populate('userId', 'firstName lastName email role profileImage');

    res.json({
      success: true,
      message: updatedMessage,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a message
export const deleteMessage = async (req, res, next) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findById(messageId);

    if (!message) {
      return next(new AppError('Message not found', 404));
    }

    // Only message owner, TL, PM, or CEO can delete
    const canDelete =
      message.userId.toString() === req.user._id.toString() ||
      ['CEO', 'TL', 'PM'].includes(req.user.role);

    if (!canDelete) {
      return next(new AppError('You do not have permission to delete this message', 403));
    }

    await Message.findByIdAndDelete(messageId);

    res.json({
      success: true,
      message: 'Message deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// ==================== NOTICE CONTROLLERS (CEO) ====================

// @desc    Send a notice
export const sendNotice = async (req, res, next) => {
  try {
    if (req.user.role !== 'CEO') {
      return next(new AppError('Only CEO can send notices', 403));
    }

    const { channelId, text } = req.body;

    if (!text || !text.trim()) {
      return next(new AppError('Notice text is required', 400));
    }

    if (!channelId) {
      return next(new AppError('Channel ID is required', 400));
    }

    const channel = await Channel.findById(channelId);

    if (!channel || channel.type !== 'notice') {
      return next(new AppError('Invalid notice channel', 400));
    }

    // Create notice message
    const message = await Message.create({
      channelId,
      userId: req.user._id,
      text: text.trim(),
    });

    const populatedMessage = await Message.findById(message._id)
      .populate('userId', 'firstName lastName email role profileImage');

    res.status(201).json({
      success: true,
      message: populatedMessage,
    });
  } catch (error) {
    next(error);
  }
};

// ==================== PRIVATE CHAT CONTROLLERS (CEO) ====================

// @desc    Get all employees for private chat
export const getEmployees = async (req, res, next) => {
  try {
    if (req.user.role !== 'CEO') {
      return next(new AppError('Only CEO can access employee list', 403));
    }

    const employees = await User.find({
      role: { $ne: 'CEO' },
      status: 'Active',
    }).select('firstName lastName email role profileImage department designation');

    res.json({
      success: true,
      count: employees.length,
      employees,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send private message
export const sendPrivateMessage = async (req, res, next) => {
  try {
    if (req.user.role !== 'CEO') {
      return next(new AppError('Only CEO can send private messages', 403));
    }

    const { recipientId, text } = req.body;

    if (!recipientId || !text || !text.trim()) {
      return next(new AppError('Recipient ID and message text are required', 400));
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return next(new AppError('Recipient not found', 404));
    }

    // Find or create private channel
    let channel = await Channel.findOne({
      type: 'private',
      members: { $all: [req.user._id, recipientId] },
    });

    if (!channel) {
      channel = await Channel.create({
        name: `Private: CEO - ${recipient.firstName} ${recipient.lastName}`,
        type: 'private',
        createdBy: req.user._id,
        members: [req.user._id, recipientId],
      });
    }

    // Create message
    const message = await Message.create({
      channelId: channel._id,
      userId: req.user._id,
      text: text.trim(),
    });

    const populatedMessage = await Message.findById(message._id)
      .populate('userId', 'firstName lastName email role profileImage');

    res.status(201).json({
      success: true,
      channelId: channel._id,
      message: populatedMessage,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all private channels
export const getPrivateChannels = async (req, res, next) => {
  try {
    if (req.user.role !== 'CEO') {
      return next(new AppError('Only CEO can access private channels', 403));
    }

    const channels = await Channel.find({
      type: 'private',
      members: req.user._id,
      isActive: true,
    })
      .populate('members', 'firstName lastName email role profileImage')
      .sort({ updatedAt: -1 });

    res.json({
      success: true,
      count: channels.length,
      channels,
    });
  } catch (error) {
    next(error);
  }
};

// ==================== SEARCH CONTROLLERS ====================

// @desc    Search messages
export const searchMessages = async (req, res, next) => {
  try {
    const { query, limit = 20 } = req.query;

    if (!query || query.trim().length < 2) {
      return next(new AppError('Search query must be at least 2 characters', 400));
    }

    let searchFilter = {
      text: { $regex: query.trim(), $options: 'i' },
    };

    // Restrict search based on role
    if (!['CEO', 'TL', 'PM'].includes(req.user.role)) {
      const userChannels = await Channel.find({
        members: req.user._id,
        isActive: true,
      }).select('_id');

      searchFilter.channelId = {
        $in: userChannels.map((ch) => ch._id),
      };
    }

    const messages = await Message.find(searchFilter)
      .populate('userId', 'firstName lastName email role profileImage')
      .populate('channelId', 'name type')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: messages.length,
      results: messages,
    });
  } catch (error) {
    next(error);
  }
};