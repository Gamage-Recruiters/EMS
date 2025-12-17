import express from "express";
import { createDailyTask } from "../controllers/dailyTaskController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Developer submits daily task
router.post("/", protect, createDailyTask);

export default router;
