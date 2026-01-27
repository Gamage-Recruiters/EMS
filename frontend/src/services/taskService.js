import api from "../api/api.js";

export const taskService = {
  // Create a task
  create: (payload) => api.post("/tasks/create", payload),

  // Get tasks assigned to logged-in user
  myTasks: () => api.get("/tasks/my"),

  // Update task status 
  updateStatus: (id, status) =>
    api.patch(`/tasks/${id}/status`, { status }),

  // Get all tasks for Kanban board
  allTasks: () => api.get("/tasks"),

};