// socketServer.js
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import User from "./models/User.js";
import Channel from "./models/Channel.js";
import Message from "./models/Message.js";

const initializeSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error("Authentication error"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select(
        "-password -refreshToken",
      );

      if (!user) {
        return next(new Error("User not found"));
      }

      socket.user = user;
      next();
    } catch (error) {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", async (socket) => {
    console.log(`User connected: ${socket.user.email} (${socket.user.role})`);

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

    socket.on("channels:get", async (callback) => {
      try {
        let channels;

        if (socket.user.role === "CEO") {
          channels = await Channel.find({ isActive: true })
            .populate("createdBy", "firstName lastName role")
            .populate("members", "firstName lastName email role profileImage")
            .sort({ createdAt: -1 });
        } else if (socket.user.role === "TL" || socket.user.role === "PM") {
          channels = await Channel.find({ isActive: true })
            .populate("createdBy", "firstName lastName role")
            .populate("members", "firstName lastName email role profileImage")
            .sort({ createdAt: -1 });
        } else {
          channels = await Channel.find({
            members: socket.user._id,
            isActive: true,
          })
            .populate("createdBy", "firstName lastName role")
            .populate("members", "firstName lastName email role profileImage")
            .sort({ createdAt: -1 });
        }

        callback?.({ success: true, channels });
      } catch (error) {
        console.error("channels:get error:", error);
        callback?.({ success: false, error: error.message });
      }
    });

    socket.on("channel:create", async (data, callback) => {
      try {
        if (!["CEO", "TL", "PM"].includes(socket.user.role)) {
          return callback?.({
            success: false,
            error: "Only CEO, TL, or PM can create channels",
          });
        }

        const { name, type, memberIds, description } = data;

        if (!name || !type) {
          return callback?.({
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

        socket.join(`channel:${channel._id}`);

        populatedChannel.members.forEach((member) => {
          io.to(`user:${member._id}`).emit("channel:created", populatedChannel);
        });

        callback?.({ success: true, channel: populatedChannel });
      } catch (error) {
        console.error("channel:create error:", error);
        callback?.({ success: false, error: error.message });
      }
    });

    socket.on("channel:removeMember", async (data, callback) => {
      try {
        if (!["CEO", "TL", "PM"].includes(socket.user.role)) {
          return callback?.({
            success: false,
            error: "Only CEO, TL, or PM can remove members",
          });
        }

        const { channelId, userId } = data;

        const channel = await Channel.findById(channelId);
        if (!channel) {
          return callback?.({ success: false, error: "Channel not found" });
        }

        channel.members = channel.members.filter(
          (memberId) => memberId.toString() !== userId,
        );

        await channel.save();

        const updatedChannel = await Channel.findById(channelId)
          .populate("createdBy", "firstName lastName role")
          .populate("members", "firstName lastName email role");

        const userSockets = await io.in(`user:${userId}`).fetchSockets();
        userSockets.forEach((s) => s.leave(`channel:${channelId}`));

        io.to(`user:${userId}`).emit("channel:removed", { channelId });

        io.to(`channel:${channelId}`).emit("channel:memberRemoved", {
          channelId,
          userId,
          channel: updatedChannel,
        });

        callback?.({ success: true, channel: updatedChannel });
      } catch (error) {
        console.error("channel:removeMember error:", error);
        callback?.({ success: false, error: error.message });
      }
    });

    socket.on("channel:addMember", async (data, callback) => {
      try {
        if (!["CEO", "TL", "PM"].includes(socket.user.role)) {
          return callback?.({
            success: false,
            error: "Only CEO, TL, or PM can add members",
          });
        }

        const { channelId, userId } = data;

        const channel = await Channel.findById(channelId);
        if (!channel) {
          return callback?.({ success: false, error: "Channel not found" });
        }

        if (!channel.members.includes(userId)) {
          channel.members.push(userId);
          await channel.save();
        }

        const updatedChannel = await Channel.findById(channelId)
          .populate("createdBy", "firstName lastName role")
          .populate("members", "firstName lastName email role");

        const userSockets = await io.in(`user:${userId}`).fetchSockets();
        userSockets.forEach((s) => s.join(`channel:${channelId}`));

        io.to(`user:${userId}`).emit("channel:added", updatedChannel);

        io.to(`channel:${channelId}`).emit("channel:memberAdded", {
          channelId,
          userId,
          channel: updatedChannel,
        });

        callback?.({ success: true, channel: updatedChannel });
      } catch (error) {
        console.error("channel:addMember error:", error);
        callback?.({ success: false, error: error.message });
      }
    });

    // ==================== MESSAGE EVENTS ====================

    socket.on("messages:get", async (data, callback) => {
      try {
        const { channelId, limit = 50, skip = 0 } = data;

        const channel = await Channel.findById(channelId);
        if (!channel)
          return callback?.({ success: false, error: "Channel not found" });

        const isMember = channel.members.some(
          (memberId) => memberId.toString() === socket.user._id.toString(),
        );

        const canAccess =
          socket.user.role === "CEO" ||
          socket.user.role === "TL" ||
          socket.user.role === "PM" ||
          isMember;

        if (!canAccess) {
          return callback?.({
            success: false,
            error: "You do not have access to this channel",
          });
        }

        const messages = await Message.find({ channelId })
          .populate("userId", "firstName lastName email role profileImage")
          .sort({ createdAt: -1 })
          .limit(limit)
          .skip(skip);

        callback?.({ success: true, messages: messages.reverse() });
      } catch (error) {
        console.error("messages:get error:", error);
        callback?.({ success: false, error: error.message });
      }
    });

    socket.on("message:send", async (data, callback) => {
      try {
        const { channelId, text, attachments } = data;

        if (!text || !text.trim()) {
          return callback?.({
            success: false,
            error: "Message cannot be empty",
          });
        }

        const channel = await Channel.findById(channelId);
        if (!channel)
          return callback?.({ success: false, error: "Channel not found" });

        let canSend = false;

        if (socket.user.role === "CEO") {
          canSend = true;
        } else if (socket.user.role === "TL" || socket.user.role === "PM") {
          canSend = true;
        } else {
          const isMember = channel.members.some(
            (memberId) => memberId.toString() === socket.user._id.toString(),
          );
          canSend = isMember && channel.type !== "notice";
        }

        if (!canSend) {
          return callback?.({
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
          "firstName lastName email role profileImage",
        );

        io.to(`channel:${channelId}`).emit("message:new", populatedMessage);

        callback?.({ success: true, message: populatedMessage });
      } catch (error) {
        console.error("message:send error:", error);
        callback?.({ success: false, error: error.message });
      }
    });

    socket.on("message:edit", async (data, callback) => {
      try {
        const { messageId, text } = data;

        const message = await Message.findById(messageId);
        if (!message)
          return callback?.({ success: false, error: "Message not found" });

        if (message.userId.toString() !== socket.user._id.toString()) {
          return callback?.({
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
          "firstName lastName email role profileImage",
        );

        io.to(`channel:${message.channelId}`).emit(
          "message:edited",
          updatedMessage,
        );

        callback?.({ success: true, message: updatedMessage });
      } catch (error) {
        console.error("message:edit error:", error);
        callback?.({ success: false, error: error.message });
      }
    });

    socket.on("message:delete", async (data, callback) => {
      try {
        const { messageId } = data;

        const message = await Message.findById(messageId);
        if (!message)
          return callback?.({ success: false, error: "Message not found" });

        const canDelete =
          message.userId.toString() === socket.user._id.toString() ||
          ["CEO", "TL", "PM"].includes(socket.user.role);

        if (!canDelete) {
          return callback?.({
            success: false,
            error: "You do not have permission to delete this message",
          });
        }

        const channelId = message.channelId;
        await Message.findByIdAndDelete(messageId);

        io.to(`channel:${channelId}`).emit("message:deleted", { messageId });

        callback?.({ success: true, messageId });
      } catch (error) {
        console.error("message:delete error:", error);
        callback?.({ success: false, error: error.message });
      }
    });

    // ==================== NOTICE EVENTS ====================

    socket.on("notice:send", async (data, callback) => {
      try {
        if (socket.user.role !== "CEO") {
          return callback?.({
            success: false,
            error: "Only CEO can send notices",
          });
        }

        const { channelId, text } = data;

        if (!text || !text.trim()) {
          return callback?.({
            success: false,
            error: "Notice cannot be empty",
          });
        }

        const channel = await Channel.findById(channelId);
        if (!channel || channel.type !== "notice") {
          return callback?.({
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
          "firstName lastName email role profileImage",
        );

        io.emit("notice:new", populatedMessage);

        callback?.({ success: true, message: populatedMessage });
      } catch (error) {
        console.error("notice:send error:", error);
        callback?.({ success: false, error: error.message });
      }
    });

    // ==================== PRIVATE CHAT EVENTS ====================

    socket.on("employees:get", async (callback) => {
      try {
        if (socket.user.role !== "CEO") {
          return callback?.({
            success: false,
            error: "Only CEO can access employee list",
          });
        }

        const employees = await User.find({
          role: { $ne: "CEO" },
          status: "Active",
        }).select("firstName lastName email role profileImage");

        callback?.({ success: true, employees });
      } catch (error) {
        console.error("employees:get error:", error);
        callback?.({ success: false, error: error.message });
      }
    });

    socket.on("private:send", async (data, callback) => {
      try {
        if (socket.user.role !== "CEO") {
          return callback?.({
            success: false,
            error: "Only CEO can send private messages",
          });
        }

        const { recipientId, text } = data;

        if (!text || !text.trim()) {
          return callback?.({
            success: false,
            error: "Message cannot be empty",
          });
        }

        let channel = await Channel.findOne({
          type: "private",
          members: { $all: [socket.user._id, recipientId] },
        });

        if (!channel) {
          const recipient = await User.findById(recipientId);
          if (!recipient) {
            return callback?.({ success: false, error: "Recipient not found" });
          }

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
          "firstName lastName email role profileImage",
        );

        io.to(`channel:${channel._id}`).emit("private:message", {
          channelId: channel._id,
          message: populatedMessage,
        });

        callback?.({
          success: true,
          message: populatedMessage,
          channelId: channel._id,
        });
      } catch (error) {
        console.error("private:send error:", error);
        callback?.({ success: false, error: error.message });
      }
    });

    socket.on("private:create", async ({ recipientId }, callback) => {
      try {
        const ALLOWED_ROLES = ["CEO", "TL", "ATL", "PM"];

        if (!ALLOWED_ROLES.includes(socket.user.role)) {
          return callback?.({
            success: false,
            error: "You are not allowed to start private chats",
          });
        }

        let channel = await Channel.findOne({
          type: "private",
          members: { $all: [socket.user._id, recipientId] },
        })
          .populate("members", "firstName lastName role email profileImage")
          .populate("createdBy", "firstName lastName role");

        if (!channel) {
          const recipient = await User.findById(recipientId);
          if (!recipient) {
            return callback?.({ success: false, error: "Recipient not found" });
          }

          channel = await Channel.create({
            name: `Private: ${socket.user.firstName} ↔ ${recipient.firstName}`,
            type: "private",
            createdBy: socket.user._id,
            members: [socket.user._id, recipientId],
          });

          channel = await Channel.findById(channel._id)
            .populate("members", "firstName lastName role email profileImage")
            .populate("createdBy", "firstName lastName role");
        }

        socket.join(`channel:${channel._id}`);

        const recipientSockets = await io
          .in(`user:${recipientId}`)
          .fetchSockets();
        recipientSockets.forEach((s) => s.join(`channel:${channel._id}`));

        io.to(`user:${socket.user._id}`).emit("channel:new", channel);
        io.to(`user:${recipientId}`).emit("channel:new", channel);

        callback?.({ success: true, channel });
      } catch (err) {
        console.error("private:create error:", err);
        callback?.({ success: false, error: err.message });
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

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.user.email}`);
    });
  });

  return io;
};

export default initializeSocket;