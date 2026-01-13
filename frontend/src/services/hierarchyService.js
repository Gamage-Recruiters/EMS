import api from "./api";

export const hierarchyService = {
  getTree: () => api.get("/hierarchy"),
};
