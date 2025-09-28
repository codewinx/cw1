import api from "./axios";

// ✅ Create a new customer
export const createCustomer = async (customerData) => {
  try {
    const response = await api.post("/api/customer", customerData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Error while adding customer" };
  }
};

// ✅ Search customers (by name or ID)
export const searchCustomers = async (query) => {
  try {
    const response = await api.get(`/api/customer/search?query=${query}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Error while searching customers" };
  }
};

// ✅ Get all customers
export const fetchCustomers = async () => {
  try {
    const response = await api.get("/api/customer");
    return response.data; // return directly
  } catch (error) {
    throw error.response?.data || { message: "Error while fetching customers" };
  }
};
export const getCustomerById = async (id) => {
  try {
    const res = await api.get(`/api/customer/${id}`); // ✅ use backticks + correct base instance
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: "Error while fetching customer" };
  }
};
// ✅ Update customer
export const updateCustomer = async (id, updatedData) => {
  return await api.put(`/api/customer/${id}`, updatedData);
};

// ✅ Delete customer
export const deleteCustomer = async (id) => {
  return await api.delete(`/api/customer/${id}`);
};
