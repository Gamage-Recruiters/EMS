import express from 'express';
import { createTask } from '../controllers/taskController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Only PM / TL should access
router.post('/create', protect, createTask);

export default router;