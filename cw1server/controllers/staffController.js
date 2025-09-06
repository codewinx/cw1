const Staff = require("../models/Staff");
const bcrypt = require("bcryptjs");

// CREATE staff
exports.createStaff = async (req, res) => {
  try {
    const { name, email, mobile, address, gender, role, salary, username, password,
      starRating, profileImage, createdBy, certified, experience } = req.body;

    // Check if email already exists
    const existingStaff = await Staff.findOne({ email });
    if (existingStaff) {
      return res.status(400).json({ message: "Staff with this email already exists" });
    }

    // Hash password if provided
    let hashedPassword = "";
    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    const newStaff = new Staff({
      name,
      email,
      mobile,
      address,
      gender,
      role,
      salary,
      username,
      password: hashedPassword,
      starRating,
      profileImage,
      createdBy,
      certified,
      experience,
    });

    await newStaff.save();
    res.status(201).json({ message: "Staff created successfully", staff: newStaff });
  } catch (error) {
    res.status(500).json({ message: "Error creating staff", error: error.message });
  }
};

// READ all staff
exports.getAllStaff = async (req, res) => {
  try {
    const staff = await Staff.find().populate("createdBy", "name email");
    res.status(200).json(staff);
  } catch (error) {
    res.status(500).json({ message: "Error fetching staff", error: error.message });
  }
};

// READ single staff by ID
exports.getStaffById = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id).populate("createdBy", "name email");
    if (!staff) return res.status(404).json({ message: "Staff not found" });
    res.status(200).json(staff);
  } catch (error) {
    res.status(500).json({ message: "Error fetching staff", error: error.message });
  }
};

// UPDATE staff
// UPDATE staff
// UPDATE staff
exports.updateStaff = async (req, res) => {
  try {
    const { 
      name, email, mobile, address, gender, role, salary, 
      username, password, isActive, starRating, profileImage, 
      createdBy, certified, experience 
    } = req.body;

    let updateData = {
      name,
      email,
      mobile,
      address,
      gender,
      role,
      salary,
      isActive,
      starRating,
      profileImage,
      createdBy,
      certified,
      experience,
    };

    // Only update username if provided
    if (username) {
      updateData.username = username;
    }

    // Only update password if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const staff = await Staff.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!staff) return res.status(404).json({ message: "Staff not found" });

    res.status(200).json({ message: "Staff updated successfully", staff });
  } catch (error) {
    res.status(500).json({ message: "Error updating staff", error: error.message });
  }
};



// DELETE staff
exports.deleteStaff = async (req, res) => {
  try {
    const staff = await Staff.findByIdAndDelete(req.params.id);
    if (!staff) return res.status(404).json({ message: "Staff not found" });

    res.status(200).json({ message: "Staff deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting staff", error: error.message });
  }
};
