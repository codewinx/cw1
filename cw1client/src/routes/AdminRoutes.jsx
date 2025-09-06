import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../pages/admin/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminCustomers from "../pages/admin/AdminCustomers";
import AdminStaffManagement from "../pages/admin/AdminStaffManagement";
import AdminOrders from "../pages/admin/AdminOrders";
import AdminPayments from "../pages/admin/AdminPayments";
import AdminTaskManager from "../pages/admin/AdminTaskManager";
import AddCustomer from "../pages/admin/AdminAddCustomer"; // ✅ import


export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="admin" element={<AdminLayout />}>
        {/* Default redirect to dashboard */}
        <Route index element={<Navigate to="dashboard" replace />} />

        {/* All child routes stay inside AdminLayout */}
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="customers" element={<AdminCustomers />} />
               <Route path="admin/customers/add" element={<AddCustomer />} /> {/* ✅ */}
        <Route path="staff" element={<AdminStaffManagement />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="reports" element={<AdminOrders />} />
        <Route path="payments" element={<AdminPayments />} />
        <Route path="tasks" element={<AdminTaskManager />} />


      </Route>
    </Routes>
  );
}
