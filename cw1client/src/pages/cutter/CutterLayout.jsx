import React from "react";
import CutterSidebar from "./CutterSidebar";
import CutterHeader from "./CutterHeader"; // ✅ import header
import { Outlet } from "react-router-dom";

export default function CutterLayout() {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <CutterSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header / Navbar */}
        <CutterHeader /> {/* ✅ use header component */}

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
