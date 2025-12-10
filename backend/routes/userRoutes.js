import express from "express";
import {
  forgotPassword
} from "../controllers/userController.js";


const router = express.Router();

// Public route
router.post("/forgot-password", forgotPassword);

export default router;