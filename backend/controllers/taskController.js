// Controller to handle task creation
import Task from '../models/Task.js';

export const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      assignedTo,
      dueDate,
      priority,
    } = req.body;

    // assignedBy comes from logged in user
    const assignedBy = req.user.id;

    const task = await Task.create({
      title,
      description,
      assignedBy,
      assignedTo,
      dueDate,
      priority,
    });

    return res.status(201).json({
      success: true,
      message: "Task assigned successfully",
      data: task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to assign task",
      error: error.message,
    });
  }
};

// Controller to handle fetching tasks assigned to a user
export const getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user.id })
      .select("_id title status")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    console.error("Get my tasks error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch tasks",
    });
  }
};