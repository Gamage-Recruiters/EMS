import api from "./api";

/* =================================================
   DEVELOPER COMPLAINTS
================================================= */

/**
 * Create a complaint (Developer)
 * Supports image upload
 */
export const createComplaint = (formData) =>
  api.post("/complaints", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

/**
 * Get complaints created by logged-in user
 */
export const getMyComplaints = () => api.get("/complaints/my");

/**
 * Get all developer complaints (PM / TL / CEO)
 */
export const getDeveloperComplaints = () => api.get("/complaints/developers");

/**
 * Update complaint status (PM / TL / CEO)
 */
export const updateComplaintStatus = (id, status) =>
  api.put(`/complaints/${id}/status`, { status });

/* =================================================
   ADMIN COMPLAINTS
================================================= */

/**
 * Create admin complaint (Admin)
 * Supports image upload
 */
export const createAdminComplaint = (formData) =>
  api.post("/complaints/admin", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

/**
 * Get admin complaints (CEO / PM)
 */
export const getAdminComplaints = () => api.get("/complaints/admin");
