import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ManagerLayout from "../pages/manager/ManagerLayout";
import ManagerDashboard from "../pages/manager/ManagerDashboard";
// import ManagerProfile from "../pages/manager/ManagerProfile";
// import other manager pages as you build them, e.g.:
// import ManagerStaff from "../pages/manager/ManagerStaff";
// import ManagerInventory from "../pages/manager/ManagerInventory";
// import ManagerOrders from "../pages/manager/ManagerOrders";
// import ManagerSales from "../pages/manager/ManagerSales";
// import ManagerReports from "../pages/manager/ManagerReports";

export default function ManagerRoutes() {
  return (
    <Routes>
      <Route element={<ManagerLayout />}>
        {/* Default redirect to dashboard */}
        <Route index element={<Navigate to="dashboard" replace />} />

        {/* All child routes stay inside ManagerLayout */}
        <Route path="dashboard" element={<ManagerDashboard />} />
        {/* <Route path="profile" element={<ManagerProfile />} /> */}

        {/* Uncomment as you add pages */}
        {/* <Route path="staff" element={<ManagerStaff />} /> */}
        {/* <Route path="inventory" element={<ManagerInventory />} /> */}
        {/* <Route path="orders" element={<ManagerOrders />} /> */}
        {/* <Route path="sales" element={<ManagerSales />} /> */}
        {/* <Route path="reports" element={<ManagerReports />} /> */}
      </Route>
    </Routes>
  );
}
