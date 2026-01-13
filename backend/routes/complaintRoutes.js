import express from "express";
import {
  createComplaint,
  getMyComplaints,
  getDeveloperComplaints,
  updateComplaintStatus,
  createAdminComplaint,
  getAdminComplaints,
} from "../controllers/complaintController.js";
import { protect } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// Developer creates complaint (with image)
router.post("/", protect, upload.single("image"), createComplaint);
// Get my complaints
router.get("/my", protect, getMyComplaints);
// Get all developer complaints (PM / TL / CEO)
router.get("/developers", protect, getDeveloperComplaints);
// PM / TL / CEO update complaint status
router.put("/:id/status", protect, updateComplaintStatus);

// Admin create complaint
router.post("/admin", protect, upload.single("image"), createAdminComplaint);
// CEO / PM view admin complaints (PM, TL, CEO)
router.get("/admin", protect, getAdminComplaints);

export default router;
