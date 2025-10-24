import Order from "../models/Order.js";
import Customer from "../models/Customer.js";
import Task from "../models/Task.js";
import Service from "../models/Service.js";
import Staff from "../models/Staff.js";
import Payment from "../models/Payment.js";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const categoryRoleMap = {
  Handworking: ["Cutter", "Handworker"],
  Saree: ["Admin", "Manager"],
  Altering: ["Cutter"],
  Stitching: ["Cutter"],
};

// ------------------ STAFF ------------------

export const createStaff = async (req, res) => {
  try {
    const { password, ...rest } = req.body;
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

    const staff = new Staff({
      ...rest,
      password: hashedPassword,
      createdBy: req.user?._id || null,
    });

    await staff.save();
    res.status(201).json(staff);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


export const getAllStaff = async (req, res) => {
  try {
    const staff = await Staff.find().sort({ createdAt: -1 });
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStaffById = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) return res.status(404).json({ message: "Staff not found" });
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateStaff = async (req, res) => {
  try {
    const { password, ...updates } = req.body;
    if (password) updates.password = await bcrypt.hash(password, 10);

    const staff = await Staff.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!staff) return res.status(404).json({ message: "Staff not found" });
    res.json(staff);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteStaff = async (req, res) => {
  try {
    const staff = await Staff.findByIdAndDelete(req.params.id);
    if (!staff) return res.status(404).json({ message: "Staff not found" });
    res.json({ message: "Staff deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ------------------ CUSTOMERS ------------------

export const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching customers", error });
  }
};

export const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findById(id);
    if (!customer) return res.status(404).json({ message: "Customer not found" });

    const orders = await Order.find({ customer: id })
      .populate("service")
      .populate("payment");

    res.status(200).json({ customer, orders });
  } catch (error) {
    res.status(500).json({ message: "Error while fetching customer", error });
  }
};

export const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCustomer = await Customer.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedCustomer) return res.status(404).json({ message: "Customer not found" });
    res.status(200).json(updatedCustomer);
  } catch (error) {
    res.status(500).json({ message: "Error updating customer", error });
  }
};

export const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCustomer = await Customer.findByIdAndDelete(id);
    if (!deletedCustomer) return res.status(404).json({ message: "Customer not found" });
    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting customer", error });
  }
};

// ------------------ STAFF ASSIGNMENT ------------------

export const getAssignableStaff = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const serviceDoc = await Service.findById(serviceId).lean();
    if (!serviceDoc) return res.status(404).json({ message: "Service not found" });

    const roles = categoryRoleMap[serviceDoc.category];
    if (!roles) return res.status(400).json({ message: "No roles mapped for this service" });

    const staff = await Staff.find({ role: { $in: roles }, isActive: true })
      .select("name role starRating experience certified mobile");

    res.status(200).json({ success: true, data: staff });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ------------------ ORDERS ------------------

