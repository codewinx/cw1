const Staff = require("../models/Staff");
const bcrypt = require("bcryptjs");

// Create Staff
exports.createStaff = async (req, res) => {
  try {
    const { password, ...rest } = req.body;
    let hashedPassword = "";
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const staff = new Staff({
      ...rest,
      password: hashedPassword || undefined,
      createdBy: req.user?._id || null, // optional if you track who created staff
    });

    await staff.save();
    res.status(201).json(staff);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get All Staff
exports.getAllStaff = async (req, res) => {
  try {
    const staff = await Staff.find().sort({ createdAt: -1 });
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Single Staff
exports.getStaffById = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) return res.status(404).json({ message: "Staff not found" });
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Staff
exports.updateStaff = async (req, res) => {
  try {
    const { password, ...updates } = req.body;

    if (password) {
      updates.password = await bcrypt.hash(password, 10);
    }

    const staff = await Staff.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!staff) return res.status(404).json({ message: "Staff not found" });
    res.json(staff);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete Staff
exports.deleteStaff = async (req, res) => {
  try {
    const staff = await Staff.findByIdAndDelete(req.params.id);
    if (!staff) return res.status(404).json({ message: "Staff not found" });
    res.json({ message: "Staff deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
