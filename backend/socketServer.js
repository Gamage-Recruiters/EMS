// socketServer.js
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import User from "./models/User.js";
import Channel from "./models/Channel.js";
import Message from "./models/Message.js";

/**
 * Parse allowed origins from env:
 * CLIENT_URLS="http://localhost:5173,https://myapp.vercel.app,https://mydomain.com"
 */
function getAllowedOrigins() {
  const raw = process.env.CLIENT_URLS || "http://localhost:5173";
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

const initializeSocket = (httpServer) => {
  const allowedOrigins = getAllowedOrigins();

  const io = new Server(httpServer, {
    cors: {
      origin: (origin, callback) => {
        // Allow non-browser clients or same-origin (origin can be undefined)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
          return callback(null, true);
        }

        return callback(
          new Error(`CORS blocked for origin: ${origin}`),
          false
        );
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    },
    // Optional: helps when Render/proxies are involved
    transports: ["websocket", "polling"],
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake?.auth?.token;

      if (!token) {
        return next(new Error("Authentication error: No token provided"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id).select(
        "-password -refreshToken"
      );

      if (!user) {
        return next(new Error("Authentication error: User not found"));
      }

      socket.user = user;
      return next();
    } catch (error) {
      return next(new Error("Authentication error: Invalid/Expired token"));
    }
  });

  io.on("connection", async (socket) => {
    try {
      console.log(
        `User connected: ${socket.user.email} (${socket.user.role})`
      );

      // Join user to their channels
      const userChannels = await Channel.find({
        members: socket.user._id,
        isActive: true,
      });

      userChannels.forEach((channel) => {
        socket.join(`channel:${channel._id}`);
      });

      // Join user to their private room (for DMs)
      socket.join(`user:${socket.user._id}`);

      // Send initial data
      socket.emit("user:data", {
        _id: socket.user._id,
        firstName: socket.user.firstName,
        lastName: socket.user.lastName,
        email: socket.user.email,
        role: socket.user.role,
        profileImage: socket.user.profileImage,
      });

      // ==================== CHANNEL EVENTS ====================

      // Get user's channels
      socket.on("channels:get", async (callback) => {
        try {
          let channels;

          if (socket.user.role === "CEO") {
            channels = await Channel.find({ isActive: true })
              .populate("createdBy", "firstName lastName role")
              .populate("members", "firstName lastName email role")
              .sort({ createdAt: -1 });
          } else if (socket.user.role === "TL" || socket.user.role === "PM") {
            channels = await Channel.find({ isActive: true })
              .populate("createdBy", "firstName lastName role")
              .populate("members", "firstName lastName email role")
              .sort({ createdAt: -1 });
          } else {
            channels = await Channel.find({
              members: socket.user._id,
              isActive: true,
            })
              .populate("createdBy", "firstName lastName role")
              .populate("members", "firstName lastName email role")
              .sort({ createdAt: -1 });
          }

          callback({ success: true, channels });
        } catch (error) {
          callback({ success: false, error: error.message });
        }
      });

      // Create channel (TL/PM/CEO only)
      socket.on("channel:create", async (data, callback) => {
        try {
          if (!["CEO", "TL", "PM"].includes(socket.user.role)) {
            return callback({
              success: false,
              error: "Only CEO, TL, or PM can create channels",
            });
          }

          const { name, type, memberIds, description } = data;

          if (!name || !type) {
            return callback({
              success: false,
              error: "Channel name and type are required",
            });
          }

          const channel = await Channel.create({
            name,
            type: type || "regular",
            createdBy: socket.user._id,
            members: memberIds || [socket.user._id],
            description: description || "",
          });

          const populatedChannel = await Channel.findById(channel._id)
            .populate("createdBy", "firstName lastName role")
            .populate("members", "firstName lastName email role");

          // Add creator to channel room
          socket.join(`channel:${channel._id}`);

          // Notify all members
          populatedChannel.members.forEach((member) => {
            io.to(`user:${member._id}`).emit("channel:created", populatedChannel);
          });

          callback({ success: true, channel: populatedChannel });
        } catch (error) {
          callback({ success: false, error: error.message });
        }
      });

      // Remove member from channel (TL/PM/CEO only)
      socket.on("channel:removeMember", async (data, callback) => {
        try {
          if (!["CEO", "TL", "PM"].includes(socket.user.role)) {
            return callback({
              success: false,
              error: "Only CEO, TL, or PM can remove members",
            });
          }

          const { channelId, userId } = data;

          const channel = await Channel.findById(channelId);

          if (!channel) {
            return callback({ success: false, error: "Channel not found" });
          }

          channel.members = channel.members.filter(
            (memberId) => memberId.toString() !== userId
          );

          await channel.save();

          const updatedChannel = await Channel.findById(channelId)
            .populate("createdBy", "firstName lastName role")
            .populate("members", "firstName lastName email role");

          // Remove user from channel room
          const userSockets = await io.in(`user:${userId}`).fetchSockets();
          userSockets.forEach((s) => s.leave(`channel:${channelId}`));

          // Notify removed user
          io.to(`user:${userId}`).emit("channel:removed", { channelId });

          // Notify channel members
          io.to(`channel:${channelId}`).emit("channel:memberRemoved", {
            channelId,
            userId,
            channel: updatedChannel,
          });

          callback({ success: true, channel: updatedChannel });
        } catch (error) {
          callback({ success: false, error: error.message });
        }
      });

      // Add member to channel (TL/PM/CEO only)
      socket.on("channel:addMember", async (data, callback) => {
        try {
          if (!["CEO", "TL", "PM"].includes(socket.user.role)) {
            return callback({
              success: false,
              error: "Only CEO, TL, or PM can add members",
            });
          }

          const { channelId, userId } = data;

          const channel = await Channel.findById(channelId);

          if (!channel) {
            return callback({ success: false, error: "Channel not found" });
          }

          // Add member if not already present
          if (!channel.members.map(String).includes(String(userId))) {
            channel.members.push(userId);
            await channel.save();
          }

          const updatedChannel = await Channel.findById(channelId)
            .populate("createdBy", "firstName lastName role")
            .populate("members", "firstName lastName email role");

          // Add user to channel room
          const userSockets = await io.in(`user:${userId}`).fetchSockets();
          userSockets.forEach((s) => s.join(`channel:${channelId}`));

          // Notify added user
          io.to(`user:${userId}`).emit("channel:added", updatedChannel);

          // Notify channel members
          io.to(`channel:${channelId}`).emit("channel:memberAdded", {
            channelId,
            userId,
            channel: updatedChannel,
          });

          callback({ success: true, channel: updatedChannel });
        } catch (error) {
          callback({ success: false, error: error.message });
        }
      });

      // ==================== MESSAGE EVENTS ====================

      // Get messages for a channel
      socket.on("messages:get", async (data, callback) => {
        try {
          const { channelId, limit = 50, skip = 0 } = data;

          const channel = await Channel.findById(channelId);

          if (!channel) {
            return callback({ success: false, error: "Channel not found" });
          }

          const isMember = channel.members.some(
            (memberId) =>
              memberId.toString() === socket.user._id.toString()
          );

          const canAccess =
            socket.user.role === "CEO" ||
            socket.user.role === "TL" ||
            socket.user.role === "PM" ||
            isMember;

          if (!canAccess) {
            return callback({
              success: false,
              error: "You do not have access to this channel",
            });
          }

          const messages = await Message.find({ channelId })
            .populate("userId", "firstName lastName email role profileImage")
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip);

          callback({ success: true, messages: messages.reverse() });
        } catch (error) {
          callback({ success: false, error: error.message });
        }
      });

      // Send message
      socket.on("message:send", async (data, callback) => {
        try {
          const { channelId, text, attachments } = data;

          if (!text || !text.trim()) {
            return callback({ success: false, error: "Message cannot be empty" });
          }

          const channel = await Channel.findById(channelId);

          if (!channel) {
            return callback({ success: false, error: "Channel not found" });
          }

          let canSend = false;

          if (socket.user.role === "CEO") {
            canSend = true;
          } else if (socket.user.role === "TL" || socket.user.role === "PM") {
            canSend = true;
          } else {
            const isMember = channel.members.some(
              (memberId) =>
                memberId.toString() === socket.user._id.toString()
            );
            canSend = isMember && channel.type !== "notice";
          }

          if (!canSend) {
            return callback({
              success: false,
              error:
                "You do not have permission to send messages in this channel",
            });
          }

          const message = await Message.create({
            channelId,
            userId: socket.user._id,
            text: text.trim(),
            attachments: attachments || [],
          });

          const populatedMessage = await Message.findById(message._id).populate(
            "userId",
            "firstName lastName email role profileImage"
          );

          io.to(`channel:${channelId}`).emit("message:new", populatedMessage);

          callback({ success: true, message: populatedMessage });
        } catch (error) {
          callback({ success: false, error: error.message });
        }
      });

      // Edit message
      socket.on("message:edit", async (data, callback) => {
        try {
          const { messageId, text } = data;

          const message = await Message.findById(messageId);

          if (!message) {
            return callback({ success: false, error: "Message not found" });
          }

          if (message.userId.toString() !== socket.user._id.toString()) {
            return callback({
              success: false,
              error: "You can only edit your own messages",
            });
          }

          message.text = text.trim();
          message.isEdited = true;
          message.editedAt = new Date();
          await message.save();

          const updatedMessage = await Message.findById(messageId).populate(
            "userId",
            "firstName lastName email role profileImage"
          );

          io.to(`channel:${message.channelId}`).emit(
            "message:edited",
            updatedMessage
          );

          callback({ success: true, message: updatedMessage });
        } catch (error) {
          callback({ success: false, error: error.message });
        }
      });

      // Delete message
      socket.on("message:delete", async (data, callback) => {
        try {
          const { messageId } = data;

          const message = await Message.findById(messageId);

          if (!message) {
            return callback({ success: false, error: "Message not found" });
          }

          const canDelete =
            message.userId.toString() === socket.user._id.toString() ||
            ["CEO", "TL", "PM"].includes(socket.user.role);

          if (!canDelete) {
            return callback({
              success: false,
              error: "You do not have permission to delete this message",
            });
          }

          const channelId = message.channelId;
          await Message.findByIdAndDelete(messageId);

          io.to(`channel:${channelId}`).emit("message:deleted", { messageId });

          callback({ success: true, messageId });
        } catch (error) {
          callback({ success: false, error: error.message });
        }
      });

      // ==================== NOTICE EVENTS (CEO only) ====================

      socket.on("notice:send", async (data, callback) => {
        try {
          if (socket.user.role !== "CEO") {
            return callback({
              success: false,
              error: "Only CEO can send notices",
            });
          }

          const { channelId, text } = data;

          if (!text || !text.trim()) {
            return callback({ success: false, error: "Notice cannot be empty" });
          }

          const channel = await Channel.findById(channelId);

          if (!channel || channel.type !== "notice") {
            return callback({
              success: false,
              error: "Invalid notice channel",
            });
          }

          const message = await Message.create({
            channelId,
            userId: socket.user._id,
            text: text.trim(),
          });

          const populatedMessage = await Message.findById(message._id).populate(
            "userId",
            "firstName lastName email role profileImage"
          );

          io.emit("notice:new", populatedMessage);

          callback({ success: true, message: populatedMessage });
        } catch (error) {
          callback({ success: false, error: error.message });
        }
      });

      // ==================== PRIVATE CHAT EVENTS (CEO) ====================

      socket.on("employees:get", async (callback) => {
        try {
          if (socket.user.role !== "CEO") {
            return callback({
              success: false,
              error: "Only CEO can access employee list",
            });
          }

          const employees = await User.find({
            role: { $ne: "CEO" },
            status: "Active",
          }).select("firstName lastName email role profileImage");

          callback({ success: true, employees });
        } catch (error) {
          callback({ success: false, error: error.message });
        }
      });

      socket.on("private:send", async (data, callback) => {
        try {
          if (socket.user.role !== "CEO") {
            return callback({
              success: false,
              error: "Only CEO can send private messages",
            });
          }

          const { recipientId, text } = data;

          if (!text || !text.trim()) {
            return callback({ success: false, error: "Message cannot be empty" });
          }

          let channel = await Channel.findOne({
            type: "private",
            members: { $all: [socket.user._id, recipientId] },
          });

          if (!channel) {
            const recipient = await User.findById(recipientId);
            channel = await Channel.create({
              name: `Private: CEO - ${recipient.firstName} ${recipient.lastName}`,
              type: "private",
              createdBy: socket.user._id,
              members: [socket.user._id, recipientId],
            });

            socket.join(`channel:${channel._id}`);
            const recipientSockets = await io
              .in(`user:${recipientId}`)
              .fetchSockets();
            recipientSockets.forEach((s) => s.join(`channel:${channel._id}`));
          }

          const message = await Message.create({
            channelId: channel._id,
            userId: socket.user._id,
            text: text.trim(),
          });

          const populatedMessage = await Message.findById(message._id).populate(
            "userId",
            "firstName lastName email role profileImage"
          );

          io.to(`channel:${channel._id}`).emit("private:message", {
            channelId: channel._id,
            message: populatedMessage,
          });

          callback({
            success: true,
            message: populatedMessage,
            channelId: channel._id,
          });
        } catch (error) {
          callback({ success: false, error: error.message });
        }
      });

      // ==================== SEARCH ====================

      socket.on("search:messages", async (data, callback) => {
        try {
          const { query, limit = 20 } = data;

          if (!query || query.trim().length < 2) {
            return callback({
              success: false,
              error: "Search query must be at least 2 characters",
            });
          }

          let searchFilter = {
            text: { $regex: query.trim(), $options: "i" },
          };

          if (!["CEO", "TL", "PM"].includes(socket.user.role)) {
            const userChannels = await Channel.find({
              members: socket.user._id,
              isActive: true,
            }).select("_id");

            searchFilter.channelId = {
              $in: userChannels.map((ch) => ch._id),
            };
          }

          const messages = await Message.find(searchFilter)
            .populate("userId", "firstName lastName email role profileImage")
            .populate("channelId", "name type")
            .sort({ createdAt: -1 })
            .limit(limit);

          callback({ success: true, results: messages });
        } catch (error) {
          callback({ success: false, error: error.message });
        }
      });

      // ==================== TYPING INDICATOR ====================

      socket.on("typing:start", (data) => {
        const { channelId } = data;
        socket.to(`channel:${channelId}`).emit("typing:user", {
          channelId,
          userId: socket.user._id,
          userName: `${socket.user.firstName} ${socket.user.lastName}`,
          isTyping: true,
        });
      });

      socket.on("typing:stop", (data) => {
        const { channelId } = data;
        socket.to(`channel:${channelId}`).emit("typing:user", {
          channelId,
          userId: socket.user._id,
          userName: `${socket.user.firstName} ${socket.user.lastName}`,
          isTyping: false,
        });
      });

      // ==================== DISCONNECT ====================

      socket.on("disconnect", (reason) => {
        console.log(`User disconnected: ${socket.user.email} - ${reason}`);
      });
    } catch (err) {
      console.error("Socket connection handler error:", err);
      socket.disconnect(true);
    }
  });

  // Optional: helps debug handshake issues
  io.engine.on("connection_error", (err) => {
    console.error("Socket.IO connection_error:", {
      code: err.code,
      message: err.message,
      context: err.context,
    });
  });

  return io;
};

export default initializeSocket;
