import React, { useState } from "react";
import { createCustomer } from "../../api/customer"; 
import { PlusCircle, MinusCircle } from "lucide-react"; // Import icons

const AdminAddCustomer = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    gender: "",
  });

  const [message, setMessage] = useState("");
  const [showMeasurements, setShowMeasurements] = useState(false);
  const [measurements, setMeasurements] = useState([{ key: "", value: "" }]);

  // Handle customer form input changes
  const handleCustomerChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle measurement input changes
  const handleMeasurementChange = (index, e) => {
    const newMeasurements = [...measurements];
    newMeasurements[index][e.target.name] = e.target.value;
    setMeasurements(newMeasurements);
  };

  // Add a new measurement row
  const addMeasurementRow = () => {
    setMeasurements([...measurements, { key: "", value: "" }]);
  };

  // Remove a measurement row
  const removeMeasurementRow = (index) => {
    const newMeasurements = measurements.filter((_, i) => i !== index);
    setMeasurements(newMeasurements);
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = { ...formData };
      
      // Conditionally add measurements to the data if the toggle is on
      if (showMeasurements) {
        dataToSend.measurements = measurements.filter(m => m.key && m.value);
      }
      
      const data = await createCustomer(dataToSend);
      setMessage(data.message || "Customer added successfully!");
      
      // Reset all form states
      setFormData({ name: "", email: "", phone: "", address: "", gender: "" }); 
      setMeasurements([{ key: "", value: "" }]);
      setShowMeasurements(false);
    } catch (error) {
      setMessage(error.message || "Something went wrong while adding customer");
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Add Customer</h2>

      {message && (
        <p className="mb-3 text-sm text-blue-600 font-medium">{message}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={formData.name}
          placeholder="Customer Name"
          onChange={handleCustomerChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          placeholder="Email"
          onChange={handleCustomerChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="phone"
          value={formData.phone}
          placeholder="Phone Number"
          onChange={handleCustomerChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          name="address"
          value={formData.address}
          placeholder="Address"
          onChange={handleCustomerChange}
          className="w-full border p-2 rounded"
        />
        <select
          name="gender"
          value={formData.gender}
          onChange={handleCustomerChange}
          className="w-full border p-2 rounded"
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        {/* --- Measurements Section --- */}
        <div className="border-t pt-4 mt-4">
          <div 
            onClick={() => setShowMeasurements(!showMeasurements)} 
            className="flex items-center gap-2 text-blue-600 cursor-pointer mb-3"
          >
            {showMeasurements ? <MinusCircle size={18} /> : <PlusCircle size={18} />}
            <span className="font-semibold">
              {showMeasurements ? "Hide Measurements" : "Add Measurements (Optional)"}
            </span>
          </div>

          {showMeasurements && (
            <div className="space-y-3">
              {measurements.map((measurement, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <input
                    type="text"
                    name="key"
                    value={measurement.key}
                    placeholder="e.g., Chest, Length"
                    onChange={(e) => handleMeasurementChange(index, e)}
                    className="w-1/2 border p-2 rounded"
                  />
                  <input
                    type="text"
                    name="value"
                    value={measurement.value}
                    placeholder="e.g., 36 inches"
                    onChange={(e) => handleMeasurementChange(index, e)}
                    className="w-1/2 border p-2 rounded"
                  />
                  {measurements.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => removeMeasurementRow(index)}
                      className="text-red-500 p-2"
                    >
                      X
                    </button>
                  )}
                </div>
              ))}
              <button 
                type="button" 
                onClick={addMeasurementRow}
                className="w-full bg-gray-200 text-gray-800 p-2 rounded-lg hover:bg-gray-300"
              >
                Add another measurement
              </button>
            </div>
          )}
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
        >
          Save Customer
        </button>
      </form>
    </div>
  );
};

export default AdminAddCustomer;