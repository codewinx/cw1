const mongoose = require("mongoose");

const extraChargesSchema = new mongoose.Schema({
  amount: { type: Number, default: 0 },
  note: { type: String },
});

const paymentSchema = new mongoose.Schema(
  {
    totalAmount: { type: Number, required: true },
    advanceAmount: { type: Number, default: 0 },
    extraCharges: extraChargesSchema,
    paymentMode: {
      type: String,
      enum: ["Cash", "UPI", "Card", "Bank Transfer"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Completed"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
