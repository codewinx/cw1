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
  assignTaskController ,
  getAllTasks,
  getTasksByStaff,
  updateTaskStatus,
  deleteTask,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  searchCustomers,
  getServices,
  addService,
  updateService,
  deleteService,
  updateOrder,
  getAllPayments,
  updatePayment,
  deletePayment,
} from "../controllers/adminManagerController.js";

const router = express.Router();

// -------------------- ORDER ROUTES --------------------
router.post("/orders", protect, authorize("admin", "Manager"), uploadDesign, createOrder);
router.get("/orders", protect, authorize("admin", "manager"), getOrders);
router.get("/orders/:id", protect, authorize("admin", "Manager"), getOrderById);
router.put("/orders/:id", protect, authorize("admin", "Manager"), updateOrder);

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
router.post("/assign-task", protect, authorize("admin", "Manager"), assignTaskController );
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
// Route: /api/customers/search?query=123 or query=sur
router.get("/search", searchCustomers);
router.get("/services", protect, authorize("admin", "Manager"), getServices);
router.post("/add-service", protect, authorize("admin", "Manager"), addService);
router.put("/service/:id",protect, authorize("admin", "Manager"), updateService);
router.delete("/service/:id",protect, authorize("admin", "Manager"), deleteService);
router.get("/payment-logs", protect, authorize("admin"), getAllPayments);         
router.put("/payment/:id", protect, authorize("admin"), updatePayment);       
router.delete("/payment/:id",protect, authorize("admin"), deletePayment); 
export default router;
