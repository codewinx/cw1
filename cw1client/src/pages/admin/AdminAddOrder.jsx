import React, { useState, useEffect } from "react";
import { createOrder } from "../../api/order";
import { searchCustomers } from "../../api/customer";
import { getMeasurementsByCustomerId, createMeasurement, updateMeasurement } from "../../api/measurement";
import { XCircle, CheckCircle, Plus, Edit } from "lucide-react";

const AdminAddOrder = () => {
  const [formData, setFormData] = useState({
    customer: "",
    category: "",
    service: "",
    design: "",
    rawMaterial: "",
    expectedDate: "",
    totalAmount: "",
    advanceAmount: "",
    extraCharges: "",
    paymentMethod: "",
  });

  const [suggestions, setSuggestions] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerMeasurements, setCustomerMeasurements] = useState([]);
  const [selectedMeasurement, setSelectedMeasurement] = useState("");
  const [isAddingMeasurement, setIsAddingMeasurement] = useState(false);
  const [newMeasurementData, setNewMeasurementData] = useState([{ key: "", value: "" }]);
  const [isEditingMeasurement, setIsEditingMeasurement] = useState(false);
  const [editedMeasurementData, setEditedMeasurementData] = useState([]);

  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(true);
  const [loading, setLoading] = useState(false);

  // Clear message after a few seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Fetch measurements whenever a new customer is selected
  useEffect(() => {
    const fetchMeasurements = async () => {
      if (selectedCustomer) {
        setLoading(true);
        try {
          const data = await getMeasurementsByCustomerId(selectedCustomer._id);
          setCustomerMeasurements(data);
          if (data.length > 0) {
            setSelectedMeasurement(data[0]._id);
          } else {
            setSelectedMeasurement("");
          }
        } catch (err) {
          setMessage("Failed to fetch measurements for this customer.");
          setIsSuccess(false);
          setCustomerMeasurements([]);
        } finally {
          setLoading(false);
        }
      } else {
        setCustomerMeasurements([]);
        setSelectedMeasurement("");
      }
    };
    fetchMeasurements();
  }, [selectedCustomer]);

  // Update editedMeasurementData when a new measurement is selected
  useEffect(() => {
    if (selectedMeasurement) {
      const measurementToEdit = customerMeasurements.find(m => m._id === selectedMeasurement);
      if (measurementToEdit) {
        setEditedMeasurementData(measurementToEdit.data);
      }
    }
  }, [selectedMeasurement, customerMeasurements]);

  // Handle input changes for main form data
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle new measurement data changes
  const handleNewMeasurementChange = (index, e) => {
    const newMeasurements = [...newMeasurementData];
    newMeasurements[index][e.target.name] = e.target.value;
    setNewMeasurementData(newMeasurements);
  };
  
  // Add a new measurement row
  const addMeasurementRow = () => {
    setNewMeasurementData([...newMeasurementData, { key: "", value: "" }]);
  };
  
  // Remove a measurement row
  const removeMeasurementRow = (index) => {
    const newMeasurements = newMeasurementData.filter((_, i) => i !== index);
    setNewMeasurementData(newMeasurements);
  };
  
  // Handle editing measurement data changes
  const handleEditedMeasurementChange = (index, e) => {
    const updatedMeasurements = [...editedMeasurementData];
    updatedMeasurements[index][e.target.name] = e.target.value;
    setEditedMeasurementData(updatedMeasurements);
  };
  
  // Add an edit measurement row
  const addEditedMeasurementRow = () => {
    setEditedMeasurementData([...editedMeasurementData, { key: "", value: "" }]);
  };
  
  // Remove an edit measurement row
  const removeEditedMeasurementRow = (index) => {
    const updatedMeasurements = editedMeasurementData.filter((_, i) => i !== index);
    setEditedMeasurementData(updatedMeasurements);
  };
  

  // Handle customer search
  const handleCustomerSearch = async (e) => {
    const value = e.target.value;
    setFormData({ ...formData, customer: value });
    setSelectedCustomer(null);

    // Only search if the query is not empty
    if (value.length > 0) {
      try {
        const results = await searchCustomers(value);
        setSuggestions(results);
      } catch (err) {
        console.error("Error fetching customers:", err);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  // Select customer from dropdown
  const handleSelectCustomer = (customer) => {
    setFormData({ ...formData, customer: customer.name });
    setSelectedCustomer(customer);
    setSuggestions([]);
  };

  // Handle measurement selection
  const handleMeasurementChange = (e) => {
    setSelectedMeasurement(e.target.value);
    setIsEditingMeasurement(false); // Hide edit form on selection change
  };
  
  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCustomer) {
      setMessage("Please select a customer.");
      setIsSuccess(false);
      return;
    }
    
    if (customerMeasurements.length > 0 && !selectedMeasurement && !isEditingMeasurement) {
      setMessage("Please select a measurement profile for this order.");
      setIsSuccess(false);
      return;
    }
    
    let finalMeasurementId = null;

    if (isAddingMeasurement) {
      const validMeasurements = newMeasurementData.filter(m => m.key && m.value);
      if (validMeasurements.length === 0) {
        setMessage("Please fill in the new measurement details.");
        setIsSuccess(false);
        return;
      }
      
      try {
        const newMeasurement = await createMeasurement(selectedCustomer._id, formData.category, validMeasurements);
        finalMeasurementId = newMeasurement.measurement._id;
        setMessage("New measurement added successfully!");
        setIsSuccess(true);
        setIsAddingMeasurement(false);
      } catch (err) {
        setMessage(err.message || "Error adding new measurement. Please try again.");
        setIsSuccess(false);
        return;
      }
    } else if (isEditingMeasurement) {
      const validMeasurements = editedMeasurementData.filter(m => m.key && m.value);
      if (validMeasurements.length === 0) {
        setMessage("Edited measurement cannot be empty.");
        setIsSuccess(false);
        return;
      }
      
      try {
        await updateMeasurement(selectedMeasurement, validMeasurements);
        finalMeasurementId = selectedMeasurement;
        setMessage("Measurement updated successfully!");
        setIsSuccess(true);
        setIsEditingMeasurement(false);
      } catch (err) {
        setMessage(err.message || "Error updating measurement. Please try again.");
        setIsSuccess(false);
        return;
      }
    } else {
      finalMeasurementId = selectedMeasurement;
    }

    try {
      const dataToSend = {
        ...formData,
        customer: selectedCustomer._id,
        measurementId: finalMeasurementId,
      };

      const data = await createOrder(dataToSend);
      setMessage(data.message || "Order added successfully!");
      setIsSuccess(true);
      
      // Reset form
      setFormData({
        customer: "", category: "", service: "", design: "", rawMaterial: "",
        expectedDate: "", totalAmount: "", advanceAmount: "",
        extraCharges: "", paymentMethod: ""
      });
      setSelectedCustomer(null);
      setSuggestions([]);
      setCustomerMeasurements([]);
      setSelectedMeasurement("");

    } catch (error) {
      setMessage(error.message || "Something went wrong while adding order");
      setIsSuccess(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Add Order</h2>

      {message && (
        <div className={`flex items-center gap-2 p-3 mb-4 rounded-md ${isSuccess ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {isSuccess ? <CheckCircle size={20} /> : <XCircle size={20} />}
          <span className="text-sm font-medium">{message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Customer Search Input */}
        <div className="relative">
          <input
            type="text"
            name="customer"
            value={formData.customer}
            placeholder="Search Customer by Name or ID"
            onChange={handleCustomerSearch}
            className="w-full border p-2 rounded"
            required
          />
          {suggestions.length > 0 && (
            <ul className="absolute z-10 w-full border bg-white shadow-md rounded mt-1 max-h-40 overflow-y-auto">
              {suggestions.map((cust) => (
                <li
                  key={cust._id}
                  onClick={() => handleSelectCustomer(cust)}
                  className="p-2 hover:bg-gray-200 cursor-pointer"
                >
                  {cust.name} ({cust.phone})
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Other fields */}
        <input
          type="text"
          name="category"
          value={formData.category}
          placeholder="Category"
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          name="service"
          value={formData.service}
          placeholder="Service"
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          name="design"
          value={formData.design}
          placeholder="Design"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="rawMaterial"
          value={formData.rawMaterial}
          placeholder="Raw Material"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="date"
          name="expectedDate"
          value={formData.expectedDate}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="number"
          name="totalAmount"
          value={formData.totalAmount}
          placeholder="Total Amount"
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="number"
          name="advanceAmount"
          value={formData.advanceAmount}
          placeholder="Advance Amount"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="number"
          name="extraCharges"
          value={formData.extraCharges}
          placeholder="Extra Charges"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <select
          name="paymentMethod"
          value={formData.paymentMethod}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="">Select Payment Method</option>
          <option value="cash">Cash</option>
          <option value="card">Card</option>
          <option value="upi">UPI</option>
        </select>
        
        {/* Conditional Measurement Section */}
        {selectedCustomer && (
          <div className="pt-2">
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">
                Select Measurement Profile
              </label>
              {customerMeasurements.length > 0 && (
                <button
                  type="button"
                  onClick={() => setIsEditingMeasurement(!isEditingMeasurement)}
                  className="text-gray-500 hover:text-blue-600 flex items-center gap-1 text-sm font-medium"
                >
                  <Edit size={16} />
                  {isEditingMeasurement ? 'Done' : 'Edit Selected'}
                </button>
              )}
            </div>
            
            {loading ? (
              <div className="text-gray-500 text-sm">Loading measurements...</div>
            ) : customerMeasurements.length > 0 ? (
              <select
                name="measurement"
                value={selectedMeasurement}
                onChange={handleMeasurementChange}
                className="w-full border p-2 rounded"
                required
              >
                {customerMeasurements.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.category}
                  </option>
                ))}
              </select>
            ) : (
              <div className="p-3 text-sm text-red-700 bg-red-100 rounded">
                No measurements found for this customer.
              </div>
            )}
            
            <button
              type="button"
              onClick={() => {
                setIsAddingMeasurement(true);
                setIsEditingMeasurement(false);
              }}
              className="mt-2 w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 flex items-center justify-center space-x-2"
            >
              <Plus size={16} />
              <span>Add New Measurement</span>
            </button>
            
          </div>
        )}
        
        {/* New Measurement Form - Conditionally Rendered */}
        {isAddingMeasurement && (
          <div className="mt-4 p-4 border rounded-lg bg-gray-50">
            <h3 className="text-md font-semibold mb-2">New Measurement Details</h3>
            {newMeasurementData.map((measurement, index) => (
              <div key={index} className="flex gap-2 items-center mb-2">
                <input
                  type="text"
                  name="key"
                  value={measurement.key}
                  placeholder="e.g., Chest, Length"
                  onChange={(e) => handleNewMeasurementChange(index, e)}
                  className="w-1/2 border p-2 rounded"
                  required
                />
                <input
                  type="text"
                  name="value"
                  value={measurement.value}
                  placeholder="e.g., 36 inches"
                  onChange={(e) => handleNewMeasurementChange(index, e)}
                  className="w-1/2 border p-2 rounded"
                  required
                />
                <button
                  type="button"
                  onClick={() => removeMeasurementRow(index)}
                  className="text-red-500 p-2"
                >
                  X
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addMeasurementRow}
              className="w-full bg-gray-200 text-gray-800 p-2 rounded-lg hover:bg-gray-300"
            >
              Add another measurement
            </button>
            <button
              type="button"
              onClick={() => setIsAddingMeasurement(false)}
              className="mt-2 w-full bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
            >
              Cancel
            </button>
          </div>
        )}
        
        {/* Edit Measurement Form - Conditionally Rendered */}
        {isEditingMeasurement && (
          <div className="mt-4 p-4 border rounded-lg bg-gray-50">
            <h3 className="text-md font-semibold mb-2">Edit Measurement Details</h3>
            {editedMeasurementData.map((measurement, index) => (
              <div key={index} className="flex gap-2 items-center mb-2">
                <input
                  type="text"
                  name="key"
                  value={measurement.key}
                  placeholder="e.g., Chest, Length"
                  onChange={(e) => handleEditedMeasurementChange(index, e)}
                  className="w-1/2 border p-2 rounded"
                  required
                />
                <input
                  type="text"
                  name="value"
                  value={measurement.value}
                  placeholder="e.g., 36 inches"
                  onChange={(e) => handleEditedMeasurementChange(index, e)}
                  className="w-1/2 border p-2 rounded"
                  required
                />
                <button
                  type="button"
                  onClick={() => removeEditedMeasurementRow(index)}
                  className="text-red-500 p-2"
                >
                  X
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addEditedMeasurementRow}
              className="w-full bg-gray-200 text-gray-800 p-2 rounded-lg hover:bg-gray-300"
            >
              Add another measurement
            </button>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-green-600 text-white p-2 rounded-lg hover:bg-green-700"
        >
          Save Order
        </button>
      </form>
    </div>
  );
};

export default AdminAddOrder;
