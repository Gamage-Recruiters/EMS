import express from "express";
import { createMeeting } from "../controllers/meetingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ================= MEETING ROUTES =================

// Create meeting
router.post("/", protect, createMeeting);

export default router;
