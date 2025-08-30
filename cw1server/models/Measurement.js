const mongoose = require("mongoose");

const measurementSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: false, // optional: if this measurement is tied to a specific order
    },
    category: { type: String, required: true }, // Blouse, Saree, Pants, etc.
    data: [
      {
        key: String,   // Bust, Waist, Length
        value: String, // 36 inch
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Measurement", measurementSchema);
