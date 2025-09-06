// routes/tailorRoutes.js
const express = require("express");
const router = express.Router();
const { getOrders, getMeasurementsByOrderId, updateOrderStatus, } = require("../controllers/tailorController");

// @route   GET /api/tailor/orders
// @desc    Get tailor-specific orders
router.get("/getorders", getOrders);
router.get("/orders/:orderId/measurements", getMeasurementsByOrderId);
router.put("/orders/:orderId/status", updateOrderStatus);

module.exports = router;
