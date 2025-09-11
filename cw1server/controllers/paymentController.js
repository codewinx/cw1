// controllers/paymentController.js
const Payment = require("../models/Payment");
const Order = require("../models/Order");

// 🔹 Add a new payment
exports.addPayment = async (req, res) => {
  try {
    const { orderNo, amount, method, remarks, transactionId, collectedBy } = req.body;

    // Find the order by orderNo
    const order = await Order.findOne({ orderNo });
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Create new payment
    const payment = new Payment({
      order: order._id,
      amount,
      method,
      remarks,
      transactionId,
      collectedBy,
    });
    await payment.save();

    // Update order summary
    order.advanceAmount += amount;
    order.pendingAmount = order.totalAmount - (order.advanceAmount + order.extraCharges);
    await order.save();

    res.status(201).json({ message: "Payment added successfully", payment, order });
  } catch (error) {
    res.status(500).json({ message: "Error adding payment", error: error.message });
  }
};

// 🔹 Get payments by order number
exports.getPaymentsByOrderNo = async (req, res) => {
  try {
    const { orderNo } = req.params;

    const order = await Order.findOne({ orderNo }).populate("customer");
    if (!order) return res.status(404).json({ message: "Order not found" });

    const payments = await Payment.find({ order: order._id }).populate("collectedBy");

    res.status(200).json({ order, payments });
  } catch (error) {
    res.status(500).json({ message: "Error fetching payments", error: error.message });
  }
};

// 🔹 Update a payment
exports.updatePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, method, remarks, transactionId } = req.body;

    const payment = await Payment.findById(id);
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    // update payment values
    payment.amount = amount ?? payment.amount;
    payment.method = method ?? payment.method;
    payment.remarks = remarks ?? payment.remarks;
    payment.transactionId = transactionId ?? payment.transactionId;
    await payment.save();

    // update order summary again
    const order = await Order.findById(payment.order);
    const payments = await Payment.find({ order: order._id });
    const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);

    order.advanceAmount = totalPaid;
    order.pendingAmount = order.totalAmount - (order.advanceAmount + order.extraCharges);
    await order.save();

    res.status(200).json({ message: "Payment updated", payment, order });
  } catch (error) {
    res.status(500).json({ message: "Error updating payment", error: error.message });
  }
};
