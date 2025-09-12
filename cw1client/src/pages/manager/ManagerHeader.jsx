import React, { useState } from "react";
import { Bell } from "react-feather";

const ManagerHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="bg-gradient-to-r from-white via-pink-100 to-rose-100 border-b border-pink-200 px-4 sm:px-6 py-4 sm:py-6 shadow-md">
      <div className="flex items-center justify-between">
        {/* Left - Title */}
        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 drop-shadow-sm">
            Dashboard
          </h1>
          <p className="text-gray-600 text-sm sm:text-base tracking-wide mt-1">
            Welcome back, <span className="font-semibold text-pink-600">Manager ✨</span>
          </p>
        </div>

        {/* Right - Notifications + Profile */}
        <div className="flex items-center space-x-4 sm:space-x-8 relative">
          {/* Notifications */}
          <div className="relative">
            <Bell className="w-5 h-5 sm:w-7 sm:h-7 text-gray-500 hover:text-rose-600 transition-colors duration-300 cursor-pointer" />
            <span className="absolute -top-1 -right-1 w-3 h-3 sm:w-3.5 sm:h-3.5 bg-rose-500 rounded-full ring-2 ring-white shadow-sm"></span>
          </div>

          {/* Profile (no dropdown) */}
          <div className="flex items-center space-x-2 sm:space-x-4 bg-white rounded-full px-3 sm:px-4 py-1.5 sm:py-2 shadow-lg hover:shadow-xl transition duration-300 cursor-pointer">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-rose-500 to-pink-500 rounded-full flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm sm:text-base">AM</span>
            </div>
            <span className="text-sm sm:text-base font-bold text-gray-900">
              Admin Manager
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerHeader;
