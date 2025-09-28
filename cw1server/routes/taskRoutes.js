// routes/taskRoutes.js
import express from "express";
import {
  getAssignableStaff,
  getOrdersWithItems,
  assignTask,
  getAllTasks,
  getTasksByStaff,
  updateTaskStatus,
  deleteTask
} from "../controllers/taskController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";


const router = express.Router();

// Staff assignment routes
router.get("/assignable-staff/:serviceId" ,protect, authorize("admin"),  getAssignableStaff);
router.get("/orders-with-items", protect, authorize("admin"),  getOrdersWithItems);

// Task management routes
router.post("/", protect, authorize("admin"), assignTask);
router.get("/", protect, authorize("admin"), getAllTasks);
router.get("/staff/:staffId",  protect, authorize("admin"), getTasksByStaff);
router.put("/:taskId/status", protect, authorize("admin"),  updateTaskStatus);
router.delete("/:taskId", deleteTask);

export default router;