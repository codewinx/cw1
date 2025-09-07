const bcrypt = require("bcryptjs");
const Staff = require("../models/Staff");
const generateToken = require("../utils/generateToken");
const jwt = require("jsonwebtoken");

// controllers/cutterController.js
exports.getCurrentStaff = async (req, res) => {
  try {
    // req.user (or req.staff) is populated by protect middleware
    const staff = req.user; // if your middleware attaches it as req.user
    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    res.status(200).json(staff); // return the logged-in staff
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


