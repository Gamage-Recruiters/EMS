import api from "./api";

export const taskService = {
  // Create a task
  create: (payload) => api.post("/tasks/create", payload),

  // Get tasks assigned to logged-in user
  myTasks: () => api.get("/tasks/my"),

  // Update task status (drag & drop)
  updateStatus: (id, status) =>
    api.patch(`/tasks/${id}/status`, { status }),
};