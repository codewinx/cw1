import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import CutterLayout from "../pages/cutter/CutterLayout";
import CutterDashboard from "../pages/cutter/CutterDashboard";
import CutterTasks from "../pages/cutter/CutterTasks";
import CutterProfile from "../pages/cutter/CutterProfile";



export default function CutterRoutes() {
  return (
    <Routes>
      <Route  element={<CutterLayout />}>
        {/* Default redirect to dashboard */}
        <Route index element={<Navigate to="dashboard" replace />} />

        {/* All child routes stay inside CutterLayout */}
        <Route path="dashboard" element={<CutterDashboard />} />
        <Route path="Cuttertasks" element={<CutterTasks />} />
        <Route path="profile" element={<CutterProfile />} />
      </Route>
    </Routes>
  );
}

