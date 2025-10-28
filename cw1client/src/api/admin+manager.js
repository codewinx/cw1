  import api from "./axios";

  // 📌 Create a new order (with FormData)
  export const createOrder = async (orderData) => {
    try {
      // Make sure to use the correct endpoint - /api/orders (plural)
      const response = await api.post("/api/admin-manager/orders", orderData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data; // { message, orders, summary }
    } catch (error) {
      console.error("API Error:", error);
      throw error.response?.data || { message: "Error while creating order" };
    }
  };


  // // 📌 Get all orders (optional filters: search, status)
  // export const getOrders = async (params = {}) => {
  //   try {
  //     const query = new URLSearchParams(params).toString();
  //     const response = await api.get(`/api/admin-manager${query ? `?${query}` : ""}`);
  //     return response.data; // plain array of orders
  //   } catch (error) {
  //     throw error.response?.data || { message: "Error while fetching orders" };
  //   }
  // };

  // export const getOrderStats = async () => {
  //   try {
  //     const token = localStorage.getItem("token");

  //     const res = await api.get("/api/auth/stats", {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     return res.data; // { success: true, data: {...} }
  //   } catch (err) {
  //     throw err.response?.data || { message: "Error fetching order stats" };
  //   }
  // };
  // // 📌 Get single order by ID
  // export const getOrderById = async (orderId) => {
  //   try {
  //     const response = await api.get(`/api/order/${orderId}`);
  //     return response.data; // plain order object
  //   } catch (error) {
  //     throw error.response?.data || { message: "Error while fetching order" };
  //   }
  // };

  // // 📌 Update an order
  // export const updateOrder = async (orderId, updatedData) => {
  //   try {
  //     const response = await api.put(`/api/order/${orderId}`, updatedData);
  //     return response.data; // updated order
  //   } catch (error) {
  //     throw error.response?.data || { message: "Error while updating order" };
  //   }
  // };

  // // 📌 Delete an order
  // export const deleteOrder = async (orderId) => {
  //   try {
  //     const response = await api.delete(`/api/order/${orderId}`);
  //     return response.data; // { message: "Order deleted" }
  //   } catch (error) {
  //     throw error.response?.data || { message: "Error while deleting order" };
  //   }
  // };

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
  /**
   * 📌 Get all measurement profiles for a specific customer.
   * @param {string} customerId The ID of the customer.
   * @returns {Promise<Array>} A promise that resolves to an array of measurement objects.
   */
  export const getMeasurementsByCustomerId = async (customerId) => {
    try {
      const response = await api.get(`/api/measurement/customer/${customerId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Error fetching customer measurements" };
    }
  };

  /**
   * 📌 Create a new measurement profile for a customer.
   * @param {string} customerId The ID of the customer.
   * @param {string} category The category of the measurement (e.g., "Blouse").
   * @param {Array} data An array of measurement key-value pairs.
   * @returns {Promise<Object>} A promise that resolves to the new measurement object.
   */
  export const createMeasurement = async (customerId, category, data) => {
    try {
      const response = await api.post("/api/measurement", { customerId, category, data });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Error creating new measurement" };
    }
  };

  /**
   * 📌 Update an existing measurement profile.
   * @param {string} measurementId The ID of the measurement to update.
   * @param {Array} data The updated array of measurement key-value pairs.
   * @returns {Promise<Object>} A promise that resolves to the updated measurement object.
   */
  export const updateMeasurement = async (measurementId, data) => {
    try {
      const response = await api.put(`/api/measurement/${measurementId}`, { data });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Error updating measurement" };
    }
    
  };

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

  // Create staff
  export const createStaff = (data) => api.post("/api/staff", data);

  // Get all staff
  export const getAllStaff = () => api.get("/api/staff");

  // Get single staff
  export const getStaffById = (id) => api.get(`/api/staff/${id}`);

  // Update staff
  export const updateStaff = (id, data) => api.put(`/api/staff/${id}`, data);

  // Delete staff
  export const deleteStaff = (id) => api.delete(`/api/staff/${id}`);
  // Create & assign a task
  export const assignTask = async (taskData) => {
    const res = await api.post("/api/admin-manager/assign-task", taskData);
    return res.data;
  };

  // Get all tasks (Admin/Manager view)
  export const getAllTasks = async () => {
    const res = await api.get("/api/admin-manager");
    return res.data;
  };

  // Get tasks for a specific staff
  export const getTasksByStaff = async (staffId) => {
    const res = await api.get(`/api/admin-manager/staff/${staffId}`);
    return res.data;
  };

  // Update task status
  export const updateTaskStatus = async (taskId, status, remarks) => {
    const res = await api.put(`/api/admin-manager/${taskId}/status`, { status, remarks });
    return res.data;
  };

  // Delete task
  export const deleteTask = async (taskId) => {
    const res = await api.delete(`/api/admin-manager/${taskId}`);
    return res.data;
  };

  // 🔹 NEW APIS FOR STAFF ASSIGNMENT

  // Get assignable staff by category
  export const getAssignableStaff = async (serviceId) => {
    const res = await api.get(`/api/admin-manager/assignable-staff/${serviceId}`);
    return res.data;
  };

  // Get orders with items
  export const getOrdersWithItems = async () => {
    const res = await api.get("/api/admin-manager/orders-with-items");
    return res.data;
  };


  // Common Order APIs

  export const getOrders = async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await api.get(`/api/admin-manager/orders${query ? `?${query}` : ""}`);
    return res.data;
  };

  // Fetch single order by ID
  export const getOrderById = async (id) => {
    const res = await api.get(`/api/admin-manager/orders/${id}`);
    return res.data;
  };

  // Update order
  // export const updateOrder = async (id, data) => {
  //   const res = await api.put(`/api/admin-manager/orders/${id}`, data);
  //   return res.data;
  // };

  // Delete order
  export const deleteOrder = async (id) => {
    const res = await api.delete(`/api/admin-manager/orders/${id}`);
    return res.data;
  };

  // 🔍 Search customers API
  export const searchCustomer = async (query) => {
    const res = await api.get(`/api/admin-manager/search?query=${query}`);
    return res.data;
  };
  // Update the updateOrder function in your admin+manager.js

// Update order - COMPREHENSIVE VERSION

// 🔍 Search customers API
export const updateOrder = async (id, data) => {
  try {
    const res = await api.put(`/api/admin-manager/orders/${id}`, {
      category: data.category,
      service: data.service,
      color: data.color,
      expectedDate: data.expectedDate,
      status: data.status,
      rawMaterial: {
        cloth: data.rawMaterial?.cloth || false,
        lining: data.rawMaterial?.lining || false
      },
      measurements: data.measurements || [],
      payment: {
        totalAmount: Number(data.payment?.totalAmount) || 0,
        advanceAmount: Number(data.payment?.advanceAmount) || 0,
        extraCharges: {
          amount: Number(data.payment?.extraCharges?.amount) || 0,
          note: data.payment?.extraCharges?.note || ""
        }
      }
    });
    return res.data;
  } catch (error) {
    console.error("Error updating order:", error);
    throw error.response?.data || { message: "Error updating order" };
  }
};

