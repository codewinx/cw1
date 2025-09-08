// routes/customerRoutes.js
const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");
const { protect, authorize } = require("../middleware/authMiddleware");

// Create new customer
router.post( "/createcustomer",protect,authorize("admin"),customerController.createCustomer
);

// Search customers (autocomplete or quick lookup)
router.get(
  "/searchcustomers",
  protect,
  authorize("admin"),
  customerController.searchCustomers
);

// Get all customers with their order numbers
router.get(
  "/customers",
  protect,
  authorize("admin"),
  customerController.getCustomers
);

module.exports = router;
