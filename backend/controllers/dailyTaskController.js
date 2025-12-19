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
