import React, { useEffect, useState } from "react";
import {
  getOrders,
  deleteOrder,
  updateOrder,
  getOrderById,
} from "../../api/admin+manager.js";
import { Eye, Edit, Trash2, X, Calendar, Save } from "lucide-react";
import { getCategories, getServicesByCategory } from "../../api/service.js";

const BACKEND_URL = "http://localhost:5000";

const AdminManagerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Filters
  const [statusFilter, setStatusFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // View Modal
  const [viewOrder, setViewOrder] = useState(null);

  // Edit Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editOrder, setEditOrder] = useState(null);
  const [formData, setFormData] = useState({
    category: "",
    service: "",
    color: "",
    rawMaterial: { cloth: false, lining: false },
    expectedDate: "",
    status: "",
    payment: {
      totalAmount: 0,
      advanceAmount: 0,
      extraCharges: { amount: 0, note: "" },
    },
    measurements: [],
  });

  // For dropdowns
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);

  // Fetch all categories when modal opens
  useEffect(() => {
    if (isModalOpen) {
      (async () => {
        try {
          const response = await getCategories();
          // Handle different response formats
          let cats = [];
          if (Array.isArray(response)) {
            cats = response;
          } else if (response && Array.isArray(response.categories)) {
            cats = response.categories;
          } else if (response && typeof response === 'object') {
            // If it's an object with category keys, extract them
            cats = Object.keys(response);
          }
          setCategories(cats);
        } catch (err) {
          console.error("Error fetching categories:", err);
          setCategories([]);
        }
      })();
    }
  }, [isModalOpen]);

  // Fetch services whenever category changes
  useEffect(() => {
    if (formData.category) {
      (async () => {
        try {
          const response = await getServicesByCategory(formData.category);
          // Handle different response formats
          let svcs = [];
          if (Array.isArray(response)) {
            svcs = response;
          } else if (response && Array.isArray(response.services)) {
            svcs = response.services;
          } else if (response && response.category && Array.isArray(response.category.services)) {
            svcs = response.category.services;
          }
          setServices(svcs);
        } catch (err) {
          console.error("Error fetching services:", err);
          setServices([]);
        }
      })();
    } else {
      setServices([]);
    }
  }, [formData.category]);

  // Fetch orders
  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const params = {
        status: statusFilter !== "all" ? statusFilter : undefined,
        startDate,
        endDate,
      };
      const data = await getOrders(params);
      setOrders(data);
    } catch (err) {
      setError(err.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchOrders();
    }, 500);
    return () => clearTimeout(handler);
  }, [statusFilter, startDate, endDate]);

  // Delete order
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      await deleteOrder(id);
      alert("Order deleted successfully!");
      fetchOrders();
    } catch (err) {
      alert(err.message || "Error deleting order");
    }
  };

  // Edit order
  const handleEdit = (order) => {
    setEditOrder(order);
    setFormData({
      category: order.category || order.service?.category || "",
      service: order.service?.name || "",
      color: order.color || "",
      rawMaterial: {
        cloth: order.rawMaterial?.cloth || false,
        lining: order.rawMaterial?.lining || false,
      },
      expectedDate: order.expectedDate ? order.expectedDate.split("T")[0] : "",
      status: order.status || "placed",
      payment: {
        totalAmount: order.payment?.totalAmount || 0,
        advanceAmount: order.payment?.advanceAmount || 0,
        extraCharges: {
          amount: order.payment?.extraCharges?.amount || 0,
          note: order.payment?.extraCharges?.note || "",
        },
      },
      measurements: order.measurements || [],
    });
    setIsModalOpen(true);
  };

  // Update measurement value
  const handleMeasurementChange = (index, value) => {
    const updatedMeasurements = [...formData.measurements];
    updatedMeasurements[index] = { ...updatedMeasurements[index], value };
    setFormData({ ...formData, measurements: updatedMeasurements });
  };

  // Update order
  const handleUpdate = async () => {
    try {
      await updateOrder(editOrder._id, formData);
      setIsModalOpen(false);
      setEditOrder(null);
      alert("Order updated successfully!");
      fetchOrders();
    } catch (err) {
      alert(err.message || "Error updating order");
    }
  };

  // View order
  const handleView = async (id) => {
    try {
      const data = await getOrderById(id);
      setViewOrder(data);
    } catch (err) {
      alert(err.message || "Error fetching order");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">📦 Order Management</h1>

      {/* Filters (Status + Date) */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Status Filter */}
        <div className="flex items-center border rounded-lg px-3 py-2 w-full sm:w-1/3 bg-white shadow-sm">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full outline-none text-sm bg-transparent"
          >
            <option value="all">All Status</option>
            <option value="placed">Placed</option>
            <option value="cutting">Cutting</option>
            <option value="handworking">Handworking</option>
            <option value="tailoring">Tailoring</option>
            <option value="quality-check">Quality Check</option>
            <option value="ready-to-delivery">Ready To Delivery</option>
          </select>
        </div>

        {/* Date Filter */}
        <div className="flex items-center gap-2 w-full sm:w-2/3 bg-white shadow-sm rounded-lg p-2">
          <Calendar className="text-gray-400 w-4 h-4" />
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full text-sm outline-none"
            title="Start Date"
          />
          <span className="text-gray-400">-</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full text-sm outline-none"
            title="End Date"
          />
        </div>
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading orders...</p>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Order No</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{order.orderNo}</td>
                    <td className="px-4 py-3">{order.customer?.name || "N/A"}</td>
                    <td className="px-4 py-3">{order.category || order.service?.category || "N/A"}</td>
                    <td className="px-4 py-3">{order.service?.name || "N/A"}</td>
                    <td className="px-4 py-3">₹{order.payment?.totalAmount || order.totalAmount || 0}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          order.status === "ready-to-delivery"
                            ? "bg-green-100 text-green-700"
                            : order.status === "placed"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 flex gap-2">
                      <button
                        onClick={() => handleView(order._id)}
                        className="p-2 bg-gray-100 rounded hover:bg-gray-200 transition"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(order)}
                        className="p-2 bg-blue-100 rounded hover:bg-blue-200 transition"
                        title="Edit Order"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(order._id)}
                        className="p-2 bg-red-100 rounded hover:bg-red-200 transition"
                        title="Delete Order"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-4 py-6 text-center text-gray-500">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* View Modal */}
      {viewOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-3xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setViewOrder(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-600 transition"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
              📋 Order Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              {/* Order Information */}
              <div className="space-y-3 bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-3 text-blue-700 border-b pb-2">
                  Order Info
                </h3>
                <p>
                  <strong>Order No:</strong> {viewOrder.orderNo}
                </p>
                <p>
                  <strong>Customer:</strong> {viewOrder.customer?.name || "N/A"}
                </p>
                <p>
                  <strong>Phone:</strong> {viewOrder.customer?.phone || "N/A"}
                </p>
                <p>
                  <strong>Category:</strong>{" "}
                  {viewOrder.category || viewOrder.service?.category || "N/A"}
                </p>
                <p>
                  <strong>Service:</strong> {viewOrder.service?.name || "N/A"}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      viewOrder.status === "ready-to-delivery"
                        ? "bg-green-100 text-green-700"
                        : viewOrder.status === "placed"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {viewOrder.status}
                  </span>
                </p>
              </div>

              {/* Payment Information */}
              <div className="space-y-3 bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-3 text-green-700 border-b pb-2">
                  Payment Info
                </h3>
                <p>
                  <strong>Total Amount:</strong> ₹
                  {viewOrder.payment?.totalAmount || 0}
                </p>
                <p>
                  <strong>Advance Amount:</strong> ₹
                  {viewOrder.payment?.advanceAmount || 0}
                </p>
                <p>
                  <strong>Extra Charges:</strong> ₹
                  {viewOrder.payment?.extraCharges?.amount || 0}
                  {viewOrder.payment?.extraCharges?.note && (
                    <span className="text-xs text-gray-500 block">
                      ({viewOrder.payment.extraCharges.note})
                    </span>
                  )}
                </p>
                <p className="text-lg font-bold text-red-600">
                  <strong>Pending Amount:</strong> ₹
                  {(viewOrder.payment?.totalAmount || 0) +
                    (viewOrder.payment?.extraCharges?.amount || 0) -
                    (viewOrder.payment?.advanceAmount || 0)}
                </p>
                <p>
                  <strong>Payment Method:</strong>{" "}
                  {viewOrder.payment?.paymentMode || "N/A"}
                </p>
              </div>

              {/* Dates */}
              <div className="space-y-3 bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-3 text-purple-700 border-b pb-2">
                  Dates
                </h3>
                <p>
                  <strong>Expected Date:</strong>{" "}
                  {viewOrder.expectedDate
                    ? new Date(viewOrder.expectedDate).toLocaleDateString()
                    : "N/A"}
                </p>
                <p>
                  <strong>Created On:</strong>{" "}
                  {viewOrder.createdAt
                    ? new Date(viewOrder.createdAt).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>

              {/* Item Details */}
              <div className="space-y-3 bg-orange-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-3 text-orange-700 border-b pb-2">
                  Item Details
                </h3>
                <p>
                  <strong>Color:</strong> {viewOrder.color || "N/A"}
                </p>
                <p>
                  <strong>Raw Material:</strong>
                  {viewOrder.rawMaterial?.cloth && " Cloth"}
                  {viewOrder.rawMaterial?.lining && " Lining"}
                  {!viewOrder.rawMaterial?.cloth &&
                    !viewOrder.rawMaterial?.lining &&
                    " N/A"}
                </p>
              </div>
            </div>

            {/* Design Image */}
            <div className="mt-6">
              <h3 className="font-semibold text-lg mb-3">🎨 Design Image</h3>
              {viewOrder.designImage ? (
                <img
                  src={`${BACKEND_URL}${viewOrder.designImage}`}
                  alt="Design"
                  className="w-full max-w-md mx-auto rounded border shadow-md"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://placehold.co/400x300?text=Image+Not+Found";
                  }}
                />
              ) : (
                <p className="text-gray-500 text-center">
                  No design image uploaded
                </p>
              )}
            </div>

            {/* Measurements */}
            {viewOrder.measurements && viewOrder.measurements.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold text-lg mb-3">📏 Measurements</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {viewOrder.measurements.map((m, idx) => (
                    <div key={idx} className="bg-gray-50 p-3 rounded border">
                      <strong className="text-blue-600">{m.fieldName}:</strong>{" "}
                      {m.value || "N/A"}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Edit Modal - Comprehensive */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl relative max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center z-10">
              <h2 className="text-xl font-bold text-blue-600">✏️ Edit Order</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-red-600 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-4 text-blue-700">
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          category: e.target.value,
                          service: "", // reset service when category changes
                        })
                      }
                      className="border w-full p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat, idx) => {
                        const categoryValue = typeof cat === 'string' ? cat : cat.category || cat.name || '';
                        const categoryLabel = typeof cat === 'string' ? cat : cat.category || cat.name || '';
                        return (
                          <option key={idx} value={categoryValue}>
                            {categoryLabel}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Service
                    </label>
                    <select
                      value={formData.service}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          service: e.target.value,
                        })
                      }
                      className="border w-full p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                      disabled={!formData.category}
                    >
                      <option value="">
                        {formData.category ? "Select Service" : "Select Category First"}
                      </option>
                      {services.map((svc, idx) => {
                        const serviceName = typeof svc === 'string' ? svc : svc.name || svc.serviceName || '';
                        return (
                          <option key={idx} value={serviceName}>
                            {serviceName}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Color
                    </label>
                    <input
                      type="text"
                      value={formData.color}
                      onChange={(e) =>
                        setFormData({ ...formData, color: e.target.value })
                      }
                      className="border w-full p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Enter color"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expected Date
                    </label>
                    <input
                      type="date"
                      value={formData.expectedDate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          expectedDate: e.target.value,
                        })
                      }
                      className="border w-full p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                      className="border w-full p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    >
                      <option value="placed">Placed</option>
                      <option value="cutting">Cutting</option>
                      <option value="handworking">Handworking</option>
                      <option value="tailoring">Tailoring</option>
                      <option value="quality-check">Quality Check</option>
                      <option value="ready-to-delivery">Ready To Delivery</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Raw Material */}
              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-4 text-orange-700">
                  Raw Material
                </h3>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.rawMaterial.cloth}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          rawMaterial: {
                            ...formData.rawMaterial,
                            cloth: e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium">Cloth</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.rawMaterial.lining}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          rawMaterial: {
                            ...formData.rawMaterial,
                            lining: e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium">Lining</span>
                  </label>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-4 text-green-700">
                  Payment Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Total Amount (₹)
                    </label>
                    <input
                      type="number"
                      value={formData.payment.totalAmount}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          payment: {
                            ...formData.payment,
                            totalAmount: Number(e.target.value),
                          },
                        })
                      }
                      className="border w-full p-2 rounded focus:ring-2 focus:ring-green-500 outline-none"
                      placeholder="0"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Advance Amount (₹)
                    </label>
                    <input
                      type="number"
                      value={formData.payment.advanceAmount}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          payment: {
                            ...formData.payment,
                            advanceAmount: Number(e.target.value),
                          },
                        })
                      }
                      className="border w-full p-2 rounded focus:ring-2 focus:ring-green-500 outline-none"
                      placeholder="0"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Extra Charges (₹)
                    </label>
                    <input
                      type="number"
                      value={formData.payment.extraCharges.amount}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          payment: {
                            ...formData.payment,
                            extraCharges: {
                              ...formData.payment.extraCharges,
                              amount: Number(e.target.value),
                            },
                          },
                        })
                      }
                      className="border w-full p-2 rounded focus:ring-2 focus:ring-green-500 outline-none"
                      placeholder="0"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Extra Charges Note
                    </label>
                    <input
                      type="text"
                      value={formData.payment.extraCharges.note}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          payment: {
                            ...formData.payment,
                            extraCharges: {
                              ...formData.payment.extraCharges,
                              note: e.target.value,
                            },
                          },
                        })
                      }
                      className="border w-full p-2 rounded focus:ring-2 focus:ring-green-500 outline-none"
                      placeholder="Reason for extra charges"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <div className="bg-white p-3 rounded border-2 border-green-300">
                      <p className="text-lg font-bold text-gray-700">
                        Pending Amount:{" "}
                        <span className="text-red-600">
                          ₹
                          {formData.payment.totalAmount +
                            formData.payment.extraCharges.amount -
                            formData.payment.advanceAmount}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Measurements */}
              {formData.measurements && formData.measurements.length > 0 && (
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-4 text-purple-700">
                    📏 Measurements
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {formData.measurements.map((m, idx) => (
                      <div key={idx}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {m.fieldName}
                        </label>
                        <input
                          type="text"
                          value={m.value}
                          onChange={(e) =>
                            handleMeasurementChange(idx, e.target.value)
                          }
                          className="border w-full p-2 rounded focus:ring-2 focus:ring-purple-500 outline-none"
                          placeholder="Enter value"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4 border-t">
                <button
                  onClick={handleUpdate}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Update Order
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManagerOrders;