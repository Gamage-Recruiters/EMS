/**
 * DAILY TASK SERVICE
 * Provides API calls for daily task management operations.
 * Handles communication between frontend and backend daily task endpoints.
 */
import api from "../api/api.js";

// ===================== DEVELOPER SUBMISSION SERVICES =====================

/**
 * CREATE DAILY TASK
 * Sends a POST request to submit a new daily task
 * Accessible by: Developer only
 * @param {Object} taskData - Daily task data (task, project, status, startTime, endTime, workingHours, facedIssues, learnings)
 */
export const createDailyTask = (taskData) => api.post("/daily-tasks", taskData);

/**
 * GET MY DAILY TASKS
 * Fetches all daily tasks submitted by the logged-in developer
 * Accessible by: All authenticated users (typically used by Developer)
 */
export const getMyDailyTasks = () => api.get("/daily-tasks/my");

/**
 * DELETE DAILY TASK
 * Sends a DELETE request to remove a daily task
 * Accessible by: Developer (only own tasks)
 * @param {string} taskId - Daily task ID to delete
 */
export const deleteDailyTask = (taskId) => api.delete(`/daily-tasks/${taskId}`);

// ===================== APPROVAL & REVIEW SERVICES =====================

/**
 * GET ALL DAILY TASKS
 * Retrieves all daily tasks submitted by all developers (for review and approval)
 * Accessible by: PM (Project Manager), TL (Team Lead), CEO only
 */
export const getAllDailyTasks = () => api.get("/daily-tasks");

/**
 * UPDATE PM CHECK
 * Sends a PUT request to update Project Manager's review/approval status
 * Accessible by: PM (Project Manager), CEO only
 * @param {string} taskId - Daily task ID
 * @param {string} pmCheck - PM's approval status/feedback
 */
export const updatePMCheck = (taskId, pmCheck) =>
  api.put(`/daily-tasks/${taskId}/pm-check`, { pmCheck });

/**
 * UPDATE TEAM LEAD CHECK
 * Sends a PUT request to update Team Lead's review/approval status
 * Accessible by: TL (Team Lead), CEO only
 * @param {string} taskId - Daily task ID
 * @param {string} teamLeadCheck - Team Lead's approval status/feedback
 */
export const updateTLCheck = (taskId, teamLeadCheck) =>
  api.put(`/daily-tasks/${taskId}/tl-check`, { teamLeadCheck });
