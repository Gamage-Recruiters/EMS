import express from 'express';
import { createTask, getMyTasks } from '../controllers/taskController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Only TL/ATL should access
router.post('/create', protect, createTask);
router.get("/my", protect, getMyTasks);

export default router;