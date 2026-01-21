import express from 'express';
import { 
  createTask, 
  getMyTasks, 
  updateTaskStatus, 
  getAllTasks,
  updateTask,
  deleteTask 
} from '../controllers/taskController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Create task - Only TL/ATL should access (add role check in controller if needed)
router.post('/create', protect, createTask);

// Get tasks assigned to logged-in user
router.get("/my", protect, getMyTasks);

// Get all tasks for Kanban board
router.get("/", protect, getAllTasks);

// Update task status (drag and drop) - Anyone can update status
router.patch("/:id/status", protect, updateTaskStatus);

// Update task details (edit form) - Only TL/ATL (checked in controller)
router.put("/:id", protect, updateTask);

// Delete task - Only TL/ATL (checked in controller)
router.delete("/:id", protect, deleteTask);

export default router;