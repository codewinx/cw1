const express = require("express");
const router = express.Router();
const { getTailorTasks, updateTailorTask , getStaff} = require("../controllers/tailorController");
const { protect, authorize } = require("../middleware/authMiddleware"); // 👈 your JWT middleware

// ✅ Get all tasks for the logged-in cutter
router.get("/gettailortasks", protect,authorize("Tailor"), getTailorTasks);

// ✅ Update task status
router.put("/:id", protect,authorize("Tailor"), updateTailorTask);

// ✅ Get all staff
router.get("/me", protect,authorize("Tailor"), getStaff);

module.exports = router;
