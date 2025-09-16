const bcrypt = require("bcryptjs");
const Staff = require("../models/Staff");
const generateToken = require("../utils/generateToken");
const jwt = require("jsonwebtoken");
const Task = require("../models/Task");
const Measurement = require("../models/Measurement");
const Order = require("../models/Order");
const upload = require("../middleware/upload");


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


// controllers/cutterController.js
exports.getCutterTasks = async (req, res) => {
  try {
    const cutterId = req.user?._id || req.params.cutterId;
    if (!cutterId) {
      return res.status(400).json({ error: "Cutter ID is required" });
    }

    const tasks = await Task.find({
      $or: [{ assignedTo: cutterId }, { "history.to": cutterId }],
    })
      .populate({
        path: "order",
        populate: { path: "measurement", model: "Measurement" },
      })
      .populate("assignedTo")
      .populate("history.by")
      .populate("history.to");

    const mappedTasks = tasks.map((t) => {
      const latestDeadline = t.deadline || t.order?.expectedDate;
      return { ...t.toObject(), latestDeadline };
    });

    // ✅ Pending (only fresh ones, never reassigned)
    const pending = mappedTasks.filter(
      (t) => t.status === "pending" && !t.isReassigned && !t.wasReassigned
    );

    // ✅ In Progress (normal + reassigned with badge)
    const inProgress = mappedTasks.filter((t) => t.status === "in-progress");

    // ✅ Completed (normal + reassigned with badge)
    const completed = mappedTasks.filter((t) => t.status === "done");

    // ✅ Reassigned (only those still pending)
    const reassigned = mappedTasks.filter(
      (t) => t.isReassigned && t.status === "pending"
    );

    res.json({ pending, inProgress, completed, reassigned });
  } catch (err) {
    console.error("Error fetching cutter tasks:", err);
    res.status(500).json({ error: "Server error while fetching tasks" });
  }
};








exports.updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;
    const userId = req.user?._id;

    // Validate status
    if (!["pending", "in-progress", "done"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    // Find task
    const task = await Task.findById(taskId)
      .populate("order", "orderNo expectedDate")
      .populate("assignedTo", "name role");

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Prepare update fields
    const updateFields = { status, wasAssigned: true };

    if (status === "in-progress") {
      updateFields.startedAt = new Date();
    } else if (status === "done") {
      updateFields.completedAt = new Date();
    }

  // Don't kill the reassigned history
if (task.isReassigned && ["in-progress", "done"].includes(status)) {
  updateFields.isReassigned = false;     // ✅ so it's not shown in Reassigned page anymore
  updateFields.wasReassigned = true;     // ✅ keep a history flag (new field in schema!)
}



    // Update task
    const updatedTask = await Task.findByIdAndUpdate(taskId, updateFields, { new: true });

    // Push into history
    updatedTask.history.push({
      action: `status-updated to ${status}`,
      by: userId,
      to: task.assignedTo._id,
      at: new Date(),
    });

    await updatedTask.save();

    res.json({ message: "Task status updated successfully", task: updatedTask });
  } catch (error) {
    console.error("Error updating task status:", error);
    res.status(500).json({ error: "Failed to update task status" });
  }
};


//update profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, email, mobile, address, gender,  } = req.body;

    const staff = await Staff.findById(req.user._id);
    if (!staff) return res.status(404).json({ message: "Staff not found" });

    // Update fields
    staff.name = name || staff.name;
    staff.email = email || staff.email;
    staff.mobile = mobile || staff.mobile;
    staff.address = address || staff.address;
    staff.gender = gender || staff.gender;
   

    // Update profile image if file exists
    if (req.file) {
      staff.profileImage = `/uploads/profile/${req.file.filename}`;
    }

    await staff.save();

    res.status(200).json({ message: "Profile updated successfully", staff });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

