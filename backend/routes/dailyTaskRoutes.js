/**
 * DAILY TASK ROUTES
 * Routes for managing daily tasks in the dailyTaskController file.
 */
import express from "express";
import {
  createDailyTask,
  getMyDailyTasks,
  getAllDailyTasks,
  updatePMCheck,
  updateTLCheck,
  deleteDailyTask,
} from "../controllers/dailyTaskController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ===================== DEVELOPER SUBMISSION ROUTES =====================

/**
 * POST /daily-tasks/
 * Create a new daily task submission for tracking daily work
 * Accessible by: Developer only
 * Required fields: task, project
 */
router.post("/", protect, createDailyTask);

/**
 * GET /daily-tasks/my
 * Retrieve all daily tasks submitted by the currently logged-in developer
 * Accessible by: All authenticated users (typically used by Developer)
 */
router.get("/my", protect, getMyDailyTasks);

/**
 * DELETE /daily-tasks/:id
 * Delete a daily task (only by the developer who submitted it)
 * Accessible by: Developer (only own tasks)
 */
router.delete("/:id", protect, deleteDailyTask);

// ===================== APPROVAL & REVIEW ROUTES =====================

/**
 * GET /daily-tasks/
 * Retrieve all daily tasks submitted by all developers (for review and approval)
 * Accessible by: PM (Project Manager), TL (Team Lead), CEO only
 */
router.get("/", protect, getAllDailyTasks);

/**
 * PUT /daily-tasks/:id/pm-check
 * Update PM check/approval status on a daily task
 * Accessible by: PM (Project Manager), CEO only
 * Required field: pmCheck
 */
router.put("/:id/pm-check", protect, updatePMCheck);

/**
 * PUT /daily-tasks/:id/tl-check
 * Update Team Lead check/approval status on a daily task
 * Accessible by: TL (Team Lead), CEO only
 * Required field: teamLeadCheck
 */
router.put("/:id/tl-check", protect, updateTLCheck);

export default router;
