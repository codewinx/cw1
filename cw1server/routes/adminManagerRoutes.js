import express from "express";
import uploadDesign from "../middleware/uploadDesign.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

import {
  createOrder,
  getOrders,
  getOrderById,
  getCategories,
  getServicesByCategory,
  createService,
  createStaff,
  getAllStaff,
  getStaffById,
  updateStaff,
  deleteStaff,
  getAssignableStaff,
  getOrdersWithItems,
  assignTask,
  getAllTasks,
  getTasksByStaff,
  updateTaskStatus,
  deleteTask,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} from "../controllers/adminManagerController.js";

const router = express.Router();

// -------------------- ORDER ROUTES --------------------
router.post("/orders", protect, authorize("admin", "Manager"), uploadDesign, createOrder);
router.get("/orders", protect, authorize("admin", "Manager"), getOrders);
router.get("/orders/:id", protect, authorize("admin", "Manager"), getOrderById);

// -------------------- CATEGORY ROUTES --------------------
router.get("/categories", getCategories);
router.get("/categories/:category/services", getServicesByCategory);
router.post("/services", protect, authorize("admin", "Manager"), createService);

// -------------------- STAFF ROUTES --------------------
router.post("/staff", protect, authorize("admin", "Manager"), createStaff);
router.get("/staff", protect, authorize("admin", "Manager"), getAllStaff);
router.get("/staff/:id", protect, authorize("admin", "Manager"), getStaffById);
router.put("/staff/:id", protect, authorize("admin", "Manager"), updateStaff);
router.delete("/staff/:id", protect, authorize("admin", "Manager"), deleteStaff);

// -------------------- TASK ROUTES --------------------
router.post("/tasks", protect, authorize("admin", "Manager"), assignTask);
router.get("/tasks", protect, authorize("admin", "Manager"), getAllTasks);
router.get("/tasks/staff/:staffId", protect, authorize("admin", "Manager"), getTasksByStaff);
router.put("/tasks/:taskId/status", protect, authorize("admin", "Manager"), updateTaskStatus);
router.delete("/tasks/:taskId", protect, authorize("admin", "Manager"), deleteTask);

// -------------------- STAFF ASSIGNMENT --------------------
router.get("/assignable-staff/:serviceId", protect, authorize("admin", "Manager"), getAssignableStaff);
router.get("/orders-with-items", protect, authorize("admin", "Manager"), getOrdersWithItems);

// -------------------- CUSTOMER ROUTES --------------------
router.get("/customers", getAllCustomers);
router.get("/customers/:id", getCustomerById);
router.put("/customers/:id", updateCustomer);
router.delete("/customers/:id", deleteCustomer);

export default router;
