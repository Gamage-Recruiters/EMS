import api from "../api/api.js";

export const teamService = {
  // Teams list
  list: () => api.get("/team"),
  // Create team
  create: (payload) => api.post("/team", payload),
  // Get by id
  get: (id) => api.get(`/team/${id}`),
  // Get by name
  getByName: (name) => api.get(`/team/name/${encodeURIComponent(name)}`),
  // Update team
  update: (id, payload) => api.put(`/team/${id}`, payload),
  // Add member
  addMember: (id, memberId) => api.put(`/team/${id}/add-member`, { memberId }),
  // Delete team
  remove: (id) => api.delete(`/team/${id}`),
};
