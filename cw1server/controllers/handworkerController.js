const Task = require("../models/Task");
const Staff = require("../models/Staff");

// 🧩 Get all tasks assigned to the logged-in Cutter
exports.getHandworkerTasks = async (req, res) => {
  try {
    const handworkerId = req.user?._id;
    if (!handworkerId) {
      return res.status(400).json({ success: false, message: "handworker ID not found" });
    }

    const tasks = await Task.find({ assignedTo: handworkerId })
      .populate({
        path: "order",
        select: "orderNo service expectedDate measurements status", // ✅ fixed field name
        populate: {
          path: "service",
          select: "name category measurements",
        },
      })
      .populate("assignedBy", "name role")
      .sort({ createdAt: -1 });

    const pending = tasks.filter((t) => t.status === "pending");
    const inProgress = tasks.filter((t) => t.status === "in-progress");
    const done = tasks.filter((t) => t.status === "done");
    const reassigned = tasks.filter((t) => t.status === "reassigned");

    res.json({
      success: true,
      pending,
      inProgress,
      done,
      reassigned,
      count: tasks.length,
    });
  } catch (err) {
    console.error("Error fetching HANDWORKER tasks:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};



// 🧩 Update task status (for Cutter portal)
exports.updateHandworkerTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remarks } = req.body;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    // Record history
    task.history.push({
      action: `Status updated to ${status}`,
      by: req.user._id,
      note: remarks || "",
      at: new Date(),
    });

    task.status = status;
    if (status === "in-progress" && !task.startedAt) task.startedAt = new Date();
    if (status === "done") task.completedAt = new Date();

    await task.save();

    // Update staff performance if done
    if (status === "done") {
      const staff = await Staff.findById(task.assignedTo);
      if (staff) {
        staff.performance.completedTasks += 1;
        staff.performance.totalTasks = await Task.countDocuments({ assignedTo: staff._id });
        await staff.save();
      }
    }

    res.json({
      success: true,
      message: "Task status updated successfully",
      task,
    });
  } catch (err) {
    console.error("Error updating cutter task:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get current logged-in staff
exports.getStaff = async (req, res) => {
  try {
    // req.user should be set by auth middleware
    const staff = req.user;

    if (!staff) {
      return res.status(404).json({ success: false, message: "Staff not found" });
    }

    // Return staff info (you can exclude sensitive fields if needed)
    const { password, ...staffData } = staff.toObject();

    res.json({ success: true, staff: staffData });
  } catch (err) {
    console.error("Error fetching current staff:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};