// ManagerRoutes.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ManagerLayout from "../pages/manager/ManagerLayout";
import ManagerDashboard from "../pages/manager/ManagerDashboard";
import ManagerStaff from "../pages/manager/ManagerStaff";
import ManagerOrders from "../pages/manager/ManagerOrders";
import ManagerCutter from "../pages/manager/ManagerCutter";
import ManagerTailor from "../pages/manager/ManagerTailor";
import ManagerHandworker from "../pages/manager/ManagerHandworker";
import ManagerOrderManagement from "../pages/manager/ManagerOrderManagement";


export default function ManagerRoutes() {
  return (
    <Routes>
      <Route element={<ManagerLayout />}>
        {/* Default redirect to dashboard */}
        <Route index element={<Navigate to="dashboard" replace />} />

        {/* Child routes inside ManagerLayout */}
        <Route path="dashboard" element={<ManagerDashboard />} />
        <Route path="staff" element={<ManagerStaff />} />
        <Route path="orders" element={<ManagerOrders />} />
        <Route path="cutter" element={<ManagerCutter/>} />
        <Route path="tailor" element={<ManagerTailor/>} />
        <Route path="handworker" element={<ManagerHandworker/>} />
        <Route path="ordermanagement" element={<ManagerOrderManagement/>} />
      </Route>
    </Routes>
  );
}
