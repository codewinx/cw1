const Measurement = require("../models/Measurement");

// @desc    Get all measurement profiles for a specific customer
// @route   GET /api/measurement/customer/:customerId
// @access  Private (Admin/Staff)
exports.getMeasurementsByCustomerId = async (req, res) => {
  try {
    const measurements = await Measurement.find({ customer: req.params.customerId });
    res.status(200).json(measurements);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Create a new measurement profile
// @route   POST /api/measurement
// @access  Private (Admin/Staff)
exports.createMeasurement = async (req, res) => {
  try {
    const { customerId, category, data } = req.body;

    if (!customerId || !category || !data || data.length === 0) {
      return res
        .status(400)
        .json({ message: "Customer ID, category, and data are required." });
    }

    const newMeasurement = new Measurement({
      customer: customerId,
      category,
      data,
      createdBy: req.user._id, // ✅ fixed
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

// @desc    Update an existing measurement profile
// @route   PUT /api/measurement/:id
// @access  Private (Admin/Staff)
exports.updateMeasurement = async (req, res) => {
  try {
    const { data } = req.body;
    const { id } = req.params;

    if (!data || data.length === 0) {
      return res.status(400).json({ message: "Measurement data is required." });
    }

    const updatedMeasurement = await Measurement.findByIdAndUpdate(
      id,
      { data },
      { new: true, runValidators: true }
    );

    if (!updatedMeasurement) {
      return res.status(404).json({ message: "Measurement not found." });
    }

    res.status(200).json({
      message: "Measurement updated successfully",
      measurement: updatedMeasurement,
    });
  } catch (error) {
    console.error("Error updating measurement:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
