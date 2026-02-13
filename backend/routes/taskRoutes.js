/**
 * TASK ROUTES
 * Routes for managing tasks in the taskController file.
 */
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

// ===================== DROPDOWN DATA ROUTES =====================

/**
 * GET /tasks/users
 * Fetch all users for task assignment dropdown
 * Accessible by: All authenticated users
 */
router.get("/users", protect, getAllUsers);

/**
 * GET /tasks/projects
 * Fetch all projects for task assignment dropdown
 * Accessible by: All authenticated users
 */
router.get("/projects", protect, getAllProjects);


// ===================== TASK CREATION ROUTE =====================

/**
 * POST /tasks/create
 * Create a new task and assign it to a user
 * Accessible by: TL (Team Lead), ATL (Assistant Team Lead), PM (Project Manager)
 * Required fields: title, assignedTo, startDate
 */
router.post('/create', protect, createTask);

// ===================== TASK RETRIEVAL ROUTES =====================

/**
 * GET /tasks/my
 * Retrieve all tasks assigned to the currently logged-in user
 * Accessible by: All authenticated users
 */
router.get("/my", protect, getMyTasks);

/**
 * GET /tasks/
 * Fetch all tasks in the system (for Kanban board display)
 * Accessible by: All authenticated users
 */
router.get("/", protect, getAllTasks);

// ===================== TASK UPDATE & DELETE ROUTES =====================

/**
 * PATCH /tasks/:id/status
 * Update the status of a specific task (To Do, In Progress, Done)
 * Accessible by: Developers (only own tasks), TL, ATL, PM (any task)
 * Required field: status
 */
router.patch("/:id/status", protect, updateTaskStatus);

/**
 * PUT /tasks/:id
 * Update complete task details (title, description, assignment, dates, priority, status)
 * Accessible by: TL (Team Lead), ATL (Assistant Team Lead) only
 */
router.put("/:id", protect, updateTask);

/**
 * DELETE /tasks/:id
 * Delete a task from the system
 * Accessible by: TL (Team Lead), ATL (Assistant Team Lead) only
 */
router.delete("/:id", protect, deleteTask);

export default router;