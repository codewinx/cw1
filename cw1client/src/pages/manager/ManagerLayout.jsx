import React, { useState } from "react";
import ManagerSidebar from "./ManagerSidebar";
import ManagerHeader from "./ManagerHeader";
import { Outlet } from "react-router-dom";
import { Menu, X } from "react-feather";

export default function ManagerLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true); // default open on desktop

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40 sm:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed z-50 inset-y-0 left-0 transform bg-white w-64 shadow-lg
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          sm:translate-x-0 sm:static sm:shadow-none
        `}
      >
        <ManagerSidebar closeSidebar={() => setSidebarOpen(false)} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative">
        {/* Toggle Sidebar Button (always visible on top-left) */}
        <button
          className="fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-md sm:hidden"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
        </button>

        {/* Header */}
        <ManagerHeader />

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
