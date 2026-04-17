import Project from "../models/Project.js";
import AppError from "../utils/AppError.js";

/* =========================
   CREATE PROJECT
   TL only
========================= */
export const createProject = async (req, res, next) => {
  try {
    const { projectName, description, startDate, endDate, status } = req.body;

    if (!projectName?.trim()) {
      return next(new AppError("Project name is required", 400));
    }

    const project = await Project.create({
      projectName: projectName.trim(),
      description: description?.trim() || "",
      startDate: startDate || null,
      endDate: endDate || null,
      status: status || "Active",
    });

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

/* =========================
   GET ALL PROJECTS
   any authenticated user
========================= */
export const getAllProjects = async (req, res, next) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

/* =========================
   GET PROJECT BY ID
   any authenticated user
========================= */
export const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return next(new AppError("Project not found", 404));
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

/* =========================
   UPDATE PROJECT
   TL only
========================= */
export const updateProject = async (req, res, next) => {
  try {
    const { projectName, description, startDate, endDate, status } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return next(new AppError("Project not found", 404));
    }

    project.projectName = projectName?.trim() || project.projectName;
    project.description =
      description !== undefined ? description.trim() : project.description;
    project.startDate = startDate !== undefined ? startDate : project.startDate;
    project.endDate = endDate !== undefined ? endDate : project.endDate;
    project.status = status || project.status;

    const updatedProject = await project.save();

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: updatedProject,
    });
  } catch (error) {
    next(error);
  }
};

/* =========================
   DELETE PROJECT
   TL only
========================= */
export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return next(new AppError("Project not found", 404));
    }

    await project.deleteOne();

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
