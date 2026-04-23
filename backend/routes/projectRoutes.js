import express from "express";
import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

/* =========================
   VIEW - any authenticated user
========================= */
router.get("/", protect, getAllProjects);
router.get("/:id", protect, getProjectById);

/* =========================
   MANAGE - TL only
========================= */
router.post("/", protect, authorize("TL"), createProject);
router.put("/:id", protect, authorize("TL"), updateProject);
router.delete("/:id", protect, authorize("TL"), deleteProject);

export default router;
