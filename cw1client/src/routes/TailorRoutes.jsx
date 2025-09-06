import React from "react";
import { Routes, Route } from "react-router-dom";
import TailorLayout from "../pages/tailor/TailorLayout";
import TailorDashboard from "../pages/tailor/TailorDashboard";
import TailorNewWorks from "../pages/tailor/TailorNewWorks";
export default function TailorRoutes() {
  return (
    <Routes>
      <Route element={<TailorLayout />}>
        <Route path="/dashboard" element={<TailorDashboard />} />
        <Route path="/newworks" element={<TailorNewWorks />} />
      </Route>
    </Routes>
  );
}
