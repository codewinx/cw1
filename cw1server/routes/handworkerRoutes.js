const express = require("express");
const router = express.Router();
const { getHandworkerTasks, updateHandworkerTask , getStaff} = require("../controllers/handworkerController");
const { protect, authorize } = require("../middleware/authMiddleware"); // 👈 your JWT middleware

// ✅ Get all tasks for the logged-in cutter
router.get("/gethandworkertasks", protect,authorize("Handworker"), getHandworkerTasks);

// ✅ Update task status
router.put("/:id", protect,authorize("Handworker"), updateHandworkerTask);

// ✅ Get all staff
router.get("/me", protect,authorize("Handworker"), getStaff);

module.exports = router;
