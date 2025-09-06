// routes/staffRoutes.js
const express = require("express");
const router = express.Router();
const staffController = require("../controllers/staffController");

// CRUD routes
router.post("/", staffController.createStaff);       // Create staff
router.get("/", staffController.getAllStaff);        // Get all staff
router.get("/:id", staffController.getStaffById);    // Get single staff
router.put("/:id", staffController.updateStaff);     // Update staff
router.delete("/:id", staffController.deleteStaff);  // Delete staff

module.exports = router;
