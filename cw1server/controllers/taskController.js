// controllers/taskController.js
import Staff from "../models/Staff.js";
import Task from "../models/Task.js";
import Order from "../models/Order.js";
import mongoose from "mongoose"; 
import Service from "../models/Service.js"; // Import the service
// Map category to assignable roles
const categoryRoleMap = {
  Handworking: ["Cutter", "Handworker"],
  Saree: ["Admin", "Manager"],
  Altering: ["Cutter"],
  Stitching: ["Cutter"],
};

// 🔹 Get assignable staff based on category

export const getAssignableStaff = async (req, res) => {
  try {
    const { serviceId } = req.params;

    // Fetch service by _id
    const serviceDoc = await Service.findById(serviceId).lean();
    if (!serviceDoc) return res.status(404).json({ message: "Service not found" });

    const roles = categoryRoleMap[serviceDoc.category];
    if (!roles) return res.status(400).json({ message: "No roles mapped for this service" });

    const staff = await Staff.find({
      role: { $in: roles },
      isActive: true,
    }).select("name role starRating experience certified mobile");

    res.status(200).json({ success: true, data: staff });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// 🔹 Get all orders with their items and tasks
// 🔹 Get all orders with their items and tasks (grouped by payment)
export const getOrdersWithItems = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("customer", "name mobile")
      .populate("service", "name category")
      .populate("payment", "amount status")
      .populate({
        path: "tasks",
        populate: [
          { path: "assignedTo", select: "name role" },
          { path: "assignedBy", select: "name role" },
        ],
      })
      .sort({ createdAt: -1 })
      .lean();

    // If no grouping needed (single order per payment), just return like getOrders
    if (!orders.length) {
      return res.json([]);
    }

    // Group orders by payment._id
    const paymentGroups = {};
    orders.forEach((order) => {
      const paymentId = order.payment?._id?.toString();
      if (!paymentId) return;

      if (!paymentGroups[paymentId]) {
        paymentGroups[paymentId] = {
          mainOrder: order,   // ✅ always store the actual order here
          items: [],
        };
      } else {
        paymentGroups[paymentId].items.push(order);
      }
    });

    const ordersWithItems = Object.values(paymentGroups);

    res.status(200).json({
      success: true,
      data: ordersWithItems,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching orders with items",
      error: err.message,
    });
  }
};


// 🔹 Assign task to staff member
export const assignTask = async (req, res) => {
  try {
    const { orderId, stage, staffId, deadline, remarks, itemId } = req.body;

    if (!staffId) {
      return res.status(400).json({ message: "Please select a worker before assigning." });
    }

    // Find order and populate tasks
    const order = await Order.findById(orderId).populate("tasks");
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Check if staff exists
    const staff = await Staff.findById(staffId);
    if (!staff || !staff.isActive) return res.status(400).json({ message: "Staff not found or inactive" });

    // Check existing task for this stage
    let existingTask = order.tasks.find((t) => t.stage === stage);

    if (existingTask) {
      // ✅ Mark old task as reassigned
      const oldTask = await Task.findById(existingTask._id);
      oldTask.status = "reassigned";
      oldTask.wasReassigned = true; // add this field to schema
      oldTask.history.push({
        action: "reassigned",
        by: req.user._id,
        to: staffId,
        note: remarks || "Reassigned to new staff",
      });
      await oldTask.save();

      // ✅ Create new task for reassignment
      const newTask = await Task.create({
        order: orderId,
        stage,
        assignedTo: staffId,
        assignedBy: req.user._id,
        deadline,
        remarks,
        itemId: itemId || null,
        isReassigned: true,
        history: [
          { action: "assigned (reassign)", by: req.user._id, to: staffId, note: remarks || "Reassigned task" },
        ],
      });

      order.tasks.push(newTask._id);
      await order.save();

      return res.json({
        success: true,
        message: "Task reassigned successfully",
        task: newTask,
      });
    } else {
      // ✅ First-time assignment
      const newTask = await Task.create({
        order: orderId,
        stage,
        assignedTo: staffId,
        assignedBy: req.user._id,
        deadline,
        remarks,
        itemId: itemId || null,
        history: [
          { action: "assigned", by: req.user._id, to: staffId, note: remarks || "First assignment" },
        ],
      });

      order.tasks.push(newTask._id);
      await order.save();

      return res.status(201).json({
        success: true,
        message: "Task assigned successfully",
        task: newTask,
      });
    }
  } catch (err) {
    console.error("Error assigning task:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 🔹 Get all tasks (Admin/Manager view)
export const getAllTasks = async (req, res) => {
  try {
    const { status, stage, assignedTo } = req.query;
    
    let filter = {};
    if (status) filter.status = status;
    if (stage) filter.stage = stage;
    if (assignedTo) filter.assignedTo = assignedTo;

    const tasks = await Task.find(filter)
      .populate("order", "orderNo customer service expectedDate")
      .populate("assignedTo", "name role mobile")
      .populate("assignedBy", "name role")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      tasks,
      count: tasks.length
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
};

// 🔹 Get tasks for specific staff member
export const getTasksByStaff = async (req, res) => {
  try {
    const { staffId } = req.params;
    const { status } = req.query;

    let filter = { assignedTo: staffId };
    if (status) filter.status = status;

    const tasks = await Task.find(filter)
      .populate("order", "orderNo customer service expectedDate")
      .populate("assignedBy", "name role")
      .sort({ deadline: 1, createdAt: -1 });

    res.json({
      success: true,
      tasks,
      count: tasks.length
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
};

// 🔹 Update task status
export const updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status, remarks } = req.body;

    const validStatuses = ["pending", "in-progress", "done", "reassigned"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status"
      });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ 
        success: false,
        message: "Task not found" 
      });
    }

    const updateData = { status };
    
    // Set startedAt when task moves to in-progress
    if (status === "in-progress" && !task.startedAt) {
      updateData.startedAt = new Date();
    }
    
    // Set completedAt when task is done
    if (status === "done" && !task.completedAt) {
      updateData.completedAt = new Date();
    }

    if (remarks) {
      updateData.remarks = remarks;
    }

    // Add to history
    updateData.$push = {
      history: {
        action: "status_update",
        by: req.body.updatedBy || task.assignedBy,
        note: `Status changed from ${task.status} to ${status}`,
        at: new Date()
      }
    };

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      updateData,
      { new: true }
    )
    .populate("assignedTo", "name role")
    .populate("assignedBy", "name role")
    .populate("order", "orderNo customer");

    res.json({
      success: true,
      message: "Task status updated successfully",
      task: updatedTask
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
};

// 🔹 Delete task
export const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ 
        success: false,
        message: "Task not found" 
      });
    }

    // Remove task reference from order
    await Order.findByIdAndUpdate(task.order, {
      $pull: { tasks: taskId }
    });

    await Task.findByIdAndDelete(taskId);

    res.json({
      success: true,
      message: "Task deleted successfully"
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
};