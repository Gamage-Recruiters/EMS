import express from "express";
import User from "../models/User.js";
import { verifyToken } from "../middleware/auth.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Multer configuration
const uploadDir = path.join(__dirname, "../uploads/profile-pictures");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user.userId}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files allowed"));
    }
  },
});

// Get user profile
router.get("/", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Get Profile Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch profile", error: error.message });
  }
});

// Update personal details
router.put("/personal", verifyToken, async (req, res) => {
  try {
    const { firstName, lastName, phone, email } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { firstName, lastName, phone, email },
      { new: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Personal details updated",
      user,
    });
  } catch (error) {
    console.error("Update Personal Error:", error);
    res.status(500).json({
      success: false,
      message: "Update failed",
      error: error.message,
    });
  }
});

// Update contact details
router.put("/contact", verifyToken, async (req, res) => {
  try {
    const { phone, address, city, state, country, zipCode } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { phone, address, city, state, country, zipCode },
      { new: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Contact details updated",
      user,
    });
  } catch (error) {
    console.error("Update Contact Error:", error);
    res.status(500).json({
      success: false,
      message: "Update failed",
      error: error.message,
    });
  }
});

// Update education
router.put("/education", verifyToken, async (req, res) => {
  try {
    const { education } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { education },
      { new: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Education updated",
      user,
    });
  } catch (error) {
    console.error("Update Education Error:", error);
    res.status(500).json({
      success: false,
      message: "Update failed",
      error: error.message,
    });
  }
});

// Update job details
router.put("/job-details", verifyToken, async (req, res) => {
  try {
    const { joinDate, designation, department } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { jobDetails: { joinDate, designation, department } },
      { new: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Job details updated",
      user,
    });
  } catch (error) {
    console.error("Update Job Details Error:", error);
    res.status(500).json({
      success: false,
      message: "Update failed",
      error: error.message,
    });
  }
});

// Upload profile picture
router.post("/upload-picture", verifyToken, upload.single("profilePicture"), async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { profilePicture: `/uploads/profile-pictures/${req.file.filename}` },
      { new: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile picture updated",
      user,
    });
  } catch (error) {
    console.error("Upload Picture Error:", error);
    res.status(500).json({
      success: false,
      message: "Upload failed",
      error: error.message,
    });
  }
});

export default router;
