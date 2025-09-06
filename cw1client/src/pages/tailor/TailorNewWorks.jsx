import { useEffect, useState } from "react";
import { getOrders, getMeasurements, updateOrderStatus } from "../../api/tailor";

export default function TailorNewWorks() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [measurements, setMeasurements] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await getOrders();
      setOrders(res.data.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      fetchOrders(); // refresh orders after update
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const handleViewMeasurements = async (orderId) => {
    try {
      const res = await getMeasurements(orderId);
      setMeasurements(res.data.data);
      setSelectedOrder(orderId);
      setShowModal(true);
    } catch (err) {
      console.error("Error fetching measurements:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <p className="text-center">Loading...</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Orders</h2>
      <table className="w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Order No</th>
            <th className="border p-2">Category</th>
            <th className="border p-2">Service</th>
            <th className="border p-2">Expected Date</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td className="border p-2">{order.orderNo}</td>
              <td className="border p-2">{order.category}</td>
              <td className="border p-2">{order.service}</td>
              <td className="border p-2">
                {order.expectedDate
                  ? new Date(order.expectedDate).toLocaleDateString()
                  : "N/A"}
              </td>
              <td className="border p-2">
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  className="border px-2 py-1 rounded"
                >
                  <option value="placed">Placed</option>
                  <option value="cutting">Cutting</option>
                  <option value="handworking">Handworking</option>
                  <option value="tailoring">Tailoring</option>
                  <option value="finishing">Finishing</option>
                  <option value="qualifying">Qualifying</option>
                  <option value="completed">Completed</option>
                </select>
              </td>
              <td className="border p-2">
                <button
                  onClick={() => handleViewMeasurements(order._id)}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  View Measurements
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Measurements */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-1/2 shadow-lg">
            <h3 className="text-lg font-bold mb-4">Measurements</h3>
            {measurements.length > 0 ? (
              <ul className="space-y-2">
                {measurements.map((m) => (
                  <li key={m._id} className="border p-2 rounded">
                    <strong>Category:</strong> {m.category} <br />
                    <strong>Data:</strong>{" "}
                    {typeof m.data === "object"
                      ? JSON.stringify(m.data)
                      : m.data}{" "}
                    <br />
                    <strong>Date:</strong>{" "}
                    {new Date(m.createdAt).toLocaleString()}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No measurements found.</p>
            )}
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 bg-red-500 text-white px-3 py-1 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
