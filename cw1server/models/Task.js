// models/Task.js
const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    stage: {
      type: String,
      enum: ["Cutter", "Tailor", "Handworker"],
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
// ✅ Map Task.stage → Order.status
const stageToOrderStatus = {
  Cutter: "cutting",
  Handworker: "handworking",
  Tailor: "tailoring",
};

// 🔄 Sync Order status automatically when task changes
taskSchema.post("save", async function (doc) {
  try {
    const Order = mongoose.model("Order");
    const Task = mongoose.model("Task");

    const order = await Order.findById(doc.order).populate("tasks");
    if (!order) return;

    // 🔎 Get latest task statuses grouped by stage
    const latestByStage = {};
    for (const t of order.tasks) {
      if (!latestByStage[t.stage] || t.updatedAt > latestByStage[t.stage].updatedAt) {
        latestByStage[t.stage] = t;
      }
    }

    // ✅ Check if all stages are done
    const allStagesDone = ["Cutter", "Handworker", "Tailor"].every(
      (stage) => latestByStage[stage] && latestByStage[stage].status === "done"
    );

    if (allStagesDone) {
      order.status = "quality-check";
    } else {
      // Otherwise → use the current task's stage
      order.status = stageToOrderStatus[doc.stage] || order.status;
    }

    await order.save();
  } catch (err) {
    console.error("Task post-save hook error:", err.message);
  }
});
module.exports = mongoose.model("Task", taskSchema);
