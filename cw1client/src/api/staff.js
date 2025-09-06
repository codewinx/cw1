import api from "./axios"; // ✅ your axios.js file

// CREATE Staff
export const createStaff = (data) => {
  return api.post("/api/staff", data);
};

// GET all staff
export const getAllStaff = () => {
  return api.get("/api/staff");
};

// GET single staff by ID
export const getStaffById = (id) => {
  return api.get(`/api/staff/${id}`);
};

// UPDATE staff
export const updateStaff = (id, data) => {
  return api.put(`/api/staff/${id}`, data);
};

// DELETE staff
export const deleteStaff = (id) => {
  return api.delete(`/api/staff/${id}`);
};
