const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// =============================
// @desc    Register new user (Admin Only)
// =============================
const registerUser = async (req, res) => {
  try {
    const {
      username,
      password,
      name,
      email,
      phone,
      address,
      role,
      starRating,
      profileImage,
      certified,
      experience
    } = req.body;

    // ❌ Prevent creating another admin
    if (role === 'admin') {
      return res.status(400).json({ message: "Admin can only be created manually in DB" });
    }

    // Check if user already exists (username/email/phone)
    const userExists = await User.findOne({
      $or: [{ username }, { email }, { phone }]
    });
    if (userExists) {
      return res.status(400).json({ message: "User with same username/email/phone already exists" });
    }

    // Create user
    const user = await User.create({
      username,
      password,
      name,
      email,
      phone,
      address,
      role,
      starRating,
      profileImage,
      createdBy: req.user._id, // admin who created
      certified,
      experience
    });

    res.status(201).json({
      _id: user._id,
      username: user.username,
      role: user.role,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      starRating: user.starRating,
      profileImage: user.profileImage,
      certified: user.certified,
      experience: user.experience,
      createdAt: user.createdAt
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =============================
// @desc    Login user (Admin + Users)
// =============================
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        role: user.role,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        starRating: user.starRating,
        profileImage: user.profileImage,
        certified: user.certified,
        experience: user.experience,
        createdAt: user.createdAt,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: "Invalid username or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =============================
// @desc    Get all users (Admin only)
// =============================
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } }).select("-password"); // exclude admin
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =============================
// @desc    Update user (Admin only)
// =============================
const updateUser = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      role,
      starRating,
      profileImage,
      certified,
      experience
    } = req.body;

    // ❌ Prevent updating role to admin
    if (role === 'admin') {
      return res.status(400).json({ message: "Cannot assign Admin role" });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.address = address || user.address;
    user.role = role || user.role;
    user.starRating = starRating ?? user.starRating;
    user.profileImage = profileImage || user.profileImage;
    user.certified = certified ?? user.certified;
    user.experience = experience ?? user.experience;

    await user.save();

    res.json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =============================
// @desc    Delete user (Admin only)
// =============================
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role === 'admin') {
      return res.status(400).json({ message: "Cannot delete Admin" });
    }

    await user.deleteOne();
    res.json({ message: "User removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
  updateUser,
  deleteUser
};
