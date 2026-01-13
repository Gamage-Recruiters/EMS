import api from "./api";

/* =================================================
   DAILY TASKS (DEVELOPER)
================================================= */

/**
 * Create daily task (Developer)
 */
export const createDailyTask = (taskData) => api.post("/daily-tasks", taskData);

/**
 * Get daily tasks created by logged-in developer
 */
export const getMyDailyTasks = () => api.get("/daily-tasks/my");

/**
 * Delete daily task (Owner only)
 */
export const deleteDailyTask = (taskId) => api.delete(`/daily-tasks/${taskId}`);

/* =================================================
   DAILY TASKS (PM / TL / CEO)
================================================= */

/**
 * Get all daily tasks (PM / TL / CEO)
 */
export const getAllDailyTasks = () => api.get("/daily-tasks");

/**
 * Update PM check (PM / CEO)
 */
export const updatePMCheck = (taskId, pmCheck) =>
  api.put(`/daily-tasks/${taskId}/pm-check`, { pmCheck });

/**
 * Update TL check (TL / CEO)
 */
export const updateTLCheck = (taskId, teamLeadCheck) =>
  api.put(`/daily-tasks/${taskId}/tl-check`, { teamLeadCheck });
