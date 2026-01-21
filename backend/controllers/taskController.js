// Controller to handle task creation
import Task from '../models/Task.js';
import Project from '../models/Project.js';

export const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      project,
      assignedTo,
      startDate,
      dueDate,
      priority,
    } = req.body;

    // Validation
    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Task title is required",
      });
    }

    if (!assignedTo) {
      return res.status(400).json({
        success: false,
        message: "Assigned user is required",
      });
    }

    if (!startDate) {
      return res.status(400).json({
        success: false,
        message: "Start date is required",
      });
    }

    // assignedBy comes from logged in user
    const assignedBy = req.user.id;

    // Create task object
    const taskData = {
      title,
      description,
      assignedBy,
      assignedTo,
      startDate,
      dueDate: dueDate || startDate, // Use startDate if dueDate not provided
      priority: priority || "MEDIUM",
    };

    // Only add project if it's provided and not null
    if (project) {
      taskData.project = project;
    }

    const task = await Task.create(taskData);

    // Populate the created task to match frontend expectations
    const populatedTask = await Task.findById(task._id)
      .populate("assignedTo", "name email")
      .populate("project", "name");

    return res.status(201).json({
      success: true,
      message: "Task assigned successfully",
      data: populatedTask,
    });
  } catch (error) {
    console.error("Create task error:", error);
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
      .select("_id title status description priority startDate dueDate")
      .populate("project", "name")
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

// Controller to fetch all tasks (for Kanban board)
export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("assignedTo", "name email")
      .populate("project", "name")
      .populate("assignedBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    console.error("Get all tasks error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch all tasks",
      error: error.message,
    });
  }
};

// Controller to update task status
export const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const taskId = req.params.id;

    // Validate status
    const validStatuses = ["To Do", "In Progress", "Done"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be: To Do, In Progress, or Done",
      });
    }

    // Update task status using findByIdAndUpdate to avoid full validation
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { status: status },
      { 
        new: true, // Return the updated document
        runValidators: false // Skip validation for other fields
      }
    )
      .populate("assignedTo", "firstName lastName email")
      .populate("project", "name");

    if (!updatedTask) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task status updated successfully",
      data: updatedTask,
    });
  } catch (error) {
    console.error("Update task status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update task status",
      error: error.message,
    });
  }
};

// Controller to update task details (for edit functionality) TL/ATL
export const updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const {
      title,
      description,
      project,
      assignedTo,
      startDate,
      dueDate,
      priority,
      status,
    } = req.body;

    // Check if user is TL or ATL
    const userRole = req.user.role;
    if (userRole !== 'TL' && userRole !== 'ATL') {
      return res.status(403).json({
        success: false,
        message: "Only Team Lead (TL) and Assistant Team Lead (ATL) can edit tasks",
      });
    }

    // Find task
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Validation
    if (title !== undefined && !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Task title cannot be empty",
      });
    }

    // Update fields
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (project !== undefined) task.project = project || null;
    if (assignedTo !== undefined) task.assignedTo = assignedTo;
    if (startDate !== undefined) task.startDate = startDate;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (priority !== undefined) task.priority = priority;
    if (status !== undefined) task.status = status;

    await task.save();

    // Populate and return updated task
    const updatedTask = await Task.findById(taskId)
      .populate("assignedTo", "name email")
      .populate("project", "name")
      .populate("assignedBy", "name email");

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: updatedTask,
    });
  } catch (error) {
    console.error("Update task error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update task",
      error: error.message,
    });
  }
};

// Controller to delete task (only TL and ATL)
export const deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;

    // Check if user is TL or ATL
    const userRole = req.user.role;
    if (userRole !== 'TL' && userRole !== 'ATL') {
      return res.status(403).json({
        success: false,
        message: "Only Team Lead (TL) and Assistant Team Lead (ATL) can delete tasks",
      });
    }

    // Find and delete task
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    await Task.findByIdAndDelete(taskId);

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
      data: { id: taskId },
    });
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete task",
      error: error.message,
    });
  }
};