import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminLayout from "../pages/admin/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route path="admin/dashboard" element={<AdminDashboard />} />
      </Route>
    </Routes>
  );
}
