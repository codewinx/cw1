// models/Task.js
const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    stage: {
  type: String,
  enum: ["Cutter", "Tailor", "Handworker"], // 👈 match Staff role names
  required: true,
},

    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "Staff", required: true },
    deadline: Date,
    status: { type: String, enum: ["pending", "in-progress", "done"], default: "pending" },

    // For tracking history
    startedAt: Date,
    completedAt: Date,
    remarks: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
