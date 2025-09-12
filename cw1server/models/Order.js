const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderNo: {
      type: Number,
      required: true,
      unique: true,
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

    // 💰 Payment Details
    totalAmount: { type: Number, required: true },
    advanceAmount: { type: Number, default: 0 },
    pendingAmount: { type: Number, default: 0 },
    extraCharges: { type: Number, default: 0 },
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "qr", "upi", "other"],
      default: "cash",
    },

    // 📌 Workflow current status
    status: {
      type: String,
      enum: [
        "placed",          // Order received
        "cutting",         // Cutting stage
        "handworking",     // Handwork stage
        "tailoring",       // Tailoring stage
        "quality-check",   // QC stage
        "ready-to-delivery" // Final stage before delivery
      ],
      default: "placed",
    },

    // 🔗 Relations
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
    measurement: [{ type: mongoose.Schema.Types.ObjectId, ref: "Measurement" }],

    // 📝 Stage-specific updates
    cuttingStage: {
      updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Staff" },
      updatedAt: Date,
    },
    handworkStage: {
      updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Staff" },
      updatedAt: Date,
    },
    tailoringStage: {
      updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Staff" },
      updatedAt: Date,
    },
    finishingStage: {
      updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Staff" },
      updatedAt: Date,
    },
    qualityCheckStage: {
      updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Staff" },
      updatedAt: Date,
    },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Staff" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
