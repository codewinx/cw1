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

// export const getOrderStats = async () => {
//   const token = localStorage.getItem("token");

//   const res = await api.get("/api/auth/stats", {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   return res.data; // will contain { success: true, data: {...} }
// };


// 📊 Get Order Stats
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

export const getPayments = async () => {
  const response = await api.get('/api/admin-manager/payment-logs');
  return response.data;
};

// ✅ Update a payment
export const updatePayment = async (id, updatedData) => {
  const response = await api.put(`/api/admin-manager/payment/${id}`, updatedData);
  return response.data;
};

// ✅ Delete a payment
export const deletePayment = async (id) => {
  const response = await api.delete(`/api/admin-manager/payment/${id}`);
  return response.data;
};
