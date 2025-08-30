import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./component/Login";
import AdminRoutes from "./routes/AdminRoutes";

export default function App() {
  return (
    <Routes>
      {/* Public route */}
      <Route path="/" element={<Login />} />

      {/* Admin routes */}
      <Route path="/*" element={<AdminRoutes />} />
    </Routes>
  );
}
