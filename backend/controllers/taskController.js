import Task from '../models/Task.js';
import Project from '../models/Project.js';
import User from '../models/User.js';


/**
 * CREATE TASK
 * Creates a new task and assigns it to a user.
 * Accessible by: TL (Team Lead), ATL (Assistant Team Lead), PM (Project Manager)
 * @param {string} title - Task title (required)
 * @param {string} description - Task description
 * @param {string} project - Project ID (optional)
 * @param {string} assignedTo - User ID to assign task to (required)
 * @param {date} startDate - Task start date (required)
 * @param {date} dueDate - Task due date (optional, defaults to startDate)
 * @param {string} priority - Task priority (optional, defaults to MEDIUM)
 */
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
      .populate("assignedTo", "firstName email")
      .populate("project", "projectName");

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

/**
 * GET MY TASKS
 * Retrieves all tasks assigned to the currently logged-in user.
 * Accessible by: All authenticated users (Developer, TL, ATL, PM, CEO, SA)
 * Returns: Tasks sorted by creation date
 */
export const getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user.id })
      .select("_id title status description priority startDate dueDate")
      .populate("assignedTo", "_id firstName lastName email role")
      .populate("assignedBy", "_id firstName lastName")
      .populate("project", "_id projectName")
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

/**
 * GET ALL TASKS
 * Retrieves all tasks in the system (for Kanban board view).
 * Accessible by: All authenticated users
 * Returns: All tasks with assigned user, project, and assigner details
 */
export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("assignedTo", "firstName email")
      .populate("project", "projectName")
      .populate("assignedBy", "firstName email")
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

/**
 * UPDATE TASK STATUS
 * Updates the status of a task (To Do, In Progress, Done).
 * Accessible by: Developers (can only update their own tasks), TL, ATL, PM (can update any)
 * @param {string} status - New task status (To Do, In Progress, Done)
 */
export const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const taskId = req.params.id;

    const validStatuses = ["To Do", "In Progress", "Done"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    const userRole = req.user.role;
    const userId = req.user.id;

    //  ROLE & OWNERSHIP CHECK
    if (userRole === "Developer") {
      if (task.assignedTo.toString() !== userId) {
        return res.status(403).json({
          success: false,
          message: "You can only update status of your own tasks",
        });
      }
    }

    // TL / ATL can update any task
    // Use findByIdAndUpdate to avoid validation errors with partial updates
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { status },
      { new: true, runValidators: true }
    )
      .populate("assignedTo", "firstName email")
      .populate("project", "projectName");

    res.status(200).json({
      success: true,
      message: "Task status updated",
      data: updatedTask,
    });
  } catch (error) {
    console.error("Update status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update status",
    });
  }
};


/**
 * UPDATE TASK DETAILS
 * Updates task information including title, description, assignment, dates, and priority.
 * Accessible by: TL (Team Lead), ATL (Assistant Team Lead) only
 * @param {string} title - Task title
 * @param {string} description - Task description
 * @param {string} project - Project ID
 * @param {string} assignedTo - User ID to assign task to
 * @param {date} startDate - Task start date
 * @param {date} dueDate - Task due date
 * @param {string} priority - Task priority
 * @param {string} status - Task status
 */
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
      .populate("assignedTo", "firstName email")
      .populate("project", "projectName")
      .populate("assignedBy", "firstName email");

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

/**
 * DELETE TASK
 * Deletes a task from the system.
 * Accessible by: TL (Team Lead), ATL (Assistant Team Lead) only
 * @param {string} id - Task ID to delete
 */
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

/**
 * GET ALL USERS
 * Retrieves all users in the system for task assignment dropdown.
 * Accessible by: All authenticated users
 * Returns: User ID, first name, and email
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('_id firstName email')
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};

/**
 * GET ALL PROJECTS
 * Retrieves all projects in the system for task assignment dropdown.
 * Accessible by: All authenticated users
 * Returns: Project ID and project name
 */
export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .select('_id projectName')
      .sort({ projectName: 1 });

    res.status(200).json({
      success: true,
      data: projects,  // ← array directly
    });
  } catch (error) {
    console.error("Get all projects error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch projects",
      error: error.message,
    });
  }
};