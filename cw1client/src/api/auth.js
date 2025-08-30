// src/api/admin.js
import api from "./axios";

// User Login
export const userLogin = async (username, password) => {
  try {
    const res = await api.post("/auth/login", { username, password });

    if (res.data.token) {
      localStorage.setItem("token", res.data.token); // Save token
    }

    return res.data; // contains role, token, etc.
  } catch (err) {
    console.error("Login failed:", err.response?.data || err.message);
    throw err;
  }
};

// Get Admin Profile
export const getAdminProfile = async () => {
  const res = await api.get("/auth/profile");
  return res.data;
};

// Logout
export const adminLogout = () => {
  localStorage.removeItem("token");
};
