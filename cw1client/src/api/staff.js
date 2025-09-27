import axios from "./axios";

// Create staff
export const createStaff = (data) => axios.post("/api/staff", data);

// Get all staff
export const getAllStaff = () => axios.get("/api/staff");

// Get single staff
export const getStaffById = (id) => axios.get(`/api/staff/${id}`);

// Update staff
export const updateStaff = (id, data) => axios.put(`/api/staff/${id}`, data);

// Delete staff
export const deleteStaff = (id) => axios.delete(`/api/staff/${id}`);
