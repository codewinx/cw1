// routes/taskRoutes.js
const express = require("express");
const {
  assignTask,
  getAllTasks,
  getTasksByStaff,
  updateTaskStatus,
  deleteTask,
} = require("../controllers/taskController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// admin assigns a task
router.post("/", protect, authorize("admin"), assignTask);

// Get all tasks (admin/admin view)
router.get("/", protect, authorize("admin"), getAllTasks);

// Get tasks for a specific staff (Worker dashboard)
router.get("/staff/:staffId", protect, getTasksByStaff);

// Update task status (Worker action)
router.put("/:taskId/status", protect, updateTaskStatus);

// Delete a task (admin only)
router.delete("/:taskId", protect, authorize("admin"), deleteTask);

module.exports = router;
