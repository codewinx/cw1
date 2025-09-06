// src/api/customer.js
import api from "./axios";

// ✅ Create a new customer
export const createCustomer = async (customerData) => {
  try {
    const response = await api.post("/api/customer/createcustomer", customerData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Error while adding customer" };
  }
};

// ✅ Search customers (by name or ID)
export const searchCustomers = async (query) => {
  try {
    const response = await api.get(`/api/customer/searchcustomers?query=${query}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Error while searching customers" };
  }
};

// ✅ Get all customers with order numbers
export const getCustomers = async (search = "") => {
  try {
    const response = await api.get(`/api/customer/customers?search=${search}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Error while fetching customers" };
  }
};
