/**
 * TASK SERVICE
 * Provides API calls for task management operations.
 * Handles communication between frontend and backend task endpoints.
 */
import api from "../api/api.js";

export const taskService = {
  /**
   * CREATE TASK
   * Sends a POST request to create a new task
   * Accessible by: TL, ATL, PM
   * @param {Object} payload - Task data (title, assignedTo, startDate, dueDate, description, project, priority)
   */
  create: (payload) => api.post("/tasks/create", payload),

  /**
   * GET MY TASKS
   * Fetches all tasks assigned to the logged-in user
   * Accessible by: All authenticated users
   */
  myTasks: () => api.get("/tasks/my"),

  /**
   * UPDATE TASK STATUS
   * Updates the status of a task (To Do, In Progress, Done)
   * Accessible by: Developers (own tasks), TL, ATL, PM (any task)
   * @param {string} id - Task ID
   * @param {string} status - New status value
   */
  updateStatus: (id, status) =>
    api.patch(`/tasks/${id}/status`, { status }),

  /**
   * GET ALL TASKS
   * Retrieves all tasks in the system for Kanban board display
   * Accessible by: All authenticated users
   */
  allTasks: () => api.get("/tasks"),

  /**
   * GET ALL USERS
   * Fetches all users for task assignment dropdown
   * Accessible by: All authenticated users
   */
  getAllUsers: () => api.get("/tasks/users"),

  /**
   * GET ALL PROJECTS
   * Fetches all projects for task assignment dropdown
   * Accessible by: All authenticated users
   */
  getAllProjects: () => api.get("/tasks/projects"),

  /**
   * UPDATE TASK DETAILS
   * Updates complete task information (title, description, assignment, dates, priority, status)
   * Accessible by: TL, ATL only
   * @param {string} id - Task ID
   * @param {Object} payload - Updated task data
   */
  updateTask: (id, payload) => 
    api.put(`/tasks/${id}`, payload),

  /**
   * DELETE TASK
   * Deletes a task from the system
   * Accessible by: TL, ATL only
   * @param {string} id - Task ID to delete
   */
  deleteTask: (id) => 
    api.delete(`/tasks/${id}`),

};