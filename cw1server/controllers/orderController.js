// controllers/orderController.js
const Order = require("../models/Order");
const Counter = require("../models/Counter");
const Measurement = require("../models/Measurement"); // Import the Measurement model

// Create Order
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
      measurementId, // This is the ID of the selected measurement profile
    } = req.body;

    // Basic validation for required order fields
    if (!customer || !category || !service || !totalAmount) {
      return res.status(400).json({
        message: "Customer, category, service, and totalAmount are required",
      });
    }

    // Backend validation to ensure a measurement profile is provided
    if (!measurementId) {
      return res.status(400).json({
        message: "A measurement profile must be selected for this order.",
      });
    }

    // Get or create the order counter and increment its value
    const counter = await Counter.findOneAndUpdate(
      { name: "orderNo" },
      { $inc: { value: 1 } },
      { new: true, upsert: true }
    );

    const orderNo = counter.value;

    // Calculate the pending amount based on total, advance, and extra charges
    const pendingAmount =
      parseFloat(totalAmount) - (parseFloat(advanceAmount) || 0) + (parseFloat(extraCharges) || 0);

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
      measurement: measurementId, // Link the measurement profile to the order
      createdBy: req.user._id, // Assumes req.Staff._id is set by auth middleware
    });

    await newOrder.save();

    res.status(201).json({
      message: "Order created successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all orders (with filters and search)
exports.getOrders = async (req, res) => {
  try {
    const { search, status, startDate, endDate } = req.query;
    let filter = {};

    if (search) {
      filter = {
        $or: [
          { orderNo: isNaN(search) ? undefined : Number(search) },
          { category: { $regex: search, $options: "i" } },
          { service: { $regex: search, $options: "i" } },
          // You can't search by customer name directly here unless you use aggregation
          // which is more complex. The current approach with populate is fine for display.
        ].filter(Boolean),
      };
    }

    if (status && status !== "all") {
      filter.status = status.toLowerCase();
    }

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) {
        // Find orders created on or after the start date
        filter.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        // Find orders created on or before the end date
        filter.createdAt.$lte = new Date(endDate);
      }
    }

    const orders = await Order.find(filter)
      .populate("customer", "name phone")
      .populate("createdBy", "name")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error: error.message });
  }
};


// Get single order
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("customer", "name phone email")
      .populate("createdBy", "name");

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Error fetching order", error: error.message });
  }
};

// Update order
exports.updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Error updating order", error: error.message });
  }
};

// Delete order
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting order", error: error.message });
  }
};