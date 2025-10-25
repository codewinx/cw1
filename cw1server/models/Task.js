const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    stage: {
      type: String,
      enum: ["Cutter", "Tailor", "Handworker", "Manager", "admin"],
      required: true,
    },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "Staff", required: true },
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Staff", required: true },
    deadline: Date,
    status: {
      type: String,
      enum: ["pending", "in-progress", "done", "reassigned"],
      default: "pending",
    },
    remarks: String,
    startedAt: Date,
    completedAt: Date,
    isReassigned: { type: Boolean, default: false },
    wasReassigned: { type: Boolean, default: false },
    itemId: { type: mongoose.Schema.Types.ObjectId, default: null }, // Add this field for item tasks
    history: [
      {
        action: String,
        by: { type: mongoose.Schema.Types.ObjectId, ref: "Staff" },
        to: { type: mongoose.Schema.Types.ObjectId, ref: "Staff" },
        note: String,
        at: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// ✅ CORRECTED: Map Task.stage → Order.status using valid enum values
const stageToOrderStatus = {
  Cutter: "Cutting",
  Handworker: "Handworking",
  Tailor: "Tailoring", // Changed from "Stitching" to "Tailoring"
  Manager: "Quality Check",
  admin: "Quality Check",
};

// 🔄 Sync Order status automatically when task changes
taskSchema.post("save", async function (doc) {
  try {
    const Order = mongoose.model("Order");
    const order = await Order.findById(doc.order);
    if (!order) return;

    // ✅ Use the correct status mapping
    const newStatus = stageToOrderStatus[doc.stage];
    if (newStatus && newStatus !== order.status) {
      order.status = newStatus;
      await order.save();
    }
  } catch (err) {
    console.error("Task post-save hook error:", err.message);
  }
});

module.exports = mongoose.model("Task", taskSchema);