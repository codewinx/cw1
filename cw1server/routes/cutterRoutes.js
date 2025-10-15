const express = require("express");
const router = express.Router();
const { getCutterTasks, updateCutterTask , getStaff} = require("../controllers/cutterController");
const { protect, authorize } = require("../middleware/authMiddleware"); // 👈 your JWT middleware

// ✅ Get all tasks for the logged-in cutter
router.get("/getcuttertasks", protect,authorize("Cutter"), getCutterTasks);

// ✅ Update task status
router.put("/:id", protect,authorize("Cutter"), updateCutterTask);

// ✅ Get all staff
router.get("/me", protect,authorize("Cutter"), getStaff);

module.exports = router;
