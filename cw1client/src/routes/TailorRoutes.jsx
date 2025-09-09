import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import TailorLayout from "../pages/tailor/TailorLayout";
import TailorDashboard from "../pages/tailor/TailorDashboard";
import AssignedTasks from "../pages/tailor/AssignedTasks";


export default function TailorRoutes() {
  return (
    <Routes>
      <Route element={<TailorLayout />}>
        

        <Route path="dashboard" element={<TailorDashboard />} />
        <Route path="tasks" element={<AssignedTasks />} />
        


      </Route>
    </Routes>
  );
}
