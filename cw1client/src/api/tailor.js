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
  try {
    const token = localStorage.getItem("token"); // JWT from login
    const res = await axios.get("/api/tailor/status-count", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Map backend response to expected shape
    const data = res.data;

    return {
      pending: data.pending ?? data.pendingCount ?? 0,
      inProgress: data.inProgress ?? data.inProgressCount ?? 0,
      done: data.done ?? data.completed ?? data.doneCount ?? 0,
    };
  } catch (err) {
    console.error("Error fetching task status counts:", err);
    return { pending: 0, inProgress: 0, done: 0 };
  }
};
