import React from "react";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader"; // ✅ import header
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header / Navbar */}
        <AdminHeader /> {/* ✅ use header component */}

        {/* Page Content */}
        <main className="flex-1  overflow-y-auto bg-gradient-to-r from-pink-400 to-purple-400">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
