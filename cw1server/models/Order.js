const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderNo: {
      type: String,
      unique: true, // ✅ no required, hook will always generate it
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    measurements: [
      { fieldName: { type: String }, value: { type: String } },
    ],
    designImage: { type: String }, // store path to uploaded image
    color: { type: String },
    rawMaterial: {
      cloth: { type: Boolean, default: false },
      lining: { type: Boolean, default: false },
    },
    expectedDate: { type: Date, required: true },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      required: true,
    },
    status: {
      type: String,
      enum: [
        "Placed",
        "Cutting",
        "Handworking",
        "Stitching",
        "Quality Check",
        "Ready to Deliver",
        "Delivered",
      ],
      default: "Placed",
    },
  },
  { timestamps: true }
);

// 🔑 Auto-generate orderNo
orderSchema.pre("save", async function (next) {
  if (!this.orderNo) {
    const lastOrder = await this.constructor.findOne().sort({ createdAt: -1 });

    let nextNumber = 1;
    if (lastOrder?.orderNo) {
      const lastNumber = parseInt(lastOrder.orderNo.split("-")[1], 10);
      if (!isNaN(lastNumber)) {
        nextNumber = lastNumber + 1;
      }
    }

    this.orderNo = `ORD-${String(nextNumber).padStart(3, "0")}`;
  }
  next();
});

module.exports = mongoose.model("Order", orderSchema);
