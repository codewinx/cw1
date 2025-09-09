// ManagerRoutes.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ManagerLayout from "../pages/manager/ManagerLayout";
import ManagerDashboard from "../pages/manager/ManagerDashboard";

export default function ManagerRoutes() {
  return (
    <Routes>
      <Route element={<ManagerLayout />}>
        {/* Default redirect to dashboard */}
        <Route index element={<Navigate to="dashboard" replace />} />

        {/* Child routes inside ManagerLayout */}
        <Route path="dashboard" element={<ManagerDashboard />} />
      </Route>
    </Routes>
  );
}
