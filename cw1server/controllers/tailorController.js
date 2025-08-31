const mongoose = require("mongoose");
const Order = require("../models/Order");
const Measurement = require("../models/Measurement");

const getOrders = async (req, res) => {
  try {
    
    const orders = await Order.find()
      .select("orderNo status category service expectedDate") 
    //   .populate("customer", "name phone") // populate customer info
    //   .populate("createdBy", "username role"); // who created

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (err) {
    console.error("Error fetching tailor orders:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
const getMeasurementsByOrderId = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ success: false, message: "Invalid orderId" });
    }

   
    const measurements = await Measurement.find({ order: orderId })
      .populate("customer", "name phone")
      .select("category data createdAt");

    if (!measurements || measurements.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No measurements found for this order",
      });
    }

    res.status(200).json({
      success: true,
      count: measurements.length,
      data: measurements,
    });
  } catch (err) {
    console.error("Error fetching measurements:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body; // new status from request body

    // validate orderId
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ success: false, message: "Invalid orderId" });
    }

    // validate status
    const allowedStatuses = [
      "placed",
      "cutting",
      "handworking",
      "tailoring",
      "finishing",
      "qualifying",
      "completed",
    ];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true, runValidators: true }
    ).select("orderNo category service expectedDate status");

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: order,
    });
  } catch (err) {
    console.error("Error updating order status:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = {
  getOrders,
  getMeasurementsByOrderId,
  updateOrderStatus,
};
