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