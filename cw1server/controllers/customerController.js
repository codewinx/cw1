const Customer = require("../models/Customer");

// Create Customer
exports.createCustomer = async (req, res) => {
  try {
    const { name, email, phone, address, gender } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ message: "Name and phone are required" });
    }

    const newCustomer = new Customer({
      name,
      email,
      phone,
      address,
      gender,
      createdBy: req.user._id, // comes from protect middleware
    });

    await newCustomer.save();

    res.status(201).json({
      message: "Customer created successfully",
      customer: newCustomer,
    });
  } catch (error) {
    console.error("Error creating customer:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
