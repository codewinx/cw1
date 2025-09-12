import React from "react";
import { Bell } from "react-feather";

const HandworkerHeader = () => {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left - Title */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Welcome back, Handworker</p>
        </div>

        {/* Right - Notifications & Profile */}
        <div className="flex items-center space-x-4">
          {/* Notification Bell */}
          <div className="relative">
            <Bell className="w-6 h-6 text-gray-400" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-pink-500 rounded-full"></span>
          </div>

          {/* User Profile */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-sm">HW</span>
            </div>
            <span className="text-sm font-medium text-gray-700">Handworker</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HandworkerHeader;
