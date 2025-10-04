// controllers/orderController.js

import Customer from "../models/Customer.js";
import Service from "../models/Service.js";
import Payment from "../models/Payment.js";
import Order from "../models/Order.js";

// 📌 Helper: Get Next Order Number (ORD-001, ORD-002, ...)
async function getNextOrderNo() {
  const lastOrder = await Order.findOne({ parentOrder: null }) // only main orders
    .sort({ createdAt: -1 })
    .lean();

  if (!lastOrder) return "ORD-001";

  const lastNo = parseInt(lastOrder.orderNo.split("-")[1] || "0", 10);
  return `ORD-${String(lastNo + 1).padStart(3, "0")}`;
}

// ✅ Create new Order (with quantity & suborders)
export const createOrder = async (req, res) => {
  try {
    const customerData = JSON.parse(req.body.customer);
    const itemsData = JSON.parse(req.body.items || "[]");
    const paymentData = JSON.parse(req.body.payment);

    // 🔹 Customer
    let existingCustomer = await Customer.findOne({ phone: customerData.phone });
    if (!existingCustomer) {
      existingCustomer = await Customer.create(customerData);
    }

    // 🔹 Service
    const service = await Service.findOne({
      _id: req.body.serviceId,
      category: req.body.category,
    });
    if (!service) return res.status(404).json({ message: "Service not found" });

    // 🔹 Payment
    const paymentDoc = await Payment.create(paymentData);

    // 🔹 Map uploaded design files
    const designFiles = {};
    req.files?.forEach((file) => {
      const idx = file.fieldname.split("_")[1]; // e.g. design_0 → "0"
      designFiles[idx] = `/uploads/design/${file.filename}`;
    });

    const orders = [];

    // 1️⃣ Generate main order number
    const nextOrderNo = await getNextOrderNo();

    // 2️⃣ Create Main Order
    const mainOrder = new Order({
      customer: existingCustomer._id,
      service: service._id,
      measurements: itemsData[0]?.measurements || [],
      designImage: designFiles[0] || null,
      color: itemsData[0]?.color || "",
      rawMaterial: itemsData[0]?.rawMaterial,
      expectedDate: req.body.expectedDate,
      payment: paymentDoc._id,
      orderNo: nextOrderNo, // 👈 assigned here
      parentOrder: null,    // mark as main order
    });
    await mainOrder.save();
    orders.push(mainOrder);

    // 3️⃣ Create Suborders if multiple items
    for (let i = 1; i < itemsData.length; i++) {
      const item = itemsData[i];
      const subOrder = new Order({
        customer: existingCustomer._id,
        service: service._id,
        measurements: item.measurements,
        designImage: designFiles[i] || null,
        color: item.color || "",
        rawMaterial: item.rawMaterial,
        expectedDate: req.body.expectedDate,
        payment: paymentDoc._id,
        orderNo: `${nextOrderNo}/${i}`, // 👈 Suborder number
        parentOrder: mainOrder._id,     // link to main order
      });
      await subOrder.save();
      orders.push(subOrder);
    }

    res.status(201).json({
      message: "✅ Order(s) created successfully",
      orders,
    });
  } catch (error) {
    console.error("❌ Error creating order:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Get all Orders with populate
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("customer")
      .populate("service")
      .populate("payment")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error });
  }
};

// ✅ Get single Order by ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("customer")
      .populate("service")
      .populate("payment");
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Error fetching order", error });
  }
};
