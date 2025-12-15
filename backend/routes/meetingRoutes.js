import express from "express";
import {
  createMeeting,
  getUsersForParticipants,
} from "../controllers/meetingController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ================= MEETING ROUTES =================

// Create meeting
router.post("/", protect, createMeeting);
router.get("/participants", protect, getUsersForParticipants);

export default router;
