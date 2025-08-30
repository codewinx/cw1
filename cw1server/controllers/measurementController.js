const Measurement = require("../models/Measurement");

// 📌 Create Measurement
exports.createMeasurement = async (req, res) => {
  try {
    const { customer, order, category, data } = req.body;

    if (!customer || !category) {
      return res
        .status(400)
        .json({ message: "Customer and category are required" });
    }

    const newMeasurement = new Measurement({
      customer,
      order: order || null, // optional
      category,
      data,
      createdBy: req.user._id, // from auth middleware
    });

    await newMeasurement.save();

    res.status(201).json({
      message: "Measurement created successfully",
      measurement: newMeasurement,
    });
  } catch (error) {
    console.error("Error creating measurement:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 📌 Get All Measurements (with optional filter by customer/order)
exports.getMeasurements = async (req, res) => {
  try {
    const { customer, order } = req.query;

    const filter = {};
    if (customer) filter.customer = customer;
    if (order) filter.order = order;

    const measurements = await Measurement.find(filter)
      .populate("customer", "name email mobile")
      .populate("order", "orderNo category service totalAmount")
      .populate("createdBy", "username email");

    res.status(200).json({ measurements });
  } catch (error) {
    console.error("Error fetching measurements:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 📌 Get Single Measurement by ID
exports.getMeasurementById = async (req, res) => {
  try {
    const measurement = await Measurement.findById(req.params.id)
      .populate("customer", "name email mobile")
      .populate("order", "orderNo category service totalAmount")
      .populate("createdBy", "username email");

    if (!measurement) {
      return res.status(404).json({ message: "Measurement not found" });
    }

    res.status(200).json({ measurement });
  } catch (error) {
    console.error("Error fetching measurement:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 📌 Update Measurement
exports.updateMeasurement = async (req, res) => {
  try {
    const { category, data, order } = req.body;

    const updatedMeasurement = await Measurement.findByIdAndUpdate(
      req.params.id,
      { category, data, order },
      { new: true }
    );

    if (!updatedMeasurement) {
      return res.status(404).json({ message: "Measurement not found" });
    }

    res
      .status(200)
      .json({ message: "Measurement updated", measurement: updatedMeasurement });
  } catch (error) {
    console.error("Error updating measurement:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 📌 Delete Measurement
exports.deleteMeasurement = async (req, res) => {
  try {
    const deletedMeasurement = await Measurement.findByIdAndDelete(
      req.params.id
    );

    if (!deletedMeasurement) {
      return res.status(404).json({ message: "Measurement not found" });
    }

    res.status(200).json({ message: "Measurement deleted successfully" });
  } catch (error) {
    console.error("Error deleting measurement:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