export const getOrdersWithItems = async (req, res) => {
  try {
    const mainOrders = await Order.find({ parentOrder: null }).populate("customer service tasks").lean();
    const groupedOrders = await Promise.all(
      mainOrders.map(async (mainOrder) => {
        const items = await Order.find({ parentOrder: mainOrder._id }).populate("customer service tasks").lean();
        return { mainOrder, items };
      })
    );
    res.json(groupedOrders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching orders", error: err.message });
  }
};

// ------------------ TASKS ------------------

export const assignTask = async (req, res) => {
  try {
    const { orderId, stage, staffId, deadline, remarks, itemId } = req.body;
    if (!staffId) return res.status(400).json({ message: "Please select a worker before assigning." });

    const order = await Order.findById(orderId).populate("tasks");
    if (!order) return res.status(404).json({ message: "Order not found" });

    const staff = await Staff.findById(staffId);
    if (!staff || !staff.isActive) return res.status(400).json({ message: "Staff not found or inactive" });

    let existingTask = order.tasks.find(
      (t) => t.stage === stage && ((t.itemId && itemId && t.itemId.toString() === itemId) || (!t.itemId && !itemId))
    );

    const updateOrderStatus = async (targetOrderId, newStatus) => {
      if (!targetOrderId) return;
      await Order.findByIdAndUpdate(targetOrderId, { status: newStatus });
    };

    if (existingTask) {
      const oldTask = await Task.findById(existingTask._id);
      oldTask.status = "reassigned";
      oldTask.wasReassigned = true;
      oldTask.history.push({ action: "reassigned", by: req.user._id, to: staffId, note: remarks || "Reassigned to new staff" });
      await oldTask.save();

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
        history: [{ action: "assigned (reassign)", by: req.user._id, to: staffId, note: remarks || "Reassigned task" }],
      });

      order.tasks.push(newTask._id);
      await order.save();
      await updateOrderStatus(itemId || orderId, stage);

      return res.json({ success: true, message: "Task reassigned successfully", task: newTask });
    } else {
      const newTask = await Task.create({
        order: orderId,
        stage,
        assignedTo: staffId,
        assignedBy: req.user._id,
        deadline,
        remarks,
        itemId: itemId || null,
        status: "pending",
        history: [{ action: "assigned", by: req.user._id, to: staffId, note: remarks || "First assignment" }],
      });

      order.tasks.push(newTask._id);
      await order.save();
      await updateOrderStatus(itemId || orderId, stage);

      return res.status(201).json({ success: true, message: "Task assigned successfully", task: newTask });
    }
  } catch (err) {
    console.error("Error assigning task:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ------------------ OTHER TASK OPERATIONS ------------------

export const getAllTasks = async (req, res) => {
  try {
    const { status, stage, assignedTo } = req.query;
    const filter = { ...(status && { status }), ...(stage && { stage }), ...(assignedTo && { assignedTo }) };

    const tasks = await Task.find(filter)
      .populate("order", "orderNo customer service expectedDate")
      .populate("assignedTo", "name role mobile")
      .populate("assignedBy", "name role")
      .sort({ createdAt: -1 });

    res.json({ success: true, tasks, count: tasks.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getTasksByStaff = async (req, res) => {
  try {
    const { staffId } = req.params;
    const { status } = req.query;
    const filter = { assignedTo: staffId, ...(status && { status }) };

    const tasks = await Task.find(filter)
      .populate("order", "orderNo customer service expectedDate")
      .populate("assignedBy", "name role")
      .sort({ deadline: 1, createdAt: -1 });

    res.json({ success: true, tasks, count: tasks.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ------------------ UPDATE TASK STATUS ------------------

export const updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status, remarks } = req.body;
    const validStatuses = ["pending", "in-progress", "done", "reassigned"];
    if (!validStatuses.includes(status)) return res.status(400).json({ success: false, message: "Invalid status" });

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ success: false, message: "Task not found" });

    const updateData = { status };
    if (status === "in-progress" && !task.startedAt) updateData.startedAt = new Date();
    if (status === "done" && !task.completedAt) updateData.completedAt = new Date();
    if (remarks) updateData.remarks = remarks;

    updateData.$push = {
      history: { action: "status_update", by: req.body.updatedBy || task.assignedBy, note: `Status changed from ${task.status} to ${status}`, at: new Date() },
    };

    const updatedTask = await Task.findByIdAndUpdate(taskId, updateData, { new: true })
      .populate("assignedTo", "name role")
      .populate("assignedBy", "name role")
      .populate("order", "orderNo customer");

    res.json({ success: true, message: "Task status updated successfully", task: updatedTask });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ success: false, message: "Task not found" });

    await Order.findByIdAndUpdate(task.order, { $pull: { tasks: taskId } });
    await Task.findByIdAndDelete(taskId);

    res.json({ success: true, message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ------------------ ORDERS CREATION ------------------

async function getNextOrderNo() {
  const lastOrder = await Order.findOne({ parentOrder: null }).sort({ createdAt: -1 }).lean();
  if (!lastOrder) return "ORD-001";
  const lastNo = parseInt(lastOrder.orderNo.split("-")[1] || "0", 10);
  return `ORD-${String(lastNo + 1).padStart(3, "0")}`;
}


// Helper function to get next order number
// const getNextOrderNo = async () => {
//   const lastOrder = await Order.findOne().sort({ createdAt: -1 });
//   if (!lastOrder) return "ORD001";
  
//   const lastNo = parseInt(lastOrder.orderNo.replace(/\D/g, ""));
//   return `ORD${String(lastNo + 1).padStart(3, "0")}`;
// };

export const createOrder = async (req, res) => {
  try {
    const customerData = JSON.parse(req.body.customer);
    const itemsData = JSON.parse(req.body.items || "[]");
    const paymentMode = req.body.paymentMode || "Cash";

    // Find or create customer
    let existingCustomer = await Customer.findOne({ phone: customerData.phone });
    if (!existingCustomer) existingCustomer = await Customer.create(customerData);

    // Find service
    const service = await Service.findOne({ 
      _id: req.body.serviceId, 
      category: req.body.category 
    });
    if (!service) return res.status(404).json({ message: "Service not found" });

    // Process design files
    const designFiles = {};
    req.files?.forEach((file) => {
      const idx = file.fieldname.split("_")[1];
      designFiles[idx] = `/uploads/design/${file.filename}`;
    });

    const orders = [];
    const nextOrderNo = await getNextOrderNo();

    // Create main order (first item)
    const firstItem = itemsData[0];
    const mainPaymentDoc = await Payment.create({
      totalAmount: Number(firstItem.totalAmount) || 0,
      advanceAmount: Number(firstItem.advanceAmount) || 0,
      extraCharges: {
        amount: Number(firstItem.extraCharges?.amount) || 0,
        note: firstItem.extraCharges?.note || "",
      },
      paymentMode: paymentMode,
      status: "Pending",
    });

    const mainOrder = new Order({
      customer: existingCustomer._id,
      service: service._id,
      measurements: firstItem.measurements || [],
      designImage: designFiles[0] || null,
      color: firstItem.color || "",
      rawMaterial: firstItem.rawMaterial,
      expectedDate: req.body.expectedDate,
      payment: mainPaymentDoc._id,
      orderNo: nextOrderNo,
      parentOrder: null,
    });
    await mainOrder.save();
    orders.push(mainOrder);

    // Create sub-orders (remaining items)
    for (let i = 1; i < itemsData.length; i++) {
      const item = itemsData[i];
      
      // Create separate payment for each sub-order
      const subPaymentDoc = await Payment.create({
        totalAmount: Number(item.totalAmount) || 0,
        advanceAmount: Number(item.advanceAmount) || 0,
        extraCharges: {
          amount: Number(item.extraCharges?.amount) || 0,
          note: item.extraCharges?.note || "",
        },
        paymentMode: paymentMode,
        status: "Pending",
      });

      const subOrder = new Order({
        customer: existingCustomer._id,
        service: service._id,
        measurements: item.measurements,
        designImage: designFiles[i] || null,
        color: item.color || "",
        rawMaterial: item.rawMaterial,
        expectedDate: req.body.expectedDate,
        payment: subPaymentDoc._id,
        orderNo: `${nextOrderNo}/${i}`,
        parentOrder: mainOrder._id,
      });
      await subOrder.save();
      orders.push(subOrder);
    }

    // Calculate grand totals for response
    const grandTotal = itemsData.reduce((sum, item) => {
      return sum + (Number(item.totalAmount) || 0) + (Number(item.extraCharges?.amount) || 0);
    }, 0);

    const totalAdvance = itemsData.reduce((sum, item) => {
      return sum + (Number(item.advanceAmount) || 0);
    }, 0);

    res.status(201).json({ 
      message: "✅ Order(s) created successfully", 
      orders,
      summary: {
        grandTotal,
        totalAdvance,
        remainingBalance: grandTotal - totalAdvance,
        itemCount: itemsData.length,
      }
    });
  } catch (error) {
    console.error("❌ Error creating order:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// ------------------ ORDERS FETCH ------------------
export const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const order = await Order.findById(id).populate("payment");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (updateData.category) order.category = updateData.category;

    // ✅ Handle service ID or name
    if (updateData.service) {
      if (mongoose.Types.ObjectId.isValid(updateData.service)) {
        order.service = updateData.service;
      } else {
        const serviceDoc = await Service.findOne({ name: updateData.service });
        if (!serviceDoc) {
          return res
            .status(400)
            .json({ message: `Service "${updateData.service}" not found` });
        }
        order.service = serviceDoc._id;
      }
    }

    if (updateData.color) order.color = updateData.color;
    if (updateData.expectedDate) order.expectedDate = updateData.expectedDate;

    // ✅ Auto-correct status casing (e.g. "handworking" → "Handworking")
    if (updateData.status) {
      const formattedStatus = updateData.status
        .trim()
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter of each word
      order.status = formattedStatus;
    }

    if (updateData.rawMaterial) {
      order.rawMaterial = {
        cloth: updateData.rawMaterial.cloth || false,
        lining: updateData.rawMaterial.lining || false,
      };
    }

    if (updateData.measurements && Array.isArray(updateData.measurements)) {
      order.measurements = updateData.measurements;
    }

    // ✅ Payment update logic
    if (updateData.payment && order.payment) {
      const payment = await Payment.findById(order.payment);
      if (payment) {
        payment.totalAmount =
          updateData.payment.totalAmount ?? payment.totalAmount;
        payment.advanceAmount =
          updateData.payment.advanceAmount ?? payment.advanceAmount;

        if (updateData.payment.extraCharges) {
          payment.extraCharges = {
            amount: updateData.payment.extraCharges.amount || 0,
            note: updateData.payment.extraCharges.note || "",
          };
        }

        const totalDue = payment.totalAmount + (payment.extraCharges?.amount || 0);
        const totalPaid = payment.advanceAmount;

        if (totalPaid >= totalDue) payment.status = "Completed";
        else if (totalPaid > 0) payment.status = "Partial";
        else payment.status = "Pending";

        await payment.save();
      }
    }

    await order.save();

    const updatedOrder = await Order.findById(id)
      .populate("customer")
      .populate("service")
      .populate("payment");

    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({
      success: false,
      message: "Error updating order",
      error: error.message,
    });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("customer")
      .populate("service")
      .populate("payment")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error });
  }
};


export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("customer")
      .populate("service")
      .populate("payment");
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Error fetching order", error });
  }
};

// ------------------ SERVICES ------------------

export const getCategories = async (req, res) => {
  try {
    const categories = await Service.aggregate([
      { $group: { _id: "$category", services: { $push: { _id: "$_id", name: "$name", measurements: "$measurements" } } } },
      { $project: { _id: 0, category: "$_id", services: 1 } },
    ]);
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: "Error fetching categories", error: err.message });
  }
};

export const getServicesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const services = await Service.find({ category }).select("name measurements");
    if (!services.length) return res.status(404).json({ message: "No services found for this category" });
    res.json({ category, services });
  } catch (err) {
    res.status(500).json({ message: "Error fetching services", error: err.message });
  }
};

