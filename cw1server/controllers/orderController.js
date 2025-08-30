// controllers/orderController.js
const Order = require("../models/Order");
const Counter = require("../models/Counter");

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
    } = req.body;

    // Basic validation
    if (!customer || !category || !service || !totalAmount) {
      return res.status(400).json({
        message: "Customer, category, service, and totalAmount are required",
      });
    }

    // ✅ Get or create counter and increment
    const counter = await Counter.findOneAndUpdate(
      { name: "orderNo" },
      { $inc: { value: 1 } },
      { new: true, upsert: true } // create if not exists
    );

    const orderNo = counter.value;

    // ✅ Calculate pending amount
    const pendingAmount =
      totalAmount - (advanceAmount || 0) + (extraCharges || 0);

    const newOrder = new Order({
      orderNo, // ✅ Auto-incremented
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
      createdBy: req.user._id, // from protect middleware
    });

    await newOrder.save();

    res.status(201).json({
      message: "Order created successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
