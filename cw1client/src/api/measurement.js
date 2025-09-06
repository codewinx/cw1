import api from "./axios";

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