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