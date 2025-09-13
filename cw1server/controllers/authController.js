const bcrypt = require("bcryptjs");
const Staff = require("../models/Staff");
const generateToken = require("../utils/generateToken");

// =============================
// @desc    Register new staff (Admin Only)
// =============================
const registerStaff = async (req, res) => {
  try {
    const {
      username,
      password,
      name,
      email,
      mobile,
      address,
      role,
      starRating,
      profileImage,
      certified,
      experience,
      gender,
      salary,
    } = req.body;

    // Check if staff already exists (username/email/mobile)
    const staffExists = await Staff.findOne({
      $or: [{ username }, { email }, { mobile }],
    });

    if (staffExists) {
      return res
        .status(400)
        .json({ message: "Staff with same username/email/mobile already exists" });
    }

    // Hash password if provided
    let hashedPassword = "";
    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    // Create staff
    const staff = await Staff.create({
      username,
      password: hashedPassword,
      name,
      email,
      mobile,
      address,
      role,
      gender,
      salary,
      starRating,
      profileImage,
      createdBy: req.staff?._id || null, // admin who created
      certified,
      experience,
    });

    res.status(201).json({
      _id: staff._id,
      username: staff.username,
      role: staff.role,
      name: staff.name,
      email: staff.email,
      mobile: staff.mobile,
      address: staff.address,
      gender: staff.gender,
      salary: staff.salary,
      starRating: staff.starRating,
      profileImage: staff.profileImage,
      certified: staff.certified,
      experience: staff.experience,
      createdAt: staff.createdAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =============================
// @desc    Login staff (Admin + Staff)
// =============================
const loginStaff = async (req, res) => {
  try {
    const { username, password } = req.body;

    const staff = await Staff.findOne({ username });

    if (staff && staff.password) {
      const isMatch = await bcrypt.compare(password, staff.password);

      if (isMatch) {
        return res.json({
          _id: staff._id,
          username: staff.username,
          role: staff.role,
          name: staff.name,
          email: staff.email,
          mobile: staff.mobile,
          address: staff.address,
          gender: staff.gender,
          salary: staff.salary,
          starRating: staff.starRating,
          profileImage: staff.profileImage,
          certified: staff.certified,
          experience: staff.experience,
          createdAt: staff.createdAt,
          token: generateToken(staff._id),
        });
      }
    }

    res.status(401).json({ message: "Invalid username or password" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =============================
// @desc    Get all staff (Admin only)
// =============================
const getAllStaff = async (req, res) => {
  try {
    const staffList = await Staff.find().select("-password");
    res.json(staffList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =============================
// @desc    Update staff (Admin only)
// =============================
const updateStaff = async (req, res) => {
  try {
    const {
      name,
      email,
      mobile,
      address,
      role,
      gender,
      salary,
      starRating,
      profileImage,
      certified,
      experience,
    } = req.body;

    const staff = await Staff.findById(req.params.id);
    if (!staff) return res.status(404).json({ message: "Staff not found" });

    staff.name = name || staff.name;
    staff.email = email || staff.email;
    staff.mobile = mobile || staff.mobile;
    staff.address = address || staff.address;
    staff.role = role || staff.role;
    staff.gender = gender || staff.gender;
    staff.salary = salary ?? staff.salary;
    staff.starRating = starRating ?? staff.starRating;
    staff.profileImage = profileImage || staff.profileImage;
    staff.certified = certified ?? staff.certified;
    staff.experience = experience ?? staff.experience;

    await staff.save();

    res.json({ message: "Staff updated successfully", staff });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =============================
// @desc    Delete staff (Admin only)
// =============================
const deleteStaff = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);

    if (!staff) return res.status(404).json({ message: "Staff not found" });

    await staff.deleteOne();
    res.json({ message: "Staff removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const Order = require("../models/Order");

// 📊 Get order counts by status
const getOrderStats = async (req, res) => {
  try {
    // Aggregate counts grouped by status
    const stats = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Convert aggregation result into structured object
    const result = {
      placed: 0,
      cutting: 0,
      handworking: 0,
      tailoring: 0,
      "quality-check": 0,
      "ready-to-delivery": 0,
    };

    stats.forEach((item) => {
      result[item._id] = item.count;
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error fetching order stats:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};









module.exports = {
  registerStaff,
  loginStaff,
  getAllStaff,
  updateStaff,
  deleteStaff,
  getOrderStats,

};
