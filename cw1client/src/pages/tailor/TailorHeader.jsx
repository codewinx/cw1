import React from "react";
import { Menu } from "lucide-react";

export default function TailorHeader({ onMenuClick }) {
  return (
    <header className="bg-white shadow px-4 py-3 flex items-center justify-between">
      {/* Hamburger button (mobile only) */}
      <button
        className="md:hidden p-2 rounded-md hover:bg-gray-100"
        onClick={onMenuClick}
      >
        <Menu className="h-6 w-6 text-gray-700" />
      </button>

      {/* Title */}
      <h1 className="text-lg font-semibold">Dashboard</h1>

      {/* Right Side (avatar/notifications etc.) */}
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
      </div>
    </header>
  );
}
