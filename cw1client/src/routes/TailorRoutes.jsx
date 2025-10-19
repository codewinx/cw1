import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import TailorLayout from "../pages/tailor/TailorLayout";
import TailorDashboard from "../pages/tailor/TailorDashboard";
import AssignedTasks from "../pages/tailor/AssignedTasks";
import InProgressTasks from "../pages/tailor/in-progress-tasks";
import CompletedTasks from "../pages/tailor/completed-tasks";
import TailorReasign from "../pages/tailor/TailorReasign";

export default function TailorRoutes() {
  return (
    <Routes>
      <Route element={<TailorLayout />}>
        

        <Route path="dashboard" element={<TailorDashboard />} />
        <Route path="new-tasks" element={<AssignedTasks />} />
        <Route path="in-progress-tasks" element={<InProgressTasks />} />
        <Route path="completed-tasks" element={<CompletedTasks />} />
        <Route path="reassigntasks" element={<TailorReasign />} />
        


      </Route>
    </Routes>
  );
}
