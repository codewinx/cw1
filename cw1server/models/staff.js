const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },

  mobile: {
    type: String,
    required: true,
  },

  address: {
    type: String,
  },

  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
  },

  role: {
    type: String,
    enum: ["Manager", "Cutter", "Tailor", "Handworker"],
    required: true,
  },

  permissions: {
    type: [String],
    default: [],
  },

  salary: {
    type: Number,
    default: 0,
  },

  // Performance & Task Tracking
  performance: {
    totalTasks: { type: Number, default: 0 },
    completedTasks: { type: Number, default: 0 },
    reassignedTasks: { type: Number, default: 0 },
    avgTaskDuration: { type: Number, default: 0 }, // in hours
  },

  // ⭐ New Fields
  starRating: { type: Number, default: 0, min: 0, max: 5 }, 
  profileImage: { type: String, default: "" },  
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
  certified: { type: Boolean, default: false }, 
  experience: { type: Number, default: 0 }, // in years

  // For login access
  username: {
    type: String,
    unique: true,
    sparse: true,
  },

  password: {
    type: String,
  },

  isActive: {
    type: Boolean,
    default: true,
  },

  dateOfJoining: {
    type: Date,
    default: Date.now,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Auto-assign default permissions
staffSchema.pre("save", function (next) {
  if (this.isNew) {
    switch (this.role) {
      case "Manager":
        this.permissions = ["assign_work", "view_reports", "manage_orders"];
        break;
      case "Cutter":
      case "Tailor":
      case "Handworker":
        this.permissions = ["view_tasks", "update_task_status"];
        break;
    }
  }
  next();
});

module.exports = mongoose.model("Staff", staffSchema);
