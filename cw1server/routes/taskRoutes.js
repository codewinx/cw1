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

router.post("/", protect, authorize("admin"), assignTask);
router.get("/", protect, authorize("admin"), getAllTasks);
router.get("/staff/:staffId", protect, getTasksByStaff);
router.put("/:taskId/status", protect, updateTaskStatus);
router.delete("/:taskId", protect, authorize("admin"), deleteTask);

module.exports = router;
