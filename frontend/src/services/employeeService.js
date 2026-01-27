import api from "../api/api.js";

export const employeeService = {

  // Get all employees (admin endpoint)
  // Backend returns: { count, employees }
  list: (params) => api.get("/admin/employees", { params }),

  // Get single employee by ID (admin endpoint)
  // Backend returns: { user }
  get: (id) => api.get(`/admin/employee/${id}`),

  // Create new employee/user (admin endpoint)
  // Backend returns: { message, user }
  create: (payload) => api.post("/admin/add-user", payload),

  // Update employee (admin endpoint)
  // NOTE: backend route is still named /developer/:userId but it updates any user now
  update: (id, payload) => api.put(`/admin/developer/${id}`, payload),

  // Delete employee (admin endpoint)
  remove: (id) => api.delete(`/admin/developer/${id}`),

  // Search employees by name (admin endpoint)
  // NOTE: backend route is /employees/search and expects query param "name"
  searchByName: (name) => api.get("/admin/employees/search", { params: { name } }),

  // User endpoints
  getCurrentUser: () => api.get("/user/me"),
  getAllUsers: (params) => api.get("/user", { params }),
  getUserById: (id) => api.get(`/user/${id}`),
  updateProfile: (payload) => api.put("/user/me", payload),
  deleteProfile: () => api.delete("/user/me"),

  // Public endpoints
  //forgotPassword: (email) => api.post("/forgot-password", { email }),
};
