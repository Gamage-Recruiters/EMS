import DailyTask from "../models/DailyTask.js";

/**
 * CREATE DAILY TASK
 * Creates a new daily task submission by a developer for tracking daily work.
 * Accessible by: Developer only
 * @param {string} task - Task description or name (required)
 * @param {string} project - Project ID (required)
 * @param {string} status - Task status (optional, defaults to "Not Started")
 * @param {time} startTime - When work started
 * @param {time} endTime - When work ended
 * @param {number} workingHours - Total hours worked
 * @param {string} facedIssues - Any issues encountered
 * @param {string} learnings - Key learnings from the task
 */
export const createDailyTask = async (req, res) => {
  try {
    const {
      task,
      project,
      status,
      startTime,
      endTime,
      workingHours,
      facedIssues,
      learnings,
    } = req.body;

    // ================= BASIC VALIDATION =================
    if (!task || !project) {
      return res.status(400).json({
        success: false,
        message: "Task and project are required",
      });
    }

    // ================= CREATE TASK =================
    const dailyTask = await DailyTask.create({
      task,
      project,
      developer: req.user.id, // logged-in developer
      status: status || "Not Started",
      startTime,
      endTime,
      workingHours,
      facedIssues,
      learnings,
      // date is auto-saved in model
      // pmCheck & teamLeadCheck default to Pending
    });

    res.status(201).json({
      success: true,
      message: "Daily task submitted successfully",
      data: dailyTask,
    });
  } catch (error) {
    console.error("Create daily task error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit daily task",
    });
  }
};

/**
 * GET MY DAILY TASKS
 * Retrieves all daily tasks submitted by the currently logged-in developer.
 * Accessible by: All authenticated users (typically used by Developer to view their submissions)
 * Returns: Complete daily task details with developer information
 */
export const getMyDailyTasks = async (req, res) => {
  try {
    const tasks = await DailyTask.find({ developer: req.user.id })
      .populate("developer", "firstName lastName email role profileImage")
      .sort({ date: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    console.error("Get my daily tasks error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve your daily tasks",
    });
  }
};

/**
 * GET ALL DAILY TASKS
 * Retrieves all daily tasks submitted by all developers (for review and approval).
 * Accessible by: PM (Project Manager), TL (Team Lead), CEO only
 * Returns: All daily tasks with developer information
 */
export const getAllDailyTasks = async (req, res) => {
  try {
    // Only PM, TL, CEO allowed
    if (!["PM", "TL", "CEO"].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const tasks = await DailyTask.find()
      .populate("developer", "firstName lastName email role profileImage")
      .sort({ date: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    console.error("Get all daily tasks error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve daily tasks",
    });
  }
};

/**
 * UPDATE PM CHECK
 * Project Manager or CEO reviews and approves/rejects PM check on a daily task.
 * Accessible by: PM (Project Manager), CEO only
 * @param {string} pmCheck - PM's approval status/feedback
 */
export const updatePMCheck = async (req, res) => {
  try {
    if (!["PM", "CEO"].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Only PM can update PM check",
      });
    }

    const { pmCheck } = req.body;

    const task = await DailyTask.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Daily task not found",
      });
    }

    task.pmCheck = pmCheck;
    await task.save();

    res.status(200).json({
      success: true,
      message: "PM check updated successfully",
      data: task,
    });
  } catch (error) {
    console.error("Update PM check error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update PM check",
    });
  }
};

/**
 * UPDATE TEAM LEAD CHECK
 * Team Lead or CEO reviews and approves/rejects the daily task submission.
 * Accessible by: TL (Team Lead), CEO only
 * @param {string} teamLeadCheck - Team Lead's approval status/feedback
 */
export const updateTLCheck = async (req, res) => {
  try {
    if (!["TL", "CEO"].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Only Team Lead can update TL check",
      });
    }

    const { teamLeadCheck } = req.body;

    const task = await DailyTask.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Daily task not found",
      });
    }

    task.teamLeadCheck = teamLeadCheck;
    await task.save();

    res.status(200).json({
      success: true,
      message: "Team Lead check updated successfully",
      data: task,
    });
  } catch (error) {
    console.error("Update TL check error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update TL check",
    });
  }
};

/**
 * DELETE DAILY TASK
 * Deletes a daily task. Only the developer who submitted the task can delete it.
 * Accessible by: Developer (only owns their own tasks)
 * @param {string} id - Daily task ID to delete
 */
export const deleteDailyTask = async (req, res) => {
  try {
    const task = await DailyTask.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Daily task not found",
      });
    }

    // Only the developer who created it can delete
    if (task.developer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this task",
      });
    }

    await DailyTask.deleteOne({ _id: req.params.id });

    return res.status(200).json({
      success: true,
      message: "Daily task deleted successfully",
    });
  } catch (error) {
    console.error("Delete daily task error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete daily task",
    });
  }
};
