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
    assignedTo: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Staff", 
        required: true 
    },
    // Add this field to fix the population error
    assignedBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Staff", // Reference to the staff model
        required: true 
    },
    deadline: Date,
    status: { 
        type: String, 
        enum: ["pending", "in-progress", "done"], 
        default: "pending" 
    },
    startedAt: Date,
    completedAt: Date,
    remarks: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);