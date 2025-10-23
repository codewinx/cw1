import React, { useEffect, useState } from "react";
import {
  getOrders,
  deleteOrder,
  updateOrder,
  getOrderById,
} from "../../api/admin+manager.js";
import { Search, Eye, Edit, Trash2, X, Calendar } from "lucide-react";

// ⚠️ Update this to match your backend URL
const BACKEND_URL = "http://localhost:5000"; // Change this to your actual backend URL

const AdminManagerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
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
    totalAmount: "",
    status: "",
  });

  // Fetch orders
  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const params = {
        search,
        status: statusFilter,
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
  }, [search, statusFilter, startDate, endDate]);

  // Delete order
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      await deleteOrder(id);
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
      totalAmount: order.payment?.totalAmount || order.totalAmount || 0,
      status: order.status || "placed",
    });
    setIsModalOpen(true);
  };

  const handleUpdate = async () => {
    try {
      await updateOrder(editOrder._id, formData);
      setIsModalOpen(false);
      setEditOrder(null);
      fetchOrders();
    } catch (err) {
      alert(err.message || "Error updating order");
    }
  };

  // View order
  const handleView = async (id) => {
    try {
      const data = await getOrderById(id);
      console.log("Order data:", data); // Debug log
      setViewOrder(data);
    } catch (err) {
      alert(err.message || "Error fetching order");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        📦 Order Management
      </h1>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="flex items-center border rounded-lg px-3 py-2 w-full sm:w-1/3 bg-white shadow-sm">
          <Search className="text-gray-400 mr-2 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by Order No, Category, or Service..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full outline-none text-sm"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center border rounded-lg px-3 py-2 w-full sm:w-1/4 bg-white shadow-sm">
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
        <div className="flex items-center gap-2 w-full sm:w-1/3 bg-white shadow-sm rounded-lg p-2">
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
        <p>Loading orders...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
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
                  <tr key={order._id} className="border-b">
                    <td className="px-4 py-3">{order.orderNo}</td>
                    <td className="px-4 py-3">
                      {order.customer?.name || "N/A"}
                    </td>
                    <td className="px-4 py-3">
                      {order.category || order.service?.category || "N/A"}
                    </td>
                    <td className="px-4 py-3">
                      {order.service?.name || "N/A"}
                    </td>
                    <td className="px-4 py-3">
                      ₹{order.payment?.totalAmount || order.totalAmount || 0}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          order.status === "ready to delivery"
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
                        className="p-2 bg-gray-100 rounded hover:bg-gray-200"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(order)}
                        className="p-2 bg-blue-100 rounded hover:bg-blue-200"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(order._id)}
                        className="p-2 bg-red-100 rounded hover:bg-red-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="px-4 py-6 text-center text-gray-500"
                  >
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setViewOrder(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
            >
              <X />
            </button>
            <h2 className="text-xl font-bold mb-4 text-center">📋 Order Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {/* Order Information */}
              <div className="space-y-2">
                <h3 className="font-semibold text-lg mb-2 text-blue-600">Order Info</h3>
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
                  <strong>Category:</strong> {viewOrder.category || viewOrder.service?.category || "N/A"}
                </p>
                <p>
                  <strong>Service:</strong> {viewOrder.service?.name || "N/A"}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    viewOrder.status === "ready to delivery"
                      ? "bg-green-100 text-green-700"
                      : viewOrder.status === "placed"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-blue-100 text-blue-700"
                  }`}>
                    {viewOrder.status}
                  </span>
                </p>
              </div>

              {/* Payment Information - FIXED */}
              <div className="space-y-2">
                <h3 className="font-semibold text-lg mb-2 text-green-600">Payment Info</h3>
                <p>
                  <strong>Total Amount:</strong> ₹{viewOrder.payment?.totalAmount || 0}
                </p>
                <p>
                  <strong>Advance Amount:</strong> ₹{viewOrder.payment?.advanceAmount || 0}
                </p>
                <p>
                  <strong>Extra Charges:</strong> ₹{viewOrder.payment?.extraCharges?.amount || 0}
                  {viewOrder.payment?.extraCharges?.note && (
                    <span className="text-xs text-gray-500 block">({viewOrder.payment.extraCharges.note})</span>
                  )}
                </p>
                <p className="text-lg font-bold text-red-600">
                  <strong>Pending Amount:</strong> ₹{
                    (viewOrder.payment?.totalAmount || 0) + 
                    (viewOrder.payment?.extraCharges?.amount || 0) - 
                    (viewOrder.payment?.advanceAmount || 0)
                  }
                </p>
                <p>
                  <strong>Payment Method:</strong> {viewOrder.payment?.paymentMode || "N/A"}
                </p>
              </div>

              {/* Dates */}
              <div className="space-y-2">
                <h3 className="font-semibold text-lg mb-2 text-purple-600">Dates</h3>
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

              {/* Measurements & Details */}
              <div className="space-y-2">
                <h3 className="font-semibold text-lg mb-2 text-orange-600">Item Details</h3>
                <p>
                  <strong>Color:</strong> {viewOrder.color || "N/A"}
                </p>
                <p>
                  <strong>Raw Material:</strong>
                  {viewOrder.rawMaterial?.cloth && " Cloth"}
                  {viewOrder.rawMaterial?.lining && " Lining"}
                  {!viewOrder.rawMaterial?.cloth && !viewOrder.rawMaterial?.lining && " N/A"}
                </p>
              </div>
            </div>

            {/* Design Image - FIXED */}
            {viewOrder.designImage && (
              <div className="mt-4">
                <h3 className="font-semibold text-lg mb-2">🎨 Design Image</h3>
                <img 
                  src={`${BACKEND_URL}${viewOrder.designImage}`}
                  alt="Design" 
                  className="w-full max-w-md mx-auto rounded border shadow-md"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                  }}
                />
              </div>
            )}

            {/* Measurements */}
            {viewOrder.measurements && viewOrder.measurements.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold text-lg mb-2">📏 Measurements</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                  {viewOrder.measurements.map((m, idx) => (
                    <div key={idx} className="bg-gray-50 p-2 rounded">
                      <strong>{m.fieldName}:</strong> {m.value || "N/A"}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-gray-500"
            >
              <X />
            </button>
            <h2 className="text-lg font-bold mb-4">Edit Order</h2>
            <input
              type="text"
              placeholder="Category"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="border w-full p-2 rounded mb-2"
            />
            <input
              type="text"
              placeholder="Service"
              value={formData.service}
              onChange={(e) =>
                setFormData({ ...formData, service: e.target.value })
              }
              className="border w-full p-2 rounded mb-2"
            />
            <input
              type="number"
              placeholder="Total Amount"
              value={formData.totalAmount}
              onChange={(e) =>
                setFormData({ ...formData, totalAmount: e.target.value })
              }
              className="border w-full p-2 rounded mb-2"
            />
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className="border w-full p-2 rounded mb-2"
            >
              <option value="placed">Placed</option>
              <option value="cutting">Cutting</option>
              <option value="handworking">Handworking</option>
              <option value="tailoring">Tailoring</option>
              <option value="quality-check">Quality Check</option>
              <option value="ready to delivery">Ready To Delivery</option>
            </select>
            <button
              onClick={handleUpdate}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Update Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManagerOrders;