import express from "express";
import {
  addUserByAdmin,
  updateUserByAdmin,
  deleteUserByAdmin,
  getAllEmployees,
  getEmployeeById,
  getEmployeesByName
} from "../controllers/adminController.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// All admin routes are protected
router.use(protect);

// Add a user (Developer / PM / etc.)
router.post(
  "/add-user",
  authorize("CEO", "SystemAdmin"),
  upload.single("profileImage"),
  addUserByAdmin
);

// Update developer profile
router.put(
  "/developer/:userId",
  authorize("CEO", "SystemAdmin"),
  upload.single("profileImage"),
  updateUserByAdmin
);

// Delete developer
router.delete(
  "/developer/:userId",
  authorize("CEO", "SystemAdmin"),
  deleteUserByAdmin
);

// Get all employees
router.get(
  "/employees",
  authorize("CEO", "SystemAdmin", "TL"),
  getAllEmployees
);

// Get employee by ID
router.get(
  "/employee/:userId",
  authorize("CEO", "SystemAdmin", "TL"),
  getEmployeeById
);

// Search employees by name
router.get(
  "/employees/search",
  authorize("CEO", "SystemAdmin"),
  getEmployeesByName
);

export default router;
