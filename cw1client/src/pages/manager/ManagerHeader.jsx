// ManagerHeader.jsx
import React from "react";
import { Bell } from "react-feather";

const ManagerHeader = () => {
  return (
    <div className="bg-gradient-to-r from-white via-pink-100 to-rose-100 border-b border-pink-200 px-10 py-6 shadow-md">
      <div className="flex items-center justify-between">
        {/* Left - Title */}
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 drop-shadow-sm">
            Dashboard
          </h1>
          <p className="text-gray-600 text-base tracking-wide mt-1">
            Welcome back, <span className="font-semibold text-pink-600">Manager ✨</span>
          </p>
        </div>

        {/* Right - Notification + Profile */}
        <div className="flex items-center space-x-8">
          {/* Notifications */}
          <div className="relative">
            <Bell className="w-7 h-7 text-gray-500 hover:text-rose-600 transition-colors duration-300 cursor-pointer" />
            <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-rose-500 rounded-full ring-2 ring-white shadow-sm"></span>
          </div>

          {/* Profile */}
          <div className="flex items-center space-x-4 bg-white rounded-full px-4 py-2 shadow-lg hover:shadow-xl transition duration-300 cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-500 rounded-full flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-base">AM</span>
            </div>
            <span className="text-base font-bold text-gray-900">
              Admin Manager
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerHeader;
