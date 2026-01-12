// Controller to handle task creation
import Task from '../models/Task.js';

export const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      assignedTo,
      startDate,
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
      startDate,
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

// Controller to fetch all tasks 
export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .select("_id title status assignedTo priority")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch all tasks",
    });
  }
};

// Controller to update task status
export const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;

    //Find task first
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    //Authorization check
    if (task.assignedTo.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You can only update tasks assigned to you",
      });
    }

    //Update status
    task.status = status;
    await task.save();

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
