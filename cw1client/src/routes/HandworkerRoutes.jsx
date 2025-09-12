import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HandworkerLayout from "../pages/handworker/HandworkerLayout";
import HandworkerDashboard from "../pages/handworker/HandworkerDashboard";


const HandworkerRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HandworkerLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<HandworkerDashboard />} />
      </Route>
    </Routes>
  );
};

export default HandworkerRoutes;
