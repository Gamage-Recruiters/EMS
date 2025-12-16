import express from "express";
import {
  createMeeting,
  getUsersForParticipants,
  getAllMeetings,
  cancelMeeting,
} from "../controllers/meetingController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ================= MEETING ROUTES =================

// Create meeting
router.post("/", protect, createMeeting);
router.get("/participants", protect, getUsersForParticipants);
// Get all meetings with participants
router.get("/", protect, getAllMeetings);
router.delete("/:id", protect, cancelMeeting);
export default router;
