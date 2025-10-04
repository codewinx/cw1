// controllers/taskController.js
import Staff from "../models/Staff.js";
import Task from "../models/Task.js";
import Order from "../models/Order.js";
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
    const mainOrders = await Order.find({ parentOrder: null })
      .populate("customer service tasks")
      .lean();

    const groupedOrders = await Promise.all(
      mainOrders.map(async (mainOrder) => {
        const items = await Order.find({ parentOrder: mainOrder._id })
          .populate("customer service tasks")
          .lean();

        return { mainOrder, items };
      })
    );

    res.json(groupedOrders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching orders", error: err.message });
  }
};

// 🔹 Assign task to staff member
export const assignTask = async (req, res) => {
  try {
    const { orderId, stage, staffId, deadline, remarks, itemId } = req.body;

    if (!staffId) {
      return res.status(400).json({ message: "Please select a worker before assigning." });
    }

    // Fetch order
    const order = await Order.findById(orderId).populate("tasks");
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Validate staff
    const staff = await Staff.findById(staffId);
    if (!staff || !staff.isActive) {
      return res.status(400).json({ message: "Staff not found or inactive" });
    }

    // Check existing task
    let existingTask = order.tasks.find((t) =>
      t.stage === stage &&
      ((t.itemId && itemId && t.itemId.toString() === itemId) || (!t.itemId && !itemId))
    );

    // 🔹 Common update function for Order status
    const updateOrderStatus = async (targetOrderId, newStatus) => {
      if (!targetOrderId) return;
      await Order.findByIdAndUpdate(targetOrderId, { status: newStatus });
    };

    if (existingTask) {
      // ✅ Reassign
      const oldTask = await Task.findById(existingTask._id);
      oldTask.status = "reassigned";
      oldTask.wasReassigned = true;
      oldTask.history.push({
        action: "reassigned",
        by: req.user._id,
        to: staffId,
        note: remarks || "Reassigned to new staff",
      });
      await oldTask.save();

      // ✅ Create new task
      const newTask = await Task.create({
        order: orderId,
        stage,
        assignedTo: staffId,
        assignedBy: req.user._id,
        deadline,
        remarks,
        itemId: itemId || null,
        isReassigned: true,
        status: "pending",
        history: [
          { action: "assigned (reassign)", by: req.user._id, to: staffId, note: remarks || "Reassigned task" },
        ],
      });

      order.tasks.push(newTask._id);
      await order.save();

      // ✅ Update the related Order or Suborder status
      await updateOrderStatus(itemId || orderId, stage);

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
        status: "pending",
        history: [
          { action: "assigned", by: req.user._id, to: staffId, note: remarks || "First assignment" },
        ],
      });

      order.tasks.push(newTask._id);
      await order.save();

      // ✅ Update order/suborder status after first assignment
      await updateOrderStatus(itemId || orderId, stage);

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