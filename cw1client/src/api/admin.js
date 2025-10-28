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


export const getOrderStats = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await api.get("/api/auth/stats", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data; // { success: true, data: {...} }
  } catch (err) {
    throw err.response?.data || { message: "Error fetching order stats" };
  }
};

