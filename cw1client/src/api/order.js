import api from "./axios";

// 📌 Create a new order (with FormData)
export const createOrder = async (orderData) => {
  try {
    const response = await api.post("/api/order", orderData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data; // { message, order }
  } catch (error) {
    throw error.response?.data || { message: "Error while creating order" };
  }
};

// 📌 Get all orders (optional filters: search, status)
export const getOrders = async (params = {}) => {
  try {
    const query = new URLSearchParams(params).toString();
    const response = await api.get(`/api/order${query ? `?${query}` : ""}`);
    return response.data; // plain array of orders
  } catch (error) {
    throw error.response?.data || { message: "Error while fetching orders" };
  }
};

// 📌 Get single order by ID
export const getOrderById = async (orderId) => {
  try {
    const response = await api.get(`/api/order/${orderId}`);
    return response.data; // plain order object
  } catch (error) {
    throw error.response?.data || { message: "Error while fetching order" };
  }
};

// 📌 Update an order
export const updateOrder = async (orderId, updatedData) => {
  try {
    const response = await api.put(`/api/order/${orderId}`, updatedData);
    return response.data; // updated order
  } catch (error) {
    throw error.response?.data || { message: "Error while updating order" };
  }
};

// 📌 Delete an order
export const deleteOrder = async (orderId) => {
  try {
    const response = await api.delete(`/api/order/${orderId}`);
    return response.data; // { message: "Order deleted" }
  } catch (error) {
    throw error.response?.data || { message: "Error while deleting order" };
  }
};
