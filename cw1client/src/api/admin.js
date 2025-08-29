import api from "./axios";

// Admin Login
export const adminLogin = async (username, password) => {
  try {
    // ✅ only pass relative path since baseURL is already in axios.js
    const res = await api.post("/auth/login", { username, password });

    if (res.data.token) {
      localStorage.setItem("token", res.data.token); // Save token
    }

    return res.data;
  } catch (err) {
    console.error("Login failed:", err.response?.data || err.message);
    throw err; // rethrow for UI handling
  }
};

// Get Admin Profile
export const getAdminProfile = async () => {
  const res = await api.get("/auth/profile");
  return res.data;
};

// Logout Admin
export const adminLogout = () => {
  localStorage.removeItem("token");
};
