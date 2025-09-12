import api from "./axios"; // your configured axios instance
import axios from "axios";
export const getTasks = async () => {
  const token = localStorage.getItem("token");
  const res = await api.get("/api/manager/getmanagertasks", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
// export const updateTaskStatus = async (taskId, status, remarks) => {
//   const res = await api.put(`/api/manager/${taskId}/status`, { status, remarks });
//   return res.data;
// };
export const updateTaskStatus = async (taskId, status) => {
  try {
    const token = localStorage.getItem("token");
    const res = await api.put(
      `/api/manager/${taskId}`, 
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