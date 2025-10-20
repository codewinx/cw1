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
      },
    ],
    quantity: 1,
    expectedDate: "",
    payment: {
      totalAmount: "",
      advanceAmount: "",
      extraCharges: { amount: "", note: "" },
      paymentMode: "Cash",
    },
  });

  // Fetch categories
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
        console.log(data);
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
      { design: null, color: "", rawMaterial: { cloth: false, lining: false }, measurements: [] }
    ],
    quantity: 1,
  }));
  setSelectedService(null);

  if (category) {
    try {
      const data = await getServicesByCategory(category);
      // data.services is the array we need
      setFilteredServices(data.services || []);
    } catch (err) {
      console.error(err);
    }
  } else {
    setFilteredServices([]);
  }
};


  // Service change → set measurement fields
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
        }));
      setFormData((prev) => ({ ...prev, serviceId, items }));
    } else {
      setFormData((prev) => ({ ...prev, serviceId, items: [] }));
    }
  };

  // Quantity change → adjust items array
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

  // Customer & Payment change
  const handleChange = (e, section, subField) => {
    const { name, value, checked, type } = e.target;
    if (section === "customer") {
      setFormData((prev) => ({
        ...prev,
        customer: { ...prev.customer, [name]: value },
      }));
    } else if (section === "payment") {
      if (subField) {
        setFormData((prev) => ({
          ...prev,
          payment: { ...prev.payment, [subField]: { ...prev.payment[subField], [name]: value } },
        }));
      } else {
        setFormData((prev) => ({ ...prev, payment: { ...prev.payment, [name]: value } }));
      }
    }
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
    data.append(
      "payment",
      JSON.stringify({
        totalAmount: Number(formData.payment.totalAmount),
        advanceAmount: Number(formData.payment.advanceAmount),
        extraCharges: {
          amount: Number(formData.payment.extraCharges.amount),
          note: formData.payment.extraCharges.note,
        },
        paymentMode: formData.payment.paymentMode,
      })
    );
    data.append("items", JSON.stringify(formData.items));

    // ✅ Append files with dynamic field names
    formData.items.forEach((item, index) => {
      if (item.design) data.append(`design_${index}`, item.design);
    });

    await createOrder(data);
    alert("✅ Order created successfully!");
    onClose?.();
  } catch (err) {
    console.error(err);
    alert("❌ Failed to create order");
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
              <input name="name" placeholder="Name" className="input" onChange={(e) => handleChange(e, "customer")} />
              <input name="email" placeholder="Email" className="input" onChange={(e) => handleChange(e, "customer")} />
              <input name="phone" placeholder="Phone" className="input" onChange={(e) => handleChange(e, "customer")} />
              <input name="address" placeholder="Address" className="input" onChange={(e) => handleChange(e, "customer")} />
              <select name="gender" className="input col-span-2 sm:col-span-1" onChange={(e) => handleChange(e, "customer")}>
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
    <option key={c.category} value={c.category}>{c.category}</option>
  ))}
