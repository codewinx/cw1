const express = require("express");
const router = express.Router();
const { createCustomer } = require("../controllers/customerController");
const { protect, authorize } = require("../middleware/authMiddleware");

// Admin or Manager can add customer
router.post("/createcustomer", protect, authorize("admin"), createCustomer);

module.exports = router;
