const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderNo: {
      type: String,
      required: true,
      unique: true, // globally unique across all orders (main + sub)
    },
    parentOrder: {
      type: mongoose.Schema.Types.ObjectId, // null → main order, set → suborder
      ref: "Order",
      default: null,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    measurements: [
      {
        fieldName: { type: String },
        value: { type: String },
      },
    ],
    designImage: { type: String },
    color: { type: String },
    rawMaterial: {
      cloth: { type: Boolean, default: false },
      lining: { type: Boolean, default: false },
    },
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
    expectedDate: { type: Date, required: true },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      required: true,
    },
    status: {
      type: String,
      enum: [
        "Placed",
        "Cutting",
        "Handworking",
        "Stitching",
        "Quality Check",
        "Ready to Deliver",
        "Delivered",
      ],
      default: "Placed",
    },
  },
  { timestamps: true }
);

// ❌ REMOVE the pre("save") hook
// Controller now fully manages main/sub order numbers.

module.exports = mongoose.model("Order", orderSchema);
