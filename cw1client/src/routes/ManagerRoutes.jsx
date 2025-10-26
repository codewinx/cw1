// ManagerRoutes.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ManagerLayout from "../pages/manager/ManagerLayout";
// import AdminManagerTask from "../pages/adminmanager/AdminManagerTask";
// import ManagerInprogressTasks from "../pages/manager/ManagerInprogressTasks";
// import ManagerCompletedTasks from "../pages/manager/ManagerCompletedTasks";
// import ManagerReassignTasks from "../pages/manager/ManagerReassignTasks";
// import AdminManagerOrder from "../pages/adminmanager/AdminManagerOrder";
// import AdminManagerDashboard from "../pages/adminmanager/AdminManagerDashboard";
// import AdminManagerCustomers from "../pages/adminmanager/AdminManagerCustomers";
// import AdminManagerStaffManage from "../pages/adminmanager/AdminManagerStaffManage";
import AdminManagerAddCustomer from "../pages/adminmanager/AdminManagerAddCustomer";
import AdminManagerServiceControl from "../pages/adminmanager/AdminManagerServiceControl";
import AdminManagerTask from "../pages/adminmanager/AdminManagerTask";
import AdminManagerDashboard from "../pages/adminmanager/AdminManagerDashboard";
import AdminManagerCustomers from "../pages/adminmanager/AdminManagerCustomers";
import AdminManagerStaffManage from "../pages/adminmanager/AdminManagerStaffManage";
import AdminManagerOrder from "../pages/adminmanager/AdminManagerOrder";
import AdminPayments from "../pages/admin/AdminPayments";

export default function ManagerRoutes() {
  return (
    <Routes>
      <Route element={<ManagerLayout />}>
        {/* Default redirect to dashboard */}
        <Route index element={<Navigate to="dashboard" replace />} />

        {/* Child routes inside ManagerLayout */}
        <Route path="dashboard" element={<AdminManagerDashboard />} />
                <Route path="customers" element={<AdminManagerCustomers />} />
                <Route path="admin/customers/add" element={<AdminManagerAddCustomer />} /> {/* ✅ */}
   <Route path="staff" element={<AdminManagerStaffManage />} />
        <Route path="orders" element={<AdminManagerOrder />} />
        <Route path="payments" element={<AdminPayments />} />
        <Route path="tasks" element={<AdminManagerTask />} />
        <Route path="service-control" element={<AdminManagerServiceControl />} />

        {/* <Route path="task" element={<AdminManagerTask />} />
        <Route path="in-progress tasks" element={<ManagerInprogressTasks />} />
        <Route path="completedtasks" element={<ManagerCompletedTasks />} />
        <Route path="reassigntasks" element={<ManagerReassignTasks />} />
        <Route path="ordermanagement" element={<AdminManagerOrder />} />
        <Route path="customers" element={<AdminManagerCustomers />} />
        <Route path="staffmanager" element={<AdminManagerStaffManage />} /> */}

       
      </Route>
    </Routes>
  );
}
