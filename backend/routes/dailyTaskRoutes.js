import express from "express";
import {
  createDailyTask,
  getMyDailyTasks,
} from "../controllers/dailyTaskController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Developer submits daily task
router.post("/", protect, createDailyTask);
// Developer gets their task list (full details)
router.get("/my", protect, getMyDailyTasks);

export default router;
