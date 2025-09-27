// Create new Order (with quantity support)

import Customer from "../models/Customer.js";
 import Service from "../models/Service.js";
  import Payment from "../models/Payment.js"; 
  import Order from "../models/Order.js";

export const createOrder = async (req, res) => {
  try {
    const customerData = JSON.parse(req.body.customer);
    const itemsData = JSON.parse(req.body.items || "[]");
    const paymentData = JSON.parse(req.body.payment);
    const quantity = parseInt(req.body.quantity || "1", 10);

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

    // 🔹 Map design files to items
    const designFiles = {};
    req.files?.forEach((file) => {
      const idx = file.fieldname.split("_")[1]; // design_0 → 0
      designFiles[idx] = `/uploads/design/${file.filename}`;
    });

    // 🔹 Create suborders
    const orders = [];
    for (let i = 0; i < itemsData.length; i++) {
      const item = itemsData[i];
      const order = new Order({
        customer: existingCustomer._id,
        service: service._id,
        measurements: item.measurements,
        designImage: designFiles[i] || null,
        color: item.color || "",
        rawMaterial: item.rawMaterial,
        expectedDate: req.body.expectedDate,
        payment: paymentDoc._id,
        orderNo: i === 0 ? undefined : `${Date.now()}/${i + 1}`, // e.g., ORD-001/2
      });
      await order.save();
      orders.push(order);
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





// Get all Orders with populate
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("customer")
      .populate("service")
      .populate("payment");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error });
  }
};

// Get single Order
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
