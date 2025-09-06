const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { protect, authorize } = require("../middleware/authMiddleware");

// ============================
// Order Routes
// ============================

// 📌 Create Order (Admin only)
router.post(
  "/create",
  protect,
  authorize("admin"),
  orderController.createOrder
);

// 📌 Get all orders (Admin + Staff can view)
router.get(
  "/",
  protect,
  authorize("admin", "staff"),
  orderController.getOrders
);

// 📌 Get single order by ID
router.get(
  "/:id",
  protect,
  authorize("admin", "staff"),
  orderController.getOrderById
);

// 📌 Update order (Admin only)
router.put(
  "/:id",
  protect,
  authorize("admin"),
  orderController.updateOrder
);

// 📌 Delete order (Admin only)
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  orderController.deleteOrder
);

module.exports = router;
