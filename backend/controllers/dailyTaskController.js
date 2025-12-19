import DailyTask from "../models/DailyTask.js";

/**
 * @desc    Create daily task (Developer submission)
 * @route   POST /api/daily-tasks
 * @access  Private (Developer)
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
 * @desc    Get logged-in developer's daily tasks (full details)
 * @route   GET /api/daily-tasks/my
 * @access  Private
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
 * @desc    Get all daily tasks (PM / TL / CEO)
 * @route   GET /api/daily-tasks
 * @access  Private
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
 * @desc    PM updates PM check
 * @route   PUT /api/daily-tasks/:id/pm-check
 * @access  Private (PM / CEO)
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
 * @desc    TL updates team lead check
 * @route   PUT /api/daily-tasks/:id/tl-check
 * @access  Private (TL / CEO)
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
