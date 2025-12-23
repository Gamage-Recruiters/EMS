import express from "express";
import {
  forgotPassword,
  getCurrentUser,
  getAllUsers,
  getUserById,
  updateUserProfile,
} from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";


const router = express.Router();

// Public route
router.post("/forgot-password", forgotPassword);

// PRIVATE (need token)
router.get("/me", protect, getCurrentUser);
router.put("/me", protect, updateUserProfile);
router.get("/", protect, getAllUsers);
router.get("/:id", protect, getUserById);


export default router;