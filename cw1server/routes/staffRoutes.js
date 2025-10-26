const express = require("express");
const router = express.Router();
const {
  createStaff,
  getAllStaff,
  getStaffById,
  updateStaff,
  deleteStaff,
} = require("../controllers/staffController");

const { protect, authorize } = require("../middleware/authMiddleware");

// Staff Routes
router.post("/", protect, authorize("admin", "Manager"), createStaff);
router.get("/", protect, authorize("admin", "Manager"), getAllStaff);
router.get("/:id", protect, authorize("admin", "Manager"), getStaffById);
router.put("/:id", protect, authorize("admin", "Manager"), updateStaff);
router.delete("/:id", protect, authorize("admin", "Manager"), deleteStaff);

module.exports = router;
