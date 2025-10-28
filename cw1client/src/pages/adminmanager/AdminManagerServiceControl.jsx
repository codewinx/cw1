import React, { useEffect, useState } from "react";
import {
  getServices,
  addService,
  updateService,
  deleteService,
} from "../../api/service.js";
import { Pencil, Trash2, Plus } from "lucide-react";

const categoriesList = ["Stitching", "Handworking", "Saree", "Altering"];

export default function AdminManageServiceControl() {
  const [services, setServices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: [],
    measurements: "",
  });

  // Fetch all services
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const data = await getServices();
      setServices(data);
    } catch (error) {
      console.error("Failed to fetch services:", error);
    }
  };

  // Handle category checkbox selection
  const handleCategoryChange = (cat) => {
    setFormData((prev) => {
      const exists = prev.category.includes(cat);
      if (exists) {
        return { ...prev, category: prev.category.filter((c) => c !== cat) };
      } else {
        return { ...prev, category: [...prev.category, cat] };
      }
    });
  };

  // Add or Update service
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        measurements: formData.measurements
          .split(",")
          .map((m) => m.trim())
          .filter((m) => m),
      };

      if (editingService) {
        await updateService(editingService._id, payload);
      } else {
        await addService(payload);
      }

      setShowModal(false);
      setEditingService(null);
      setFormData({ name: "", category: [], measurements: "" });
      fetchServices();
    } catch (error) {
      console.error("Error saving service:", error);
    }
  };

  // Delete service
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        await deleteService(id);
        fetchServices();
      } catch (error) {
        console.error("Error deleting service:", error);
      }
    }
  };

  // Edit service
  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      category: service.category || [],
      measurements: (service.measurements || []).join(", "),
    });
    setShowModal(true);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Manage Services</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={18} /> Add Service
        </button>
      </div>

      {/* Service Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        {services.length > 0 ? (
          services.map((service) => (
            <div
              key={service._id}
              className="border rounded-lg p-4 shadow-sm bg-white"
            >
              <h2 className="text-lg font-semibold">{service.name}</h2>
              <p className="text-sm text-gray-600">
                Categories:{" "}
                {Array.isArray(service.category)
                  ? service.category.join(", ")
                  : service.category}
              </p>
              {service.measurements?.length > 0 && (
                <p className="text-sm mt-1 text-gray-700">
                  Measurements: {service.measurements.join(", ")}
                </p>
              )}
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handleEdit(service)}
                  className="flex items-center justify-center gap-1 px-3 py-1 border rounded-md text-blue-600 border-blue-600 hover:bg-blue-50"
                >
                  <Pencil size={16} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(service._id)}
                  className="flex items-center justify-center gap-1 px-3 py-1 border rounded-md text-red-600 border-red-600 hover:bg-red-50"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No services found.</p>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
            <h2 className="text-xl font-semibold mb-4">
              {editingService ? "Edit Service" : "Add Service"}
            </h2>
            <form onSubmit={handleSubmit}>
              {/* Name */}
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full border rounded p-2 focus:outline-none focus:ring focus:ring-blue-200"
                  required
                />
              </div>

              {/* Categories */}
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">
                  Categories
                </label>
                <div className="flex flex-wrap gap-2">
                  {categoriesList.map((cat) => (
                    <label
                      key={cat}
                      className="flex items-center space-x-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={formData.category.includes(cat)}
                        onChange={() => handleCategoryChange(cat)}
                      />
                      <span>{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Measurements */}
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">
                  Measurements (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.measurements}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      measurements: e.target.value,
                    })
                  }
                  className="w-full border rounded p-2 focus:outline-none focus:ring focus:ring-blue-200"
                  placeholder="Waist, Length, Chest, Hip"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingService(null);
                    setFormData({ name: "", category: [], measurements: "" });
                  }}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingService ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
