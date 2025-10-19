import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HandworkerLayout from "../pages/handworker/HandworkerLayout";
import HandworkerDashboard from "../pages/handworker/HandworkerDashboard";
import HandworkerAssignedTasks from "../pages/handworker/HandworkerAssignedTasks";
import HandworkerInProgressTasks from "../pages/handworker/HandworkerInProgressTasks";
import HandworkerCompletedTasks from "../pages/handworker/HandworkerCompletedTasks";
import HandworkerReassign from "../pages/handworker/HandworkerReassign";

const HandworkerRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HandworkerLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<HandworkerDashboard />} />
        <Route path="newtasks" element={<HandworkerAssignedTasks />} />
        <Route path="inprogresstasks" element={<HandworkerInProgressTasks />} />
        <Route path="completedtasks" element={<HandworkerCompletedTasks />} />
        <Route path="reassigntasks" element={<HandworkerReassign />} />
        
      </Route>
    </Routes>
  );
};

export default HandworkerRoutes;
