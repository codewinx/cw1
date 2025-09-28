// apis/task.js
import api from "./axios";

// Create & assign a task
export const assignTask = async (taskData) => {
  const res = await api.post("/api/task", taskData);
  return res.data;
};

// Get all tasks (Admin/Manager view)
export const getAllTasks = async () => {
  const res = await api.get("/api/task");
  return res.data;
};

// Get tasks for a specific staff
export const getTasksByStaff = async (staffId) => {
  const res = await api.get(`/api/task/staff/${staffId}`);
  return res.data;
};

// Update task status
export const updateTaskStatus = async (taskId, status, remarks) => {
  const res = await api.put(`/api/task/${taskId}/status`, { status, remarks });
  return res.data;
};

// Delete task
export const deleteTask = async (taskId) => {
  const res = await api.delete(`/api/task/${taskId}`);
  return res.data;
};

// 🔹 NEW APIS FOR STAFF ASSIGNMENT

// Get assignable staff by category
export const getAssignableStaff = async (serviceId) => {
  const res = await api.get(`/api/task/assignable-staff/${serviceId}`);
  return res.data;
};

// Get orders with items
export const getOrdersWithItems = async () => {
  const res = await api.get("/api/task/orders-with-items");
  return res.data;
};