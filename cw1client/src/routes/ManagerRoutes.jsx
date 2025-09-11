// ManagerRoutes.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ManagerLayout from "../pages/manager/ManagerLayout";
import ManagerDashboard from "../pages/manager/ManagerDashboard";

import ManagerTask from "../pages/manager/ManagerTask";
import ManagerInprogressTasks from "../pages/manager/ManagerInprogressTasks";
import ManagerCompletedTasks from "../pages/manager/ManagerCompletedTasks";
import ManagerReassignTasks from "../pages/manager/ManagerReassignTasks";
import ManagerOrderManagement from "../pages/manager/ManagerOrderManagement";

export default function ManagerRoutes() {
  return (
    <Routes>
      <Route element={<ManagerLayout />}>
        {/* Default redirect to dashboard */}
        <Route index element={<Navigate to="dashboard" replace />} />

        {/* Child routes inside ManagerLayout */}
        <Route path="dashboard" element={<ManagerDashboard />} />
        <Route path="task" element={<ManagerTask />} />
        <Route path="in-progress tasks" element={<ManagerInprogressTasks />} />
        <Route path="completedtasks" element={<ManagerCompletedTasks />} />
        <Route path="reassigntasks" element={<ManagerReassignTasks />} />
        <Route path="ordermanagement" element={<ManagerOrderManagement />} />
       
      </Route>
    </Routes>
  );
}
