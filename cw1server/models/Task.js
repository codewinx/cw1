const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    stage: { type: String, enum: ["Cutter", "Tailor", "Handworker"], required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "Staff", required: true },
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Staff", required: true },
    deadline: { type: Date },
    status: { type: String, enum: ["pending", "in-progress", "done"], default: "pending" },
    startedAt: Date,
    completedAt: Date,
    remarks: { type: String, trim: true },
    history: [
      {
        action: String, // assigned, reassigned, status-change
        by: { type: mongoose.Schema.Types.ObjectId, ref: "Staff" },
        to: { type: mongoose.Schema.Types.ObjectId, ref: "Staff" },
        note: String,
        at: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// ✅ Auto push task into Order.tasks
taskSchema.post("save", async function (doc, next) {
  try {
    const Order = mongoose.model("Order");
    await Order.findByIdAndUpdate(doc.order, {
      $addToSet: { tasks: doc._id },
    });
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("Task", taskSchema);
