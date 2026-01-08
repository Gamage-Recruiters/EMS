import express from "express";
import {
  addUserByAdmin,
  updateDeveloperByAdmin,
  deleteDeveloperByAdmin,
  getAllEmployees,
  getEmployeeById,
  getEmployeesByName
} from "../controllers/adminController.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All admin routes are protected
router.use(protect);

// Add a user (Developer / PM / etc.)
router.post(
  "/add-user",
  authorize("CEO", "SystemAdmin"),
  addUserByAdmin
);

// Update developer profile
router.put(
  "/developer/:userId",
  authorize("CEO", "SystemAdmin"),
  updateDeveloperByAdmin
);

// Delete developer
router.delete(
  "/developer/:userId",
  authorize("CEO", "SystemAdmin"),
  deleteDeveloperByAdmin
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
