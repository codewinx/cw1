import React, { useState, useEffect } from "react";
import { getCategories, getServicesByCategory } from "../../api/admin+manager.js";
import { createOrder } from "../../api/admin+manager.js";

const AdminManagerAddOrder = ({ onClose }) => {
  const [categories, setCategories] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [previewImages, setPreviewImages] = useState({});
  const [showPreview, setShowPreview] = useState(null);

  const [formData, setFormData] = useState({
    customer: { name: "", email: "", phone: "", address: "", gender: "Male" },
    category: "",
    serviceId: "",
    items: [
      {
        design: null,
        color: "",
        rawMaterial: { cloth: false, lining: false },
        measurements: [],
        totalAmount: "", // Individual item price
        advanceAmount: "",
        extraCharges: { amount: "", note: "" },
      },
    ],
    quantity: 1,
    expectedDate: "",
    paymentMode: "Cash",
  });

  // Calculate grand total
  const calculateGrandTotal = () => {
    return formData.items.reduce((sum, item) => {
      const total = Number(item.totalAmount) || 0;
      const extra = Number(item.extraCharges.amount) || 0;
      return sum + total + extra;
    }, 0);
  };

  // Calculate total advance
  const calculateTotalAdvance = () => {
    return formData.items.reduce((sum, item) => {
      return sum + (Number(item.advanceAmount) || 0);
    }, 0);
  };

  // Fetch categories
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCats();
  }, []);

  // Category change
  const handleCategoryChange = async (e) => {
    const category = e.target.value;
    setFormData((prev) => ({
      ...prev,
      category,
      serviceId: "",
      items: [
        {
          design: null,
          color: "",
          rawMaterial: { cloth: false, lining: false },
          measurements: [],
          totalAmount: "",
          advanceAmount: "",
          extraCharges: { amount: "", note: "" },
        },
      ],
      quantity: 1,
    }));
    setSelectedService(null);

    if (category) {
      try {
        const data = await getServicesByCategory(category);
        setFilteredServices(data.services || []);
      } catch (err) {
        console.error(err);
      }
    } else {
      setFilteredServices([]);
    }
  };

  // Service change
  const handleServiceChange = (e) => {
    const serviceId = e.target.value;
    const service = filteredServices.find((s) => s._id === serviceId);
    setSelectedService(service);

    if (service) {
      const measurementFields = service.measurements.map((m) => ({
        fieldName: m,
        value: "",
      }));
      const items = Array(formData.quantity)
        .fill(null)
        .map(() => ({
          measurements: [...measurementFields],
          design: null,
          color: "",
          rawMaterial: { cloth: false, lining: false },
          totalAmount: "",
          advanceAmount: "",
          extraCharges: { amount: "", note: "" },
        }));
      setFormData((prev) => ({ ...prev, serviceId, items }));
    } else {
      setFormData((prev) => ({ ...prev, serviceId, items: [] }));
    }
  };

  // Quantity change
  const handleQuantityChange = (e) => {
    const quantity = Math.max(1, parseInt(e.target.value, 10));
    const currentItems = [...formData.items];
    while (currentItems.length < quantity) {
      currentItems.push({
        measurements: selectedService
          ? selectedService.measurements.map((m) => ({ fieldName: m, value: "" }))
          : [],
        design: null,
        color: "",
        rawMaterial: { cloth: false, lining: false },
        totalAmount: "",
        advanceAmount: "",
        extraCharges: { amount: "", note: "" },
      });
    }
    currentItems.length = quantity;
    setFormData((prev) => ({ ...prev, quantity, items: currentItems }));
  };

  // Measurement change
  const handleMeasurementChange = (index, fieldIndex, value) => {
    const items = [...formData.items];
    items[index].measurements[fieldIndex].value = value;
    setFormData((prev) => ({ ...prev, items }));
  };

  // Design change
  const handleDesignChange = (index, file) => {
    const items = [...formData.items];
    items[index].design = file;
    setFormData((prev) => ({ ...prev, items }));
    if (file) setPreviewImages((prev) => ({ ...prev, [index]: URL.createObjectURL(file) }));
  };

  // Color change
  const handleColorChange = (index, color) => {
    const items = [...formData.items];
    items[index].color = color;
    setFormData((prev) => ({ ...prev, items }));
  };

  // Raw Material change
  const handleRawMaterialChange = (index, name, checked) => {
    const items = [...formData.items];
    items[index].rawMaterial[name] = checked;
    setFormData((prev) => ({ ...prev, items }));
  };

  // Item payment change
  const handleItemPaymentChange = (index, field, value, subField = null) => {
    const items = [...formData.items];
    if (subField) {
      items[index][field][subField] = value;
    } else {
      items[index][field] = value;
    }
    setFormData((prev) => ({ ...prev, items }));
  };

  // Customer change
  const handleCustomerChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      customer: { ...prev.customer, [name]: value },
    }));
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("customer", JSON.stringify(formData.customer));
      data.append("category", formData.category);
      data.append("serviceId", formData.serviceId);
      data.append("quantity", formData.quantity);
      data.append("expectedDate", formData.expectedDate);
      data.append("paymentMode", formData.paymentMode);
      data.append("items", JSON.stringify(formData.items));

      // Append files
      formData.items.forEach((item, index) => {
        if (item.design) data.append(`design_${index}`, item.design);
      });

      const response = await createOrder(data);
      console.log("✅ Order created successfully:", response);
      alert(`✅ Order created successfully!\n\nGrand Total: ₹${response.summary?.grandTotal || 0}\nTotal Advance: ₹${response.summary?.totalAdvance || 0}`);
      onClose?.();
    } catch (err) {
      console.error("Error details:", err);
      alert(`❌ Failed to create order: ${err.message || "Unknown error"}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="relative bg-white rounded-2xl shadow-lg w-full max-w-7xl p-8 overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-600"
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold mb-6 text-center">Add New Order</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer */}
          <div className="border p-4 rounded-lg space-y-4">
            <h3 className="text-lg font-semibold">Customer Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <input name="name" placeholder="Name" className="input" onChange={handleCustomerChange} />
              <input name="email" placeholder="Email" className="input" onChange={handleCustomerChange} />
              <input name="phone" placeholder="Phone" className="input" onChange={handleCustomerChange} />
              <input name="address" placeholder="Address" className="input" onChange={handleCustomerChange} />
              <select name="gender" className="input col-span-2 sm:col-span-1" onChange={handleCustomerChange}>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          {/* Category, Service, Quantity */}
          <div className="border p-4 rounded-lg grid grid-cols-3 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Category</h3>
              <select className="input w-full" value={formData.category} onChange={handleCategoryChange}>
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.category} value={c.category}>
                    {c.category}
                  </option>
                ))}
              </select>
            </div>
            {formData.category && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Service</h3>
                <select className="input w-full" value={formData.serviceId} onChange={handleServiceChange}>
                  <option value="">Select Service</option>
                  {filteredServices &&
                    filteredServices.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name}
                      </option>
                    ))}
                </select>
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold mb-2">Quantity</h3>
              <input
                type="number"
                min="1"
                className="input w-full"
                value={formData.quantity}
                onChange={handleQuantityChange}
              />
            </div>
          </div>

          {/* Items */}
          {formData.items.map((item, idx) => (
            <div key={idx} className="border-2 border-blue-200 p-4 rounded-lg space-y-4 mt-4 bg-blue-50">
              <h3 className="text-lg font-semibold text-blue-600 mb-2">Item #{idx + 1}</h3>
              
              {/* Measurements */}
              {item.measurements.map((m, i) => (
                <div key={i} className="grid grid-cols-2 gap-3 items-center">
                  <label className="font-medium">{m.fieldName}</label>
                  <input
                    type="text"
                    className="input"
                    value={m.value}
                    placeholder="Enter measurement"
                    onChange={(e) => handleMeasurementChange(idx, i, e.target.value)}
                  />
                </div>
              ))}

              {/* Color, Design, Raw Material */}
              <div className="grid grid-cols-3 gap-4 mt-2">
                <div>
                  <label className="block font-medium">Color</label>
                  <select
                    value={item.color || ""}
                    onChange={(e) => handleColorChange(idx, e.target.value)}
                    className="input w-full mb-2"
                  >
                    <option value="">Select a Color</option>
                    <option value="Black">Black</option>
                    <option value="White">White</option>
                    <option value="Red">Red</option>
                    <option value="Blue">Blue</option>
                    <option value="Green">Green</option>
                    <option value="Yellow">Yellow</option>
                    <option value="Brown">Brown</option>
                    <option value="Gray">Gray</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium">Design</label>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={(e) => handleDesignChange(idx, e.target.files[0])}
                    className="input w-full"
                  />
                  {previewImages[idx] && (
                    <button
                      type="button"
                      className="text-blue-600 hover:underline mt-1 text-sm"
                      onClick={() => setShowPreview(idx)}
                    >
                      👁 Preview
                    </button>
                  )}
                </div>

                <div>
                  <label className="block font-medium">Raw Material</label>
                  <label className="mr-2">
                    <input
                      type="checkbox"
                      checked={item.rawMaterial.cloth}
                      onChange={(e) => handleRawMaterialChange(idx, "cloth", e.target.checked)}
                    />{" "}
                    Cloth
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={item.rawMaterial.lining}
                      onChange={(e) => handleRawMaterialChange(idx, "lining", e.target.checked)}
                    />{" "}
                    Lining
                  </label>
                </div>
              </div>

              {/* Individual Item Payment */}
              <div className="bg-white p-3 rounded-lg mt-3 border border-gray-300">
                <h4 className="font-semibold text-md mb-2">💰 Item #{idx + 1} Pricing</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-medium text-sm">Total Amount</label>
                    <input
                      type="number"
                      className="input w-full"
                      value={item.totalAmount}
                      onChange={(e) => handleItemPaymentChange(idx, "totalAmount", e.target.value)}
                      placeholder="₹"
                    />
                  </div>
                  <div>
                    <label className="font-medium text-sm">Advance Amount</label>
                    <input
                      type="number"
                      className="input w-full"
                      value={item.advanceAmount}
                      onChange={(e) => handleItemPaymentChange(idx, "advanceAmount", e.target.value)}
                      placeholder="₹"
                    />
                  </div>
                  <div>
                    <label className="font-medium text-sm">Extra Charges</label>
                    <input
                      type="number"
                      className="input w-full"
                      value={item.extraCharges.amount}
                      onChange={(e) =>
                        handleItemPaymentChange(idx, "extraCharges", e.target.value, "amount")
                      }
                      placeholder="₹"
                    />
                  </div>
                  <div>
                    <label className="font-medium text-sm">Extra Charges Note</label>
                    <input
                      type="text"
                      className="input w-full"
                      value={item.extraCharges.note}
                      onChange={(e) =>
                        handleItemPaymentChange(idx, "extraCharges", e.target.value, "note")
                      }
                      placeholder="Note"
                    />
                  </div>
                </div>
                <div className="mt-2 text-right font-semibold text-green-600">
                  Item Total: ₹{(Number(item.totalAmount) || 0) + (Number(item.extraCharges.amount) || 0)}
                </div>
              </div>
            </div>
          ))}

          {/* Expected Date & Payment Mode */}
          <div className="border p-4 rounded-lg grid grid-cols-2 gap-6">
            <div>
              <label className="block font-semibold mb-1">Expected Date</label>
              <input
                type="date"
                className="input w-full"
                value={formData.expectedDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, expectedDate: e.target.value }))}
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Payment Mode</label>
              <select
                className="input w-full"
                value={formData.paymentMode}
                onChange={(e) => setFormData((prev) => ({ ...prev, paymentMode: e.target.value }))}
              >
                <option>Cash</option>
                <option>UPI</option>
                <option>Card</option>
                <option>Bank Transfer</option>
              </select>
            </div>
          </div>

          {/* Grand Total Summary */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border-2 border-green-300">
            <h3 className="text-xl font-bold mb-3 text-center">📊 Order Summary</h3>
            <div className="grid grid-cols-2 gap-4 text-lg">
              <div className="text-right font-semibold">Grand Total:</div>
              <div className="text-left text-green-700 font-bold">₹{calculateGrandTotal()}</div>
              
              <div className="text-right font-semibold">Total Advance:</div>
              <div className="text-left text-blue-700 font-bold">₹{calculateTotalAdvance()}</div>
              
              <div className="text-right font-semibold">Remaining Balance:</div>
              <div className="text-left text-red-700 font-bold">
                ₹{calculateGrandTotal() - calculateTotalAdvance()}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Submit Order
          </button>
        </form>
      </div>

      {/* Preview Modal */}
      {showPreview !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-red-600"
              onClick={() => setShowPreview(null)}
            >
              ✕
            </button>
            <img
              src={previewImages[showPreview]}
              alt="Design Preview"
              className="max-w-md max-h-[70vh] rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManagerAddOrder;