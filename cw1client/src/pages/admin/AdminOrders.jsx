import React, { useEffect, useState } from "react";
import { getOrders, deleteOrder, updateOrder, getOrderById } from "../../api/order";
import { Search, Eye, Edit, Trash2, X, Calendar } from "lucide-react";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // New state for filters
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

  // Fetch orders with filters
  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const params = {
        search: search,
        status: statusFilter,
        startDate: startDate,
        endDate: endDate,
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
    // Debounce search to prevent excessive API calls
    const handler = setTimeout(() => {
      fetchOrders();
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [search, statusFilter, startDate, endDate]);

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      await deleteOrder(id);
      fetchOrders();
    } catch (err) {
      alert(err.message || "Error deleting order");
    }
  };

  // Edit
  const handleEdit = (order) => {
    setEditOrder(order);
    setFormData({
      category: order.category,
      service: order.service,
      totalAmount: order.totalAmount,
      status: order.status,
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

  // View
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

      {/* Search and Filters */}
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
            <option value="finishing">Finishing</option>
            <option value="qualifying">Qualifying</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Date Filters */}
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
                    <td className="px-4 py-3">{order.customer?.name || "N/A"}</td>
                    <td className="px-4 py-3">{order.category}</td>
                    <td className="px-4 py-3">{order.service}</td>
                    <td className="px-4 py-3">₹{order.totalAmount}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          order.status === "completed"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
            <button
              onClick={() => setViewOrder(null)}
              className="absolute top-2 right-2 text-gray-500"
            >
              <X />
            </button>
            <h2 className="text-lg font-bold mb-4">Order Details</h2>
            <div className="space-y-2">
              <p><strong>Order No:</strong> {viewOrder.orderNo}</p>
              <p><strong>Customer:</strong> {viewOrder.customer?.name}</p>
              <p><strong>Category:</strong> {viewOrder.category}</p>
              <p><strong>Service:</strong> {viewOrder.service}</p>
              <p><strong>Total Amount:</strong> ₹{viewOrder.totalAmount}</p>
              <p><strong>Advance Amount:</strong> ₹{viewOrder.advanceAmount}</p>
              <p><strong>Pending Amount:</strong> ₹{viewOrder.pendingAmount}</p>
              <p><strong>Payment Method:</strong> {viewOrder.paymentMethod}</p>
              <p><strong>Status:</strong> {viewOrder.status}</p>
              <p><strong>Expected Date:</strong> {viewOrder.expectedDate ? new Date(viewOrder.expectedDate).toLocaleDateString() : 'N/A'}</p>
              <p><strong>Created On:</strong> {new Date(viewOrder.createdAt).toLocaleDateString()}</p>
              <p><strong>Created By:</strong> {viewOrder.createdBy?.name || 'N/A'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
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
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="border w-full p-2 rounded mb-2"
            />
            <input
              type="text"
              placeholder="Service"
              value={formData.service}
              onChange={(e) => setFormData({ ...formData, service: e.target.value })}
              className="border w-full p-2 rounded mb-2"
            />
            <input
              type="number"
              placeholder="Total Amount"
              value={formData.totalAmount}
              onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
              className="border w-full p-2 rounded mb-2"
            />
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="border w-full p-2 rounded mb-2"
            >
              <option value="placed">Placed</option>
              <option value="cutting">Cutting</option>
              <option value="handworking">Handworking</option>
              <option value="tailoring">Tailoring</option>
              <option value="finishing">Finishing</option>
              <option value="qualifying">Qualifying</option>
              <option value="completed">Completed</option>
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

export default AdminOrders;