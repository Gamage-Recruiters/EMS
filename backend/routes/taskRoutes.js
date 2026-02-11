import express from 'express';
import { 
  createTask, 
  getMyTasks, 
  updateTaskStatus, 
  getAllTasks,
  updateTask,
  deleteTask,
  getAllUsers,
  getAllProjects
} from '../controllers/taskController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Specific routes BEFORE dynamic routes
router.get("/users", protect, getAllUsers);
router.get("/projects", protect, getAllProjects);

// Create task
router.post('/create', protect, createTask);

// Get tasks assigned to logged-in user
router.get("/my", protect, getMyTasks);

// Get all tasks for Kanban board
router.get("/", protect, getAllTasks);

// Dynamic routes AFTER specific routes
router.patch("/:id/status", protect, updateTaskStatus);
router.put("/:id", protect, updateTask);
router.delete("/:id", protect, deleteTask);

export default router;