const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { protect, authorize } = require("../middleware/authMiddleware");

// 📌 Create Order (Admin only)
router.post("/createorder", protect, authorize("admin"), orderController.createOrder);


module.exports = router;
