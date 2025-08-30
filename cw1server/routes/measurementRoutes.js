const express = require("express");
const router = express.Router();
const measurementController = require("../controllers/measurementController");
const { protect, authorize } = require("../middleware/authMiddleware");

// Create Measurement
router.post("/add",  protect, authorize("admin"),measurementController.createMeasurement);

// // Get All Measurements (filter by customer/order optional)
// router.get("/",  protect, authorize("admin"), measurementController.getMeasurements);

// // Get Single Measurement
// router.get("/:id", protect("  admin"), measurementController.getMeasurementById);

// // Update Measurement
// router.put("/:id",  protect, authorize("admin"), measurementController.updateMeasurement);

// // Delete Measurement
// router.delete("/:id",  protect, authorize("admin"), measurementController.deleteMeasurement);

module.exports = router;
