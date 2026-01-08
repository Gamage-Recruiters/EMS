import api from "./api";

export const employeeService = {
  // Get all employees (admin endpoint)
  list: (params) => api.get("/admin/employees", { params }),

  // Get single employee by ID (admin endpoint)
  get: (id) => api.get(`/admin/employee/${id}`),

  // Create new employee/user (admin endpoint)
  create: (payload) => api.post("/admin/add-user", payload),

  // Update employee profile (admin endpoint)
  update: (id, payload) => api.put(`/admin/developer/${id}`, payload),

  // Delete employee (admin endpoint)
  remove: (id) => api.delete(`/admin/developer/${id}`),

  // Search employees by name
  searchByName: (name) => api.get("/admin/employees", { params: { name } }),

  // Current user endpoints
  getCurrentUser: () => api.get("/user/me"),
  updateProfile: (payload) => api.put("/user/me", payload),
  deleteProfile: () => api.delete("/user/me"),
};
