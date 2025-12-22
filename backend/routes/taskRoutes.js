const express = require("express");
const router = express.Router();
const { createTask } = require("../controllers/taskController");
const authMiddleware = require("../middleware/authMiddleware");

// Only PM / TL should access
router.post("/create", authMiddleware, createTask);

module.exports = router;