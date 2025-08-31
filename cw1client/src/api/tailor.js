import axios from "axios";

const API_URL = "http://localhost:5000/api/tailor"; // adjust if needed

// Get all orders
export const getOrders = async () => {
  return await axios.get(`${API_URL}/orders`);
};

// Get measurements by orderId
export const getMeasurements = async (orderId) => {
  return await axios.get(`${API_URL}/orders/${orderId}/measurements`);
};

// Update order status
export const updateOrderStatus = async (orderId, status) => {
  return await axios.put(`${API_URL}/orders/${orderId}/status`, { status });
};
