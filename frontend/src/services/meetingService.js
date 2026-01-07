import api from "./api";

/* ================= CREATE ================= */
export const createMeeting = (data) => api.post("/meetings", data);

/* ================= FETCH ================= */
export const getAllMeetings = () => api.get("/meetings");

export const getMyMeetings = () => api.get("/meetings/my");

export const getParticipants = () => api.get("/meetings/participants");

/* ================= UPDATE ================= */
export const rescheduleMeeting = (id, data) => api.put(`/meetings/${id}`, data);

export const cancelMeeting = (id) => api.delete(`/meetings/${id}/cancel`);
