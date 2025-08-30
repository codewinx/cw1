// models/Order.js
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
orderNo: {
  type: Number,
  required: true,
  unique: true
},

    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
    category: { type: String, required: true },
    service: { type: String, required: true },
    design: String,
    rawMaterial: {
      isProvided: { type: Boolean, default: false },
      name: String,
      price: Number,
    },
    expectedDate: Date,

    // Payment
    totalAmount: { type: Number, required: true },
    advanceAmount: { type: Number, default: 0 },
    pendingAmount: { type: Number, default: 0 },
    extraCharges: { type: Number, default: 0 },
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "qr", "upi", "other"],
      default: "cash",
    },

    // Workflow
    status: {
      type: String,
      enum: ["placed", "cutting", "handworking", "tailoring", "finishing", "qualifying", "completed"],
      default: "placed",
    },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
