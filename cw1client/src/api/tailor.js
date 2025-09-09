import api from "./axios";
import axios from "axios";

export const gettailorinfo = async () => {
  const token = localStorage.getItem("token");
  const res = await api.get("/api/tailor/gettailorinfo", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const getTasks = async () => {
  const token = localStorage.getItem("token");
  const res = await api.get("/api/tailor/gettailortasks", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
export const updateStaff = async (id, data) => {
  const token = localStorage.getItem("token");
  const res = await api.put(`/api/tailor/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}
// export const updateProfile = async (id,formdata) => {
//   const token = localStorage.getItem("token");
//   const res = await api.put(`/api/tailor/${id}`, formdata, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "multipart/form-data",   // 👈 required
//     },
//   });
//   return res.data;
// };
