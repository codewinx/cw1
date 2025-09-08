const Task = require("../models/Task");
const Order = require("../models/Order");
const Staff = require("../models/Staff");

// ✅ Create & Assign (or Re-Assign) Task
exports.assignTask = async (req, res) => {
  try {
    const { orderId, stage, assignedTo, deadline, remarks } = req.body;

    if (!assignedTo) {
      return res.status(400).json({ message: "Please select a worker before assigning." });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const newTask = await Task.create({
      order: orderId,
      stage,
      assignedTo,
      assignedBy: req.user._id, // admin assigning
      deadline,
      remarks,
    });

    order.tasks = order.tasks || [];
    order.tasks.push(newTask._id);
    await order.save();

    res.status(201).json({
      success: true,
      message: "Task assigned successfully",
      task: newTask,
    });
  } catch (err) {
    console.error("Error assigning task:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ Get all tasks (Admin/Manager)
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("order", "orderNo category service status")
      .populate("assignedTo", "name role")
      .populate("assignedBy", "name role");
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get tasks by staff (Worker dashboard)
exports.getTasksByStaff = async (req, res) => {
  try {
    const { staffId } = req.params;
    const tasks = await Task.find({ assignedTo: staffId })
      .populate("order", "orderNo category service status expectedDate")
      .populate("assignedBy", "name role");
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update task status (Worker action)
exports.updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status, remarks } = req.body;

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ error: "Task not found" });

    task.status = status;
    if (status === "in-progress" && !task.startedAt) {
      task.startedAt = new Date();
    }
    if (status === "done") {
      task.completedAt = new Date();
    }

    if (remarks) task.remarks = remarks;

    // add to history
    task.history.push({
      action: status,
      by: req.user ? req.user._id : null,
      note: remarks,
      at: new Date(),
    });

    await task.save();
    res.json({ message: "Task updated successfully", task });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Delete task (Manager only)
exports.deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findByIdAndDelete(taskId);
    if (!task) return res.status(404).json({ error: "Task not found" });

    // remove from order.tasks
    await Order.findByIdAndUpdate(task.order, {
      $pull: { tasks: task._id },
    });

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
