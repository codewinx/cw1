// Header Component
import React from "react";
import { Bell } from "react-feather";

const Header = () => {
  return (
    <div className="bg-gradient-to-r from-pink-50 to-rose-50 border-b border-slate-200/60 px-6 py-5 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">Dashboard</h1>
          <p className="text-slate-500 font-medium mt-1">Welcome back, Manager</p>
        </div>
        <div className="flex items-center space-x-6">
          <div className="relative group cursor-pointer">
            <Bell className="w-6 h-6 text-slate-400 group-hover:text-blue-500 transition-colors duration-200" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full animate-pulse shadow-lg shadow-pink-500/30"></span>
          </div>
          <div className="flex items-center space-x-3 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm border border-pink-200/30 hover:shadow-md transition-all duration-200">
            <div className="w-9 h-9 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-semibold text-sm">AM</span>
            </div>
            <span className="text-sm font-semibold text-gray-700">Admin Manager</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;