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
  const [newMeasurementCategory, setNewMeasurementCategory] = useState("");
  const [newMeasurementData, setNewMeasurementData] = useState([
    { key: "", value: "" },
  ]);

  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(true);
  const [loading, setLoading] = useState(false);

  // Auto clear message
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Fetch measurements for customer
  useEffect(() => {
    const fetchMeasurements = async () => {
      if (!selectedCustomer) return;
      setLoading(true);
      try {
        const data = await getMeasurementsByCustomerId(selectedCustomer._id);
        setCustomerMeasurements(data);
        if (data.length > 0) {
          setSelectedMeasurement(data[0]._id);
        }
      } catch (err) {
        setCustomerMeasurements([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMeasurements();
  }, [selectedCustomer]);

  // Input changes
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleCustomerSearch = async (e) => {
    const value = e.target.value;
    setFormData({ ...formData, customer: value });
    setSelectedCustomer(null);

    if (value.length > 0) {
      try {
        const results = await searchCustomers(value);
        setSuggestions(results);
      } catch {
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectCustomer = (cust) => {
    setFormData({ ...formData, customer: cust.name });
    setSelectedCustomer(cust);
    setSuggestions([]);
  };

  // Measurement input changes
  const handleNewMeasurementChange = (index, e) => {
    const updated = [...newMeasurementData];
    updated[index][e.target.name] = e.target.value;
    setNewMeasurementData(updated);
  };

  const addMeasurementRow = () =>
    setNewMeasurementData([...newMeasurementData, { key: "", value: "" }]);

  const handleSaveMeasurement = async () => {
    if (!selectedCustomer) {
      setMessage("Select a customer first.");
      setIsSuccess(false);
      return;
    }
    if (!newMeasurementCategory) {
      setMessage("Enter a measurement category.");
      setIsSuccess(false);
      return;
    }

    const validData = newMeasurementData.filter((m) => m.key && m.value);
    if (validData.length === 0) {
      setMessage("Add at least one measurement field.");
      setIsSuccess(false);
      return;
    }

    try {
      const newMeas = await createMeasurement(
        selectedCustomer._id,
        newMeasurementCategory,
        validData
      );
      setMessage("Measurement saved!");
      setIsSuccess(true);

      // Refresh measurement list
      const updatedList = await getMeasurementsByCustomerId(
        selectedCustomer._id
      );
      setCustomerMeasurements(updatedList);
      setSelectedMeasurement(newMeas.measurement._id);

      // Reset add measurement form
      setIsAddingMeasurement(false);
      setNewMeasurementCategory("");
      setNewMeasurementData([{ key: "", value: "" }]);
    } catch (err) {
      setMessage(err.message || "Error saving measurement");
      setIsSuccess(false);
    }
  };

  // Save Order
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCustomer) {
      setMessage("Please select a customer.");
      setIsSuccess(false);
      return;
    }
    if (!selectedMeasurement) {
      setMessage("A measurement profile must be selected for this order.");
      setIsSuccess(false);
      return;
    }

    const dataToSend = {
      ...formData,
      customer: selectedCustomer._id,
      measurement: [selectedMeasurement],
      rawMaterial: {
        isProvided: !!formData.rawMaterial,
        name: formData.rawMaterial,
        price: 0,
      },
    };

    try {
      const res = await createOrder(dataToSend);
      setMessage(res.message || "Order created!");
      setIsSuccess(true);

      // Reset form
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
      setCustomerMeasurements([]);
      setSelectedMeasurement("");
    } catch (err) {
      setMessage(err.message || "Order failed");
      setIsSuccess(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Add Order</h2>

      {message && (
        <div
          className={`flex items-center gap-2 p-3 mb-4 rounded ${
            isSuccess ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {isSuccess ? <CheckCircle size={20} /> : <XCircle size={20} />}
          <span>{message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Customer Search */}
        <div className="relative">
          <input
            type="text"
            name="customer"
            value={formData.customer}
            placeholder="Search customer"
            onChange={handleCustomerSearch}
            className="w-full border p-2 rounded"
          />
          {suggestions.length > 0 && (
            <ul className="absolute w-full bg-white border shadow max-h-40 overflow-y-auto z-10">
              {suggestions.map((c) => (
                <li
                  key={c._id}
                  onClick={() => handleSelectCustomer(c)}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  {c.name} ({c.phone})
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Basic fields */}
        <input
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          name="service"
          placeholder="Service"
          value={formData.service}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          name="design"
          placeholder="Design"
          value={formData.design}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          name="rawMaterial"
          placeholder="Raw Material"
          value={formData.rawMaterial}
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

        {/* Amounts */}
        <div className="grid grid-cols-3 gap-2">
          <input
            name="totalAmount"
            placeholder="Total"
            value={formData.totalAmount}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            name="advanceAmount"
            placeholder="Advance"
            value={formData.advanceAmount}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            name="extraCharges"
            placeholder="Extra"
            value={formData.extraCharges}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </div>

        <select
          name="paymentMethod"
          value={formData.paymentMethod}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="">Payment Method</option>
          <option value="cash">Cash</option>
          <option value="card">Card</option>
          <option value="upi">UPI</option>
          <option value="qr">QR</option>
          <option value="other">Other</option>
        </select>

        {/* Measurement Section */}
        {selectedCustomer && !isAddingMeasurement && (
          <div>
            {loading ? (
              <p>Loading measurements...</p>
            ) : customerMeasurements.length > 0 ? (
              <select
                value={selectedMeasurement}
                onChange={(e) => setSelectedMeasurement(e.target.value)}
                className="w-full border p-2 rounded"
              >
                {customerMeasurements.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.category}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-sm text-gray-500">
                No measurements found for this customer.
              </p>
            )}

            <button
              type="button"
              onClick={() => setIsAddingMeasurement(true)}
              className="mt-2 flex items-center gap-2 bg-blue-500 text-white px-3 py-2 rounded"
            >
              <Plus size={16} /> Add New Measurement
            </button>
          </div>
        )}

        {/* New Measurement Form */}
        {isAddingMeasurement && (
          <div className="border p-3 rounded bg-gray-50">
            <input
              type="text"
              placeholder="Measurement Category (e.g. Shirt)"
              value={newMeasurementCategory}
              onChange={(e) => setNewMeasurementCategory(e.target.value)}
              className="w-full border p-2 rounded mb-2"
            />
            {newMeasurementData.map((row, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  name="key"
                  placeholder="Field (e.g. Chest)"
                  value={row.key}
                  onChange={(e) => handleNewMeasurementChange(i, e)}
                  className="flex-1 border p-2 rounded"
                />
                <input
                  name="value"
                  placeholder="Value (e.g. 40)"
                  value={row.value}
                  onChange={(e) => handleNewMeasurementChange(i, e)}
                  className="flex-1 border p-2 rounded"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={addMeasurementRow}
              className="text-sm text-blue-600"
            >
              + Add Field
            </button>

            <div className="flex gap-2 mt-3">
              <button
                type="button"
                onClick={handleSaveMeasurement}
                className="flex-1 bg-green-600 text-white p-2 rounded"
              >
                Save Measurement
              </button>
              <button
                type="button"
                onClick={() => setIsAddingMeasurement(false)}
                className="flex-1 bg-gray-400 text-white p-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-green-600 text-white p-2 rounded"
        >
          Save Order
        </button>
      </form>
    </div>
  );
};

export default AdminAddOrder;
