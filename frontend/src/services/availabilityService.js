import api from "../api/axios";

/**
 * Set user availability status
 * @param {string} status - 'AVAILABLE' or 'UNAVAILABLE'
 * @param {string} reason - Optional reason for unavailability
 */
export const setAvailability = async (status, reason = "") => {
  try {
    const response = await api.post("/availability", { status, reason });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to update availability";
  }
};

/**
 * Get current user's availability status
 */
export const getMyAvailability = async () => {
  try {
    const response = await api.get("/availability/me");
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch availability";
  }
};

/**
 * Get team availability (for managers/leaders)
 */
export const getTeamAvailability = async () => {
  try {
    const response = await api.get("/availability/team");
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch team availability";
  }
};
