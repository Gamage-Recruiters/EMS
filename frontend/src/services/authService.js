import api from "../api/api";

export const loginUser = (data) => api.post("/auth/login", data);