</select>

            </div>
            {formData.category && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Service</h3>
                <select className="input w-full" value={formData.serviceId} onChange={handleServiceChange}>
                  <option value="">Select Service</option>
                 {filteredServices && filteredServices.map((s) => (
  <option key={s._id} value={s._id}>{s.name}</option>
))}


                </select>
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold mb-2">Quantity</h3>
              <input type="number" min="1" className="input w-full" value={formData.quantity} onChange={handleQuantityChange} />
            </div>
          </div>

          {/* Items */}
          {formData.items.map((item, idx) => (
            <div key={idx} className="border p-4 rounded-lg space-y-4 mt-4">
              <h3 className="text-lg font-semibold text-blue-600 mb-2">Item #{idx + 1}</h3>
              {item.measurements.map((m, i) => (
                <div key={i} className="grid grid-cols-2 gap-3 items-center">
                  <label className="font-medium">{m.fieldName}</label>
                  <input type="text" className="input" value={m.value} placeholder="Enter measurement" onChange={(e) => handleMeasurementChange(idx, i, e.target.value)} />
                </div>
              ))}
              <div className="grid grid-cols-3 gap-4 mt-2">
         <div>
  <label className="block font-medium">Color</label>
  <select
    value={item.color || ""}
    onChange={(e) => {
      const items = [...formData.items];
      items[idx].color = e.target.value;
      setFormData((prev) => ({ ...prev, items }));
    }}
    className="input w-full mb-2"
  >
    <option value="">Select a Color</option>
    <option value="AliceBlue">AliceBlue</option>
    <option value="Aqua">Aqua</option>
    <option value="Aquamarine">Aquamarine</option>
    <option value="Beige">Beige</option>
    <option value="Black">Black</option>
    <option value="Blue">Blue</option>
    <option value="BlueViolet">BlueViolet</option>
    <option value="Brown">Brown</option>
    <option value="CadetBlue">CadetBlue</option>
    <option value="Chartreuse">Chartreuse</option>
    <option value="Chocolate">Chocolate</option>
    <option value="Coral">Coral</option>
    <option value="CornflowerBlue">CornflowerBlue</option>
    <option value="Crimson">Crimson</option>
    <option value="Cyan">Cyan</option>
    <option value="DarkBlue">DarkBlue</option>
    <option value="DarkCyan">DarkCyan</option>
    <option value="DarkGoldenRod">DarkGoldenRod</option>
    <option value="DarkGray">DarkGray</option>
    <option value="DarkGreen">DarkGreen</option>
    <option value="DarkKhaki">DarkKhaki</option>
    <option value="DarkMagenta">DarkMagenta</option>
    <option value="DarkOliveGreen">DarkOliveGreen</option>
    <option value="DarkOrange">DarkOrange</option>
    <option value="DarkOrchid">DarkOrchid</option>
    <option value="DarkRed">DarkRed</option>
    <option value="DarkSalmon">DarkSalmon</option>
    <option value="DarkSeaGreen">DarkSeaGreen</option>
    <option value="DarkSlateBlue">DarkSlateBlue</option>
    <option value="DarkSlateGray">DarkSlateGray</option>
    <option value="DarkTurquoise">DarkTurquoise</option>
    <option value="DarkViolet">DarkViolet</option>
    <option value="DeepPink">DeepPink</option>
    <option value="DeepSkyBlue">DeepSkyBlue</option>
    <option value="DimGray">DimGray</option>
    <option value="DodgerBlue">DodgerBlue</option>
    <option value="FireBrick">FireBrick</option>
    <option value="FloralWhite">FloralWhite</option>
    <option value="ForestGreen">ForestGreen</option>
    <option value="Fuchsia">Fuchsia</option>
    <option value="Gainsboro">Gainsboro</option>
    <option value="Gold">Gold</option>
    <option value="GoldenRod">GoldenRod</option>
    <option value="Gray">Gray</option>
    <option value="Green">Green</option>
    <option value="GreenYellow">GreenYellow</option>
    <option value="HoneyDew">HoneyDew</option>
    <option value="HotPink">HotPink</option>
    <option value="IndianRed">IndianRed</option>
    <option value="Indigo">Indigo</option>
    <option value="Ivory">Ivory</option>
  </select>
</div>



               <div>
  <label className="block font-medium">Design</label>
  <input
    type="file"
    accept="image/*"
    capture="environment"   // 👈 allows direct camera capture on mobile
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
                  <label className="mr-2"><input type="checkbox" checked={item.rawMaterial.cloth} onChange={(e) => handleRawMaterialChange(idx, "cloth", e.target.checked)} /> Cloth</label>
                  <label><input type="checkbox" checked={item.rawMaterial.lining} onChange={(e) => handleRawMaterialChange(idx, "lining", e.target.checked)} /> Lining</label>
                </div>
              </div>
            </div>
          ))}

          {/* Expected Date & Payment */}
          <div className="border p-4 rounded-lg grid grid-cols-2 gap-6">
            <div>
              <label className="block font-semibold mb-1">Expected Date</label>
              <input type="date" className="input w-full" value={formData.expectedDate} onChange={(e) => setFormData((prev) => ({ ...prev, expectedDate: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Payment Details</h3>
              <div>
                <label className="font-medium">Total Amount</label>
                <input type="number" className="input w-full" value={formData.payment.totalAmount} onChange={(e) => handleChange(e, "payment")} name="totalAmount" />
              </div>
              <div>
                <label className="font-medium">Advance Amount</label>
                <input type="number" className="input w-full" value={formData.payment.advanceAmount} onChange={(e) => handleChange(e, "payment")} name="advanceAmount" />
              </div>
              <div>
                <label className="font-medium">Extra Charges</label>
                <input type="number" className="input w-full" value={formData.payment.extraCharges.amount} onChange={(e) => handleChange(e, "payment", "extraCharges")} name="amount" />
              </div>
              <div>
                <label className="font-medium">Extra Charges Note</label>
                <input type="text" className="input w-full" value={formData.payment.extraCharges.note} onChange={(e) => handleChange(e, "payment", "extraCharges")} name="note" />
              </div>
              <div>
                <label className="font-medium">Payment Mode</label>
                <select className="input w-full" value={formData.payment.paymentMode} onChange={(e) => handleChange(e, "payment")} name="paymentMode">
                  <option>Cash</option><option>UPI</option><option>Card</option><option>Bank Transfer</option>
                </select>
              </div>
            </div>
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
            Submit Order
          </button>
        </form>
      </div>

      {/* Preview Modal */}
      {showPreview !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg relative">
            <button className="absolute top-2 right-2 text-gray-600 hover:text-red-600" onClick={() => setShowPreview(null)}>✕</button>
            <img src={previewImages[showPreview]} alt="Design Preview" className="max-w-md max-h-[70vh] rounded-lg" />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManagerAddOrder;
