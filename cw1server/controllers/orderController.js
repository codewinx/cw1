// controllers/orderController.js
const Order = require("../models/Order");
const Counter = require("../models/Counter");
const Measurement = require("../models/Measurement");

// ===============================
// Create Order
// ===============================
exports.createOrder = async (req, res) => {
  try {
    const {
      customer,
      category,
      service,
      design,
      rawMaterial,
      expectedDate,
      totalAmount,
      advanceAmount,
      extraCharges,
      paymentMethod,
      measurementId,
    } = req.body;

    // Basic validation
    if (!customer || !category || !service || !totalAmount) {
      return res.status(400).json({
        success: false,
        message: "Customer, category, service, and totalAmount are required",
      });
    }

    // Measurement check
    if (!measurementId) {
      return res.status(400).json({
        success: false,
        message: "A measurement profile must be selected for this order.",
      });
    }

    // Generate Order Number
    const counter = await Counter.findOneAndUpdate(
      { name: "orderNo" },
      { $inc: { value: 1 } },
      { new: true, upsert: true }
    );

    const orderNo = counter.value;

    // Calculate pending
    const pendingAmount =
      (parseFloat(totalAmount) + (parseFloat(extraCharges) || 0)) -
      (parseFloat(advanceAmount) || 0);

    const newOrder = new Order({
      orderNo,
      customer,
      category,
      service,
      design,
      rawMaterial,
      expectedDate,
      totalAmount,
      advanceAmount,
      extraCharges,
      pendingAmount,
      paymentMethod,
      measurement: measurementId,
      createdBy: req.user._id,
    });

    await newOrder.save();

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({
      success: false,
      message: "Error creating order",
      error: error.message,
    });
  }
};

// ===============================
// Get All Orders (with filters)
// ===============================
exports.getOrders = async (req, res) => {
  try {
    const { search, status, startDate, endDate } = req.query;
    let filter = {};

    if (search) {
      filter = {
        $or: [
          !isNaN(search) ? { orderNo: Number(search) } : null,
          { category: { $regex: search, $options: "i" } },
          { service: { $regex: search, $options: "i" } },
        ].filter(Boolean),
      };
    }

    if (status && status !== "all") {
      filter.status = status.toLowerCase();
    }

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const orders = await Order.find(filter)
      .populate("customer", "name phone")
      .populate("createdBy", "name")
      .populate({
        path: "tasks",
        populate: [
          { path: "assignedTo", select: "name role" },
          { path: "assignedBy", select: "name role" },
        ],
      })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching orders",
      error: error.message,
    });
  }
};

// ===============================
// Get Single Order
// ===============================
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("customer", "name phone email")
      .populate("createdBy", "name")
      .populate({
        path: "tasks",
        populate: [
          { path: "assignedTo", select: "name role" },
          { path: "assignedBy", select: "name role" },
        ],
      });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching order",
      error: error.message,
    });
  }
};

// ===============================
// Update Order
// ===============================
exports.updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating order",
      error: error.message,
    });
  }
};

// ===============================
// Delete Order
// ===============================
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting order",
      error: error.message,
    });
  }
};
