import api from "../api/api.js";
export const hierarchyService = {
  getTree: () => api.get("/hierarchy"),
};
