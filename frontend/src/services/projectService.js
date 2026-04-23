import api from "../api/api.js";

export const projectService = {
  // Get all projects
  list: () => api.get("/projects"),

  // Get one project
  get: (id) => api.get(`/projects/${id}`),

  // Create project
  create: (payload) => api.post("/projects", payload),

  // Update project
  update: (id, payload) => api.put(`/projects/${id}`, payload),

  // Delete project
  remove: (id) => api.delete(`/projects/${id}`),
};
