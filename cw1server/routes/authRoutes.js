const express = require("express");
const router = express.Router();

const {
  registerStaff,
  loginStaff,
  getAllStaff,
  updateStaff,
  deleteStaff,
  getOrderStats,
} = require("../controllers/authController");

const { protect, authorize } = require("../middleware/authMiddleware");
const { uploadProfileImage } = require("../middleware/upload");


// =============================
// Auth Routes for Staff
// =============================

// 🔑 Login (Admin + Staff)
router.post("/login", loginStaff);

// 🆕 Register staff (Admin only, with profile image upload)
router.post(
  "/register",
  protect,
  authorize("admin"),
  (req, res, next) => {
    uploadProfileImage(req, res, function (err) {
      if (err) return res.status(400).json({ message: err.message });
      next();
    });
  },
  registerStaff
);

// 📋 Get all staff (Admin only)
router.get("/staff", protect, authorize("admin"), getAllStaff);

// ✏️ Update staff (Admin only, with profile image upload)
router.put(
  "/staff/:id",
  protect,
  authorize("admin"),
  (req, res, next) => {
    uploadProfileImage(req, res, function (err) {
      if (err) return res.status(400).json({ message: err.message });
      next();
    });
  },
  updateStaff
);

// ❌ Delete staff (Admin only)
router.delete("/staff/:id", protect, authorize("admin"), deleteStaff);

// // GET /api/tasks/grouped
// router.get("/grouped", protect, authorize("admin"), getTasksGroupedByStage);

// GET /api/orders/stats
router.get("/stats", protect, authorize("admin"), getOrderStats);



module.exports = router;
