import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import CutterLayout from "../pages/cutter/CutterLayout";
import CutterDashboard from "../pages/cutter/CutterDashboard";



export default function CutterRoutes() {
  return (
    <Routes>
      <Route  element={<CutterLayout />}>
        {/* Default redirect to dashboard */}
        <Route index element={<Navigate to="dashboard" replace />} />

        {/* All child routes stay inside CutterLayout */}
        <Route path="dashboard" element={<CutterDashboard />} />
      </Route>
    </Routes>
  );
}

