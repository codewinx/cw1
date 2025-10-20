import React, { useState } from "react";
import { createCustomer } from "../../api/admin+manager.js"; 
import { createMeasurement } from "../../api/admin+manager.js"; // ✅ import API
import { PlusCircle, MinusCircle } from "lucide-react";

const AdminManagerAddCustomer = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    gender: "",
    category: "",
  });

  const [customerId, setCustomerId] = useState(null); // ✅ store created customer ID
  const [message, setMessage] = useState("");
  const [showMeasurements, setShowMeasurements] = useState(false);
  const [measurements, setMeasurements] = useState([{ key: "", value: "" }]);
  const [measurementMessage, setMeasurementMessage] = useState("");

  // Handle customer input changes
  const handleCustomerChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMeasurementChange = (index, e) => {
    const newMeasurements = [...measurements];
    newMeasurements[index][e.target.name] = e.target.value;
    setMeasurements(newMeasurements);
  };

  const addMeasurementRow = () => {
    setMeasurements([...measurements, { key: "", value: "" }]);
  };

  const removeMeasurementRow = (index) => {
    const newMeasurements = measurements.filter((_, i) => i !== index);
    setMeasurements(newMeasurements);
  };

  // Save customer
  const handleCustomerSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await createCustomer(formData);
      setMessage(data.message || "Customer added successfully!");
      setCustomerId(data.customer._id); // ✅ store ID for measurements

      // Reset form except category
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        gender: "",
        category: "",
      });
    } catch (error) {
      setMessage(error.message || "Something went wrong while adding customer");
    }
  };

  // Save measurements
  const handleMeasurementSubmit = async () => {
    try {
      if (!customerId) {
        setMeasurementMessage("Please save customer before adding measurements.");
        return;
      }

      const validMeasurements = measurements.filter((m) => m.key && m.value);
      if (!formData.category) {
        setMeasurementMessage("Please enter a measurement category.");
        return;
      }
      if (validMeasurements.length === 0) {
        setMeasurementMessage("Please add at least one valid measurement.");
        return;
      }

      // ✅ Call backend API
      const res = await createMeasurement(customerId, formData.category, validMeasurements);

      setMeasurementMessage(res.message || "Measurements saved successfully!");
      setMeasurements([{ key: "", value: "" }]);
      setFormData({ ...formData, category: "" });
    } catch (error) {
      setMeasurementMessage(error.message || "Something went wrong while saving measurements");
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Add Customer</h2>

      {message && <p className="mb-3 text-sm text-blue-600 font-medium">{message}</p>}

      {/* Customer Form */}
      <form onSubmit={handleCustomerSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input type="text" name="name" value={formData.name} placeholder="Customer Name"
            onChange={handleCustomerChange} className="w-full border p-2 rounded" required />

          <input type="email" name="email" value={formData.email} placeholder="Email"
            onChange={handleCustomerChange} className="w-full border p-2 rounded" />

          <input type="text" name="phone" value={formData.phone} placeholder="Phone Number"
            onChange={handleCustomerChange} className="w-full border p-2 rounded" required />

          <input type="text" name="address" value={formData.address} placeholder="Address"
            onChange={handleCustomerChange} className="w-full border p-2 rounded" />

          <select name="gender" value={formData.gender}
            onChange={handleCustomerChange} className="w-full border p-2 rounded col-span-2">
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <button type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 mt-4">
          Save Customer
        </button>
      </form>

      {/* Measurements Section */}
      <div className="border-t pt-4 mt-6">
        <div onClick={() => setShowMeasurements(!showMeasurements)}
          className="flex items-center gap-2 text-blue-600 cursor-pointer mb-3">
          {showMeasurements ? <MinusCircle size={18} /> : <PlusCircle size={18} />}
          <span className="font-semibold">
            {showMeasurements ? "Hide Measurements" : "Add Measurements (Optional)"}
          </span>
        </div>

        {showMeasurements && (
          <div className="space-y-3 mt-4">
            {measurementMessage && (
              <p className="text-sm text-green-600">{measurementMessage}</p>
            )}

            <input type="text" name="category" value={formData.category}
              placeholder="Measurement Category (e.g., Shirt, Pants)"
              onChange={handleCustomerChange} className="w-full border p-2 rounded" />

            {measurements.map((measurement, index) => (
              <div key={index} className="grid grid-cols-2 gap-2 items-center">
                <input type="text" name="key" value={measurement.key}
                  placeholder="e.g., Chest, Length"
                  onChange={(e) => handleMeasurementChange(index, e)}
                  className="border p-2 rounded" />

                <input type="text" name="value" value={measurement.value}
                  placeholder="e.g., 36 inches"
                  onChange={(e) => handleMeasurementChange(index, e)}
                  className="border p-2 rounded" />
              </div>
            ))}

            <button type="button" onClick={addMeasurementRow}
              className="w-full bg-gray-200 text-gray-800 p-2 rounded-lg hover:bg-gray-300">
              Add another measurement
            </button>

            <button type="button" onClick={handleMeasurementSubmit}
              className="w-full bg-green-600 text-white p-2 rounded-lg hover:bg-green-700">
              Save Measurements
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminManagerAddCustomer;
