import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../pages/admin/AdminLayout";
import AdminManagerDashboard from "../pages/adminmanager/AdminManagerDashboard";
import AdminManagerCustomers from "../pages/adminmanager/AdminManagerCustomers";
import AdminManagerStaffManage from "../pages/adminmanager/AdminManagerStaffManage";
import AdminManagerOrder from "../pages/adminmanager/AdminManagerOrder";
import AdminPayments from "../pages/admin/AdminPayments";
import AdminManagerTask from "../pages/adminmanager/AdminManagerTask";
import AdminManagerAddCustomer from "../pages/adminmanager/AdminManagerAddCustomer"; // ✅ import


export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="admin" element={<AdminLayout />}>
        {/* Default redirect to dashboard */}
        <Route index element={<Navigate to="dashboard" replace />} />

        {/* All child routes stay inside AdminLayout */}
        <Route path="dashboard" element={<AdminManagerDashboard />} />
        <Route path="customers" element={<AdminManagerCustomers />} />
        <Route path="admin/customers/add" element={<AdminManagerAddCustomer />} /> {/* ✅ */}
        <Route path="staff" element={<AdminManagerStaffManage />} />
        <Route path="orders" element={<AdminManagerOrder />} />
        <Route path="reports" element={<AdminManagerOrder />} />
        <Route path="payments" element={<AdminPayments />} />
        <Route path="tasks" element={<AdminManagerTask />} />


      </Route>
    </Routes>
  );
}
