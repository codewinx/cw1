// controllers/taskController.js
const Task = require("../models/Task");
const Order = require("../models/Order");
const Staff = require("../models/Staff");

// ✅ Create & Assign a Task
exports.assignTask = async (req, res) => {
  try {
    const { orderId, staffId, stage, deadline, remarks } = req.body;

    // check if order exists
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: "Order not found" });

    // check if staff exists
    const staff = await Staff.findById(staffId);
    if (!staff) return res.status(404).json({ error: "Staff not found" });

    // create task
    const task = new Task({
      order: orderId,
      assignedTo: staffId,
      stage,
      deadline,
      remarks,
      assignedBy: req.user ? req.user._id : null, // if Manager is logged in
    });

    await task.save();

    // push into order.tasks array
    order.tasks.push(task._id);
    await order.save();

    res.status(201).json({ message: "Task assigned successfully", task });
  } catch (err) {
    res.status(500).json({ error: err.message });
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
