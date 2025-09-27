import axios from "axios";

// ✅ Create a base Axios instance
const api = axios.create({
  baseURL: "http://localhost:5000", // change if needed
  withCredentials: false,
});

// 🔐 Attach JWT token to every request if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🚨 Optional: Handle 401 globally (auto-redirect to login)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login"; // redirect to your login page
    }
    return Promise.reject(error);
  }
);

export default api;
