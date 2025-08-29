const express = require('express');
const router = express.Router();

const {
  registerUser,
  loginUser,
  getAllUsers,
  updateUser,
  deleteUser
} = require('../controllers/authController');

const { protect, authorize } = require('../middleware/authMiddleware');
const { uploadProfileImage } = require('../middleware/upload');

// =============================
// Auth Routes
// =============================

// 🔑 Login (Admin + Staff)
router.post('/login', loginUser);

// 🆕 Register user (Admin only, with profile image upload)
router.post(
  '/register',
  protect,
  authorize('admin'),
  (req, res, next) => {
    uploadProfileImage(req, res, function (err) {
      if (err) return res.status(400).json({ message: err.message });
      next();
    });
  },
  registerUser
);

// 📋 Get all users (Admin only)
router.get('/users', protect, authorize('admin'), getAllUsers);

// ✏️ Update user (Admin only, with profile image upload)
router.put(
  '/users/:id',
  protect,
  authorize('admin'),
  (req, res, next) => {
    uploadProfileImage(req, res, function (err) {
      if (err) return res.status(400).json({ message: err.message });
      next();
    });
  },
  updateUser
);

// ❌ Delete user (Admin only)
router.delete('/users/:id', protect, authorize('admin'), deleteUser);

module.exports = router;
