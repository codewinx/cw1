import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import CutterLayout from "../pages/cutter/CutterLayout";
import CutterDashboard from "../pages/cutter/CutterDashboard";
import CutterTasks from "../pages/cutter/CutterTasks";
import CutterProfile from "../pages/cutter/CutterProfile";
import CutterInprogress from "../pages/cutter/CutterInprogress";
import CutterCompleted from "../pages/cutter/CutterCompleted";
import CutterReassign from "../pages/cutter/CutterReassign";



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
        <Route path="cutterinprogress" element={<CutterInprogress />} />
        <Route path="cuttercompleted" element={<CutterCompleted />} />
        <Route path="cutterreassign" element={<CutterReassign />} />
      </Route>
    </Routes>
  );
}

