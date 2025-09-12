const bcrypt = require("bcryptjs");
const Staff = require("../models/Staff");
const generateToken = require("../utils/generateToken");
const jwt = require("jsonwebtoken");
const Task = require("../models/Task");

// exports.getManagerTasks = async (req, res) => {
//   try {
//     const tasks = await Task.find()
//       .populate({
//         path: "order",
//         populate: {
//           path: "measurement",   // populate measurement inside order
//           model: "Measurement"
//         }
//       })
//       .populate("assignedTo"); // populate assigned staff details

//     res.json({ tasks });
//   } catch (err) {
//     console.error("Error fetching tailor tasks:", err);
//     res.status(500).json({ error: "Server error while fetching tasks" });
//   }
// };
exports.getManagerTasks = async (req, res) => {
  try {
    // ✅ get manager id from logged-in user
    const managerId = req.user._id;

    // ✅ fetch only tasks created/assigned by this manager
    const tasks = await Task.find({ assignedTo: managerId })
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
    console.error("Error fetching manager tasks:", err);
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