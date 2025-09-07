import React, { useState, useEffect } from "react";
import { createOrder } from "../../api/order";
import { searchCustomers } from "../../api/customer";
import {
  getMeasurementsByCustomerId,
  createMeasurement,
  updateMeasurement,
} from "../../api/measurement";
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
  const [newMeasurementData, setNewMeasurementData] = useState([
    { key: "", value: "" },
  ]);
  const [newMeasurementCategory, setNewMeasurementCategory] = useState("");
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
      const measurementToEdit = customerMeasurements.find(
        (m) => m._id === selectedMeasurement
      );
      if (measurementToEdit) {
        setEditedMeasurementData(measurementToEdit.data);
      }
    }
  }, [selectedMeasurement, customerMeasurements]);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Customer search
  const handleCustomerSearch = async (e) => {
    const value = e.target.value;
    setFormData({ ...formData, customer: value });
    setSelectedCustomer(null);

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

  const handleSelectCustomer = (customer) => {
    setFormData({ ...formData, customer: customer.name });
    setSelectedCustomer(customer);
    setSuggestions([]);
  };

  // Measurement changes
  const handleMeasurementChange = (e) => {
    setSelectedMeasurement(e.target.value);
    setIsEditingMeasurement(false);
  };

  const handleNewMeasurementChange = (index, e) => {
    const newMeasurements = [...newMeasurementData];
    newMeasurements[index][e.target.name] = e.target.value;
    setNewMeasurementData(newMeasurements);
  };

  const handleEditedMeasurementChange = (index, e) => {
    const updated = [...editedMeasurementData];
    updated[index][e.target.name] = e.target.value;
    setEditedMeasurementData(updated);
  };

  // Save Measurement Separately
  const handleSaveMeasurement = async () => {
    if (!selectedCustomer) {
      setMessage("Please select a customer first.");
      setIsSuccess(false);
      return;
    }

    if (isAddingMeasurement) {
      const validMeasurements = newMeasurementData.filter((m) => m.key && m.value);
      if (validMeasurements.length === 0 || !newMeasurementCategory) {
        setMessage("Please fill in the new measurement details.");
        setIsSuccess(false);
        return;
      }

      try {
        const newMeasurement = await createMeasurement(
          selectedCustomer._id,
          newMeasurementCategory,
          validMeasurements
        );
        setMessage("New measurement saved successfully!");
        setIsSuccess(true);
        setIsAddingMeasurement(false);

        const updatedList = await getMeasurementsByCustomerId(selectedCustomer._id);
        setCustomerMeasurements(updatedList);
        setSelectedMeasurement(newMeasurement.measurement._id);
      } catch (err) {
        setMessage(err.message || "Error saving measurement.");
        setIsSuccess(false);
      }
    } else if (isEditingMeasurement) {
      const validMeasurements = editedMeasurementData.filter((m) => m.key && m.value);
      if (validMeasurements.length === 0) {
        setMessage("Edited measurement cannot be empty.");
        setIsSuccess(false);
        return;
      }

      try {
        await updateMeasurement(selectedMeasurement, validMeasurements);
        setMessage("Measurement updated successfully!");
        setIsSuccess(true);
        setIsEditingMeasurement(false);

        const updatedList = await getMeasurementsByCustomerId(selectedCustomer._id);
        setCustomerMeasurements(updatedList);
      } catch (err) {
        setMessage(err.message || "Error updating measurement.");
        setIsSuccess(false);
      }
    }
  };

  // Save Order Only
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCustomer) {
      setMessage("Please select a customer.");
      setIsSuccess(false);
      return;
    }

    const dataToSend = {
      ...formData,
      customer: selectedCustomer._id,
      measurementId: selectedMeasurement || null,
    };

    try {
      const data = await createOrder(dataToSend);
      setMessage(data.message || "Order added successfully!");
      setIsSuccess(true);

      // Reset
      setFormData({
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
    <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Add Order</h2>

      {message && (
        <div
          className={`flex items-center gap-2 p-3 mb-4 rounded-md ${
            isSuccess
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {isSuccess ? <CheckCircle size={20} /> : <XCircle size={20} />}
          <span className="text-sm font-medium">{message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Customer Search */}
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
        <input type="text" name="category" value={formData.category} placeholder="Category" onChange={handleChange} className="w-full border p-2 rounded" required />
        <input type="text" name="service" value={formData.service} placeholder="Service" onChange={handleChange} className="w-full border p-2 rounded" required />
        <input type="text" name="design" value={formData.design} placeholder="Design" onChange={handleChange} className="w-full border p-2 rounded" />
        <input type="text" name="rawMaterial" value={formData.rawMaterial} placeholder="Raw Material" onChange={handleChange} className="w-full border p-2 rounded" />
        <input type="date" name="expectedDate" value={formData.expectedDate} onChange={handleChange} className="w-full border p-2 rounded" />

        {/* Money */}
        <div className="grid grid-cols-3 gap-3">
          <input type="number" name="totalAmount" value={formData.totalAmount} placeholder="Total" onChange={handleChange} className="border p-2 rounded" required />
          <input type="number" name="advanceAmount" value={formData.advanceAmount} placeholder="Advance" onChange={handleChange} className="border p-2 rounded" />
          <input type="number" name="extraCharges" value={formData.extraCharges} placeholder="Extra" onChange={handleChange} className="border p-2 rounded" />
        </div>

        <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} className="w-full border p-2 rounded">
          <option value="">Select Payment Method</option>
          <option value="cash">Cash</option>
          <option value="card">Card</option>
          <option value="upi">UPI</option>
        </select>

        {/* Measurements */}
        {selectedCustomer && !isAddingMeasurement && (
          <div className="pt-2">
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">Select Measurement Profile</label>
              {customerMeasurements.length > 0 && (
                <button
                  type="button"
                  onClick={() => setIsEditingMeasurement(!isEditingMeasurement)}
                  className="text-gray-500 hover:text-blue-600 flex items-center gap-1 text-sm font-medium"
                >
                  <Edit size={16} />
                  {isEditingMeasurement ? "Done" : "Edit Selected"}
                </button>
              )}
            </div>

            {loading ? (
              <div className="text-gray-500 text-sm">Loading measurements...</div>
            ) : customerMeasurements.length > 0 ? (
              <select name="measurement" value={selectedMeasurement} onChange={handleMeasurementChange} className="w-full border p-2 rounded" required>
                {customerMeasurements.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.category}
                  </option>
                ))}
              </select>
            ) : (
              <div className="p-3 text-sm text-red-700 bg-red-100 rounded">No measurements found for this customer.</div>
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

        {/* New Measurement */}
        {isAddingMeasurement && (
          <div className="mt-4 p-4 border rounded-lg bg-gray-50">
            <h3 className="text-md font-semibold mb-3">New Measurement Details</h3>

            <div className="flex gap-2 mb-3">
              <input type="text" value={newMeasurementCategory} onChange={(e) => setNewMeasurementCategory(e.target.value)} placeholder="Category (e.g., Shirt)" className="w-1/3 border p-2 rounded" required />
              <input type="text" name="key" value={newMeasurementData[0].key} placeholder="e.g., Chest" onChange={(e) => handleNewMeasurementChange(0, e)} className="w-1/3 border p-2 rounded" required />
              <input type="text" name="value" value={newMeasurementData[0].value} placeholder="e.g., 36 in" onChange={(e) => handleNewMeasurementChange(0, e)} className="w-1/3 border p-2 rounded" required />
            </div>

            {newMeasurementData.slice(1).map((m, index) => (
              <div key={index} className="flex gap-2 items-center mb-2">
                <input type="text" name="key" value={m.key} placeholder="e.g., Length" onChange={(e) => handleNewMeasurementChange(index + 1, e)} className="w-1/2 border p-2 rounded" />
                <input type="text" name="value" value={m.value} placeholder="e.g., 40 in" onChange={(e) => handleNewMeasurementChange(index + 1, e)} className="w-1/2 border p-2 rounded" />
              </div>
            ))}

            <button type="button" onClick={handleSaveMeasurement} className="w-full bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 mt-2">
              Save Measurement
            </button>

            <button type="button" onClick={() => setIsAddingMeasurement(false)} className="mt-2 w-full bg-red-500 text-white p-2 rounded-lg hover:bg-red-600">
              Cancel
            </button>
          </div>
        )}

        {/* Save Order */}
        <button type="submit" className="w-full bg-green-600 text-white p-2 rounded-lg hover:bg-green-700">
          Save Order
        </button>
      </form>
    </div>
  );
};

export default AdminAddOrder;
