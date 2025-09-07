// src/api/order.js
import api from "./axios";

// 📌 Create a new order
export const createOrder = async (orderData) => {
  try {
    const response = await api.post("/api/order/create", orderData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Error while adding order" };
  }
};

// 📌 Get all orders (with optional filters: search, status)
export const getOrders = async (params = {}) => {
  try {
    const query = new URLSearchParams(params).toString(); 
    const response = await api.get(`/api/order${query ? `?${query}` : ""}`);
    // Corrected line: return the data array
    return response.data.data;
  } catch (error) {
    throw error.response?.data || { message: "Error while fetching orders" };
  }
};

// 📌 Get single order by ID
export const getOrderById = async (orderId) => {
  try {
    const response = await api.get(`/api/order/${orderId}`);
    // Corrected line: return the data object
    return response.data.data;
  } catch (error) {
    throw error.response?.data || { message: "Error while fetching order" };
  }
};

// 📌 Update an order
export const updateOrder = async (orderId, orderData) => {
  try {
    const response = await api.put(`/api/order/${orderId}`, orderData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Error while updating order" };
  }
};

// 📌 Delete an order
export const deleteOrder = async (orderId) => {
  try {
    const response = await api.delete(`/api/order/${orderId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Error while deleting order" };
  }
};