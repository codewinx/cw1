const mongoose = require("mongoose");
// controllers/customerController.js
const Customer = require("../models/Customer");
const Measurement = require("../models/Measurement"); // Import the Measurement model
const Order = require("../models/Order");
exports.createCustomer = async (req, res) => {
  try {
    const { name, email, phone, address, gender, measurements, category } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ message: "Name and phone are required" });
    }

    const newCustomer = new Customer({
      name,
      email,
      phone,
      address,
      gender,
      createdBy: req.user._id,
    });

    await newCustomer.save();

    if (measurements && measurements.length > 0) {
      const newMeasurement = new Measurement({
        customer: newCustomer._id,
        category: category || "General",
        data: measurements,
        createdBy: req.user._id,
      });
      await newMeasurement.save();
    }

    res.status(201).json({
      message: "Customer created successfully",
      customer: newCustomer,
    });
  } catch (error) {
    console.error("Error creating customer:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Search customers by name or ID
exports.searchCustomers = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    let searchConditions = [
      { name: { $regex: query, $options: "i" } } // name search
    ];

    // ✅ Only add _id search if query is a valid ObjectId
    if (mongoose.Types.ObjectId.isValid(query)) {
      searchConditions.push({ _id: query });
    }

    const customers = await Customer.find({
      $or: searchConditions
    }).limit(10);

    res.json(customers);
  } catch (error) {
    console.error("Error searching customers:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// Get customers with order numbers
exports.getCustomers = async (req, res) => {
  try {
    const { search } = req.query;
    let filter = {};

    if (search) {
      filter = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { phone: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { _id: search },
        ],
      };
    }

    const customers = await Customer.find(filter)
      .populate("createdBy", "name") // ✅ fetch Staff name
      .lean();

 const customerData = await Promise.all(
  customers.map(async (customer) => {
    const orders = await Order.find({ customer: customer._id }).select("orderNo");
    return {
      name: customer.name,  // ✅ keep only name
      phone: customer.phone,

      email: customer.email || "-",
      address: customer.address || "-",
      gender: customer.gender || "-",
      dateAdded: customer.createdAt,
      createdBy: customer.createdBy?.name || "Unknown",
      orders: orders.length > 0 ? orders.map((o) => o.orderNo).join(", ") : "No Orders", // ✅ safe
    };
  })
);



    res.status(200).json(customerData);
  } catch (error) {
    res.status(500).json({ message: "Error fetching customers", error: error.message });
  }
};