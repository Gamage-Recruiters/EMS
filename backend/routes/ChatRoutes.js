// routes/chatRoutes.js
import express from "express";
import {
  getChannels,
  createChannel,
  getChannelById,
  addMemberToChannel,
  removeMemberFromChannel,
  deleteChannel,
  getMessages,
  sendMessage,
  editMessage,
  deleteMessage,
  sendNotice,
  getEmployees,
  sendPrivateMessage,
  searchMessages,
  getPrivateChannels,
  updateChannel,
} from "../controllers/chatController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ==================== CHANNEL ROUTES ====================

// GET /api/chat/channels
router.get("/channels", protect, getChannels);

// POST /api/chat/channels
router.post("/channels", protect, createChannel);
router.put("/channels/:channelId", protect, updateChannel);

// GET /api/chat/channels/:channelId
router.get("/channels/:channelId", protect, getChannelById);

// PUT /api/chat/channels/:channelId/members
router.put("/channels/:channelId/members", protect, addMemberToChannel);

// DELETE /api/chat/channels/:channelId/members/:userId
router.delete(
  "/channels/:channelId/members/:userId",
  protect,
  removeMemberFromChannel
);

// DELETE /api/chat/channels/:channelId
router.delete("/channels/:channelId", protect, deleteChannel);

// ==================== MESSAGE ROUTES ====================

// GET /api/chat/channels/:channelId/messages
router.get("/channels/:channelId/messages", protect, getMessages);

// POST /api/chat/channels/:channelId/messages
router.post("/channels/:channelId/messages", protect, sendMessage);

// PUT /api/chat/messages/:messageId
router.put("/messages/:messageId", protect, editMessage);

// DELETE /api/chat/messages/:messageI
router.delete("/messages/:messageId", protect, deleteMessage);

// ==================== NOTICE ROUTES (CEO) ====================

// POST /api/chat/notices
router.post("/notices", protect, sendNotice);

// ==================== PRIVATE CHAT ROUTES (CEO) ====================

// GET /api/chat/employees
router.get("/employees", protect, getEmployees);

// POST /api/chat/private
router.post("/private", protect, sendPrivateMessage);

// GET /api/chat/private/channels
router.get("/private/channels", protect, getPrivateChannels);

// ==================== SEARCH ROUTES ====================

// GET /api/chat/search
router.get("/search", protect, searchMessages);

export default router;
