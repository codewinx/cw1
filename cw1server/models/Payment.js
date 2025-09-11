const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    order: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Order", 
      required: true 
    }, // 🔗 link to order

    amount: { type: Number, required: true }, // how much paid in this transaction

    method: {
      type: String,
      enum: ["cash", "card", "qr", "upi", "other"],
      required: true,
    },

    transactionId: { type: String }, // for UPI/Card/Online

    remarks: { type: String }, // optional notes like "Advance", "Final Payment"

    collectedBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Staff" 
    }, // who received payment

    paymentDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
