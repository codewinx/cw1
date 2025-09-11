// routes/paymentRoutes.js
const express = require("express");
const router = express.Router();
const {
  addPayment,
  getPaymentsByOrderNo,
  updatePayment,
} = require("../controllers/paymentController");

// Add payment
router.post("/add", addPayment);

// Get payments + order details by orderNo
router.get("/:orderNo", getPaymentsByOrderNo);

// Update payment by ID
router.put("/:id", updatePayment);

module.exports = router;
