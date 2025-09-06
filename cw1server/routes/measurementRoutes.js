const express = require("express");
const router = express.Router();
const measurementController = require("../controllers/measurementController");
const { protect, authorize } = require("../middleware/authMiddleware");

// @desc    Create a new measurement profile
// @route   POST /api/measurement
// @access  Private (Admin/Staff)
router.post("/", protect, authorize("admin"), measurementController.createMeasurement);

// @desc    Get all measurement profiles for a specific customer
// @route   GET /api/measurement/customer/:customerId
// @access  Private (Admin/Staff)
router.get("/customer/:customerId", protect, authorize("admin"), measurementController.getMeasurementsByCustomerId);

// @desc    Update an existing measurement profile
// @route   PUT /api/measurement/:id
// @access  Private (Admin/Staff)
router.put("/:id", protect, authorize("admin"), measurementController.updateMeasurement);

module.exports = router;