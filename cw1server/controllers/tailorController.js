const bcrypt = require("bcryptjs");
const Staff = require("../models/Staff");
const generateToken = require("../utils/generateToken");
const jwt = require("jsonwebtoken");
const Task = require("../models/Task");
// controllers/tailorController.js
exports.gettailorinfo = async (req, res) => {
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
// exports.getTasksByStaffid = async (req, res) => {
//   try {
//     const { staffId } = req.params;

//     const tasks = await Task.find({ assignedTo: staffId })
//       .populate("order") // include order details
//       .populate("assignedBy", "name email role")
//       .populate("assignedTo", "name email role");

//     res.status(200).json({
//       success: true,
//       count: tasks.length,
//       tasks,
//     });
//   } catch (error) {
//     console.error("❌ Error fetching tasks by staff:", error.message);
//     res.status(500).json({ success: false, error: "Server Error" });
//   }
// };

exports.gettailorTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate({
        path: "order",
        populate: {
          path: "measurement",   // populate measurement inside order
          model: "Measurement"
        }
      })
      .populate("assignedTo"); // populate assigned staff details

    res.json({ tasks });
  } catch (err) {
    console.error("Error fetching tailor tasks:", err);
    res.status(500).json({ error: "Server error while fetching tasks" });
  }
};

exports.updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body; // "pending" | "in-progress" | "done"

    // Validate
    if (!["pending", "in-progress", "done"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const updateFields = { status };

    if (status === "in-progress") {
      updateFields.startedAt = new Date();
    } else if (status === "done") {
      updateFields.completedAt = new Date();
    }

    const task = await Task.findByIdAndUpdate(taskId, updateFields, { new: true })
      .populate("order", "orderNumber deliveryDate")
      .populate("assignedTo", "name role");

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: "Failed to update task status" });
  }
};



exports.getTaskStatusCounts = async (req, res) => {
  try {
    const pendingCount = await Task.countDocuments({ status: "pending" });
    const inProgressCount = await Task.countDocuments({ status: "in-progress" });
    const doneCount = await Task.countDocuments({ status: "done" });

    res.status(200).json({
      pending: pendingCount,
      inProgress: inProgressCount,
      done: doneCount,
    });
  } catch (err) {
    console.error("Error fetching task counts:", err);
    res.status(500).json({ message: "Server error" });
  }
};

//   try {
//     const { name, email, mobile, address, gender,  } = req.body;

//     const staff = await Staff.findById(req.user._id);
//     if (!staff) return res.status(404).json({ message: "Staff not found" });

//     // Update fields
//     staff.name = name || staff.name;
//     staff.email = email || staff.email;
//     staff.mobile = mobile || staff.mobile;
//     staff.address = address || staff.address;
//     staff.gender = gender || staff.gender;
   

//     // Update profile image if file exists
//     if (req.file) {
//       staff.profileImage = `/uploads/profile/${req.file.filename}`;
//     }

//     await staff.save();

//     res.status(200).json({ message: "Profile updated successfully", staff });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server Error", error: error.message });
//   }
// };