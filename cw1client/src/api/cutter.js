import api from "./axios";

// Get current logged-in staff
export const getCurrentStaff = async () => {
  try {
    const token = localStorage.getItem("token"); // JWT token
    const res = await api.get("/api/cutter/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data; // { success: true, staff: { ... } }
  } catch (err) {
    console.error("Error fetching current staff:", err);
    throw err;
  }
};

export const updateStaff = async (id, data) => {
  const token = localStorage.getItem("token");
  const res = await api.put(`/api/cutter/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

export const getTasks = async () => {
  const token = localStorage.getItem("token");
  const res = await api.get("/api/cutter/getcuttertasks", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const updateProfile = async (id,formdata) => {
  const token = localStorage.getItem("token");
  const res = await api.put(`/api/cutter/${id}`, formdata, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",   // 👈 required
    },
  });
  return res.data;
};

export const updateTaskStatus = async (taskId, status, remarks = "") => {
  const token = localStorage.getItem("token");

  const res = await api.put(
    `/api/cutter/${taskId}`, // remove /status
    { status, remarks },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};
