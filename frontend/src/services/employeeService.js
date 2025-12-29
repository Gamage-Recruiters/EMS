import api from "./api";

export const employeeService = {
  list: (params) => api.get("/employees", { params }),
  get: (id) => api.get(`/employees/${id}`),
  create: (payload) => api.post("/employees", payload),
  update: (id, payload) => api.put(`/employees/${id}`, payload),
  remove: (id) => api.delete(`/employees/${id}`),

  updateRole: (id, role) => api.patch(`/employees/${id}/role`, { role }),
  assignTeam: (id, team) => api.patch(`/employees/${id}/team`, { team }),
};
