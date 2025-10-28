import axios from "axios";
import api from "./axios";

const API_URL = "http://localhost:5000/api/payments";

export const getPaymentsByOrderNo = async (orderNo) => {
  const res = await axios.get(`${API_URL}/${orderNo}`);
  return res.data;
};

export const addPayment = async (paymentData) => {
  const res = await axios.post(`${API_URL}/add`, paymentData);
  return res.data;
};

// export const updatePayment = async (id, paymentData) => {
//   const res = await axios.put(`${API_URL}/${id}`, paymentData);
//   return res.data;
// };

export const getPayments = async () => {
  const response = await api.get('/api/admin-manager/payment-logs');
  return response.data;
};


export const updatePayment = async (id, updatedData) => {
  const response = await api.put(`/api/admin-manager/payment/${id}`, updatedData);
  return response.data;
};


export const deletePayment = async (id) => {
  const response = await api.delete(`/api/admin-manager/payment/${id}`);
  return response.data;
};
