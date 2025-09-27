import Service from "../models/Service.js";

// 📌 Get all unique categories
// 📌 Get all categories with services + measurements
// Get all categories with their services + measurements
// 📌 Get all categories with services + measurements
export const getCategories = async (req, res) => {
  try {
    const categories = await Service.aggregate([
      {
        $group: {
          _id: "$category",
          services: {
            $push: { _id: "$_id", name: "$name", measurements: "$measurements" }
          }
        }
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          services: 1
        }
      }
    ]);

    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: "Error fetching categories", error: err.message });
  }
};



// 📌 Get services by category
export const getServicesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const services = await Service.find({ category }).select("name measurements");

    if (!services.length) {
      return res.status(404).json({ message: "No services found for this category" });
    }

    res.json({ category, services });
  } catch (err) {
    res.status(500).json({ message: "Error fetching services", error: err.message });
  }
};

// 📌 Create new service (optional, for admin panel seeding)
export const createService = async (req, res) => {
  try {
    const { name, category, measurements } = req.body;

    const service = new Service({
      name,
      category,
      measurements,
    });

    await service.save();
    res.status(201).json(service);
  } catch (err) {
    res.status(500).json({ message: "Error creating service", error: err.message });
  }
};
