import api from "./axios"; // your configured axios instance
import axios from "axios";

// Get tailor info
export const gettailorinfo = async () => {
  const token = localStorage.getItem("token");
  const res = await api.get("/api/tailor/gettailorinfo", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// Get tailor tasks
export const getTasks = async () => {
  const token = localStorage.getItem("token");
  const res = await api.get("/api/tailor/gettailortasks", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// Update staff info
export const updateStaff = async (id, data) => {
  const token = localStorage.getItem("token");
  const res = await api.put(`/api/tailor/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};


export const getTaskStatusCounts = async () => {
  const token = localStorage.getItem("token");
  const res = await api.get("/api/tailor/status-count", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data; // { pending, inProgress, done }
};
export const updateTaskStatus = async (taskId, status) => {
  try {
    const token = localStorage.getItem("token");
    const res = await api.put(
      `/api/tailor/${taskId}`, 
      { status }, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data; // Updated task object
  } catch (error) {
    console.error("Error updating task status:", error);
    throw error;
  }
};
