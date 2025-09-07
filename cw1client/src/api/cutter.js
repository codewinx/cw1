import api from "./axios";

export const getStaff = async () => {
  const token = localStorage.getItem("token");
  const res = await api.get("/api/cutter/getcutterdetails", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
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

