const bcrypt = require("bcryptjs");
const Staff = require("../models/Staff");
const generateToken = require("../utils/generateToken");
const jwt = require("jsonwebtoken");
const Task = require("../models/Task");

exports.getCutterTasks = async (req, res) => {
  try {
    // Cutter ID can come from JWT auth or from params/query
    const cutterId = req.user?._id || req.params.cutterId;

    if (!cutterId) {
      return res.status(400).json({ error: "Cutter ID is required" });
    }

    const tasks = await Task.find({ assignedTo: cutterId })  // ✅ Only fetch tasks for this cutter
      .populate({
        path: "order",
        populate: {
          path: "measurement",
          model: "Measurement",
        },
      })
      .populate("assignedTo"); // populate assigned staff details

    res.json({ tasks });
  } catch (err) {
    console.error("Error fetching cutter tasks:", err);
    res.status(500).json({ error: "Server error while fetching tasks" });
  }
};