import express from "express";
import {
  createDailyTask,
  getMyDailyTasks,
  getAllDailyTasks,
  updatePMCheck,
  updateTLCheck,
} from "../controllers/dailyTaskController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Developer submits daily task
router.post("/", protect, createDailyTask);
// Developer gets their task list (full details)
router.get("/my", protect, getMyDailyTasks);

// PM / TL / CEO
router.get("/", protect, getAllDailyTasks);
router.put("/:id/pm-check", protect, updatePMCheck);
router.put("/:id/tl-check", protect, updateTLCheck);

export default router;
