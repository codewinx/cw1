import api from "./axios";

// Create Customer (Admin/Manager only)
export const createCustomer = async (customerData) => {
  try {
    const res = await api.post("/customer/createcustomer", customerData);
    return res.data;
  } catch (err) {
    // handle error gracefully
    throw err.response?.data || { message: "Server error" };
  }
};
