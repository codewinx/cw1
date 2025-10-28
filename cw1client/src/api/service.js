// src/api/service.js

import api from "./axios";

// 📌 Get all unique categories
export const getCategories = async () => {
  try {
    const response = await api.get("/api/categories");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Error fetching categories" };
  }
};

// 📌 Get services of a category
export const getServicesByCategory = async (category) => {
  try {
    const response = await api.get(`/api/categories/${category}/services`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Error fetching services" };
  }
};
export const getServices = async () => {
  const res = await api.get('/api/admin-manager/services');
  return res.data;
};


export const addService = async (serviceData) => {
  const res = await api.post('/api/admin-manager/add-service', serviceData);
  return res.data;
};


export const updateService = async (id, updatedData) => {
  const res = await api.put(`/api/admin-manager/service/${id}`, updatedData);
  return res.data;
};

// Delete service
export const deleteService = async (id) => {
  const res = await api.delete(`/api/admin-manager/service/${id}`);
  return res.data;
};