export const createService = async (req, res) => {
  try {
    const { name, category, measurements } = req.body;
    const service = new Service({ name, category, measurements });
    await service.save();
    res.status(201).json(service);
  } catch (err) {
    res.status(500).json({ message: "Error creating service", error: err.message });
  }
};

// 🔍 Controller: Search existing customers by name or phone
export const searchCustomers = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.json([]);

    const regex = new RegExp(query, "i"); // case-insensitive
    const customers = await Customer.find({
      $or: [{ name: regex }, { phone: regex }],
    })
      .limit(10)
      .sort({ name: 1 });

    res.status(200).json(customers);
  } catch (error) {
    console.error("Error searching customers:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: "Error fetching services", error });
  }
};

// ✅ Add new service (multiple categories allowed)
export const addService = async (req, res) => {
  try {
    const { name, category, measurements } = req.body;

    if (!name || !category || category.length === 0) {
      return res.status(400).json({ message: "Name and at least one category required" });
    }

    const newService = new Service({ name, category, measurements });
    await newService.save();

    res.status(201).json({ message: "Service added successfully", service: newService });
  } catch (error) {
    res.status(500).json({ message: "Error adding service", error });
  }
};

// ✅ Update service
export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, measurements } = req.body;

    const updatedService = await Service.findByIdAndUpdate(
      id,
      { name, category, measurements },
      { new: true }
    );

    if (!updatedService) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.status(200).json({ message: "Service updated successfully", service: updatedService });
  } catch (error) {
    res.status(500).json({ message: "Error updating service", error });
  }
};

// ✅ Delete service
export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedService = await Service.findByIdAndDelete(id);

    if (!deletedService) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.status(200).json({ message: "Service deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting service", error });
  }
};
