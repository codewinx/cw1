// src/layout/HandworkerLayout.jsx
import React from "react";
import HandworkerSidebar from "./HandworkerSidebar";
import HandworkerHeader from "./HandworkerHeader"; // ✅ import header
import { Outlet } from "react-router-dom";

export default function HandworkerLayout() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <HandworkerSidebar/> {/* always open, no toggle */}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header / Navbar */}
        <HandworkerHeader /> {/* ✅ use header component */}

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
