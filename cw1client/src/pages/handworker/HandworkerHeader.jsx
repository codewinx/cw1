import React from "react";
import { Bell } from "react-feather";

const HandworkerHeader = ({ handworker }) => {
  return (
    <div className="bg-white border-b border-gray-200 px-2 sm:px-6 py-3 sticky top-0 z-40 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Left - Title only, no spacer */}
        <div className="flex items-center">
          <div className="px-2 ml-12 md:ml-0">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Dashboard
            </h1>
            <p className="text-gray-500 text-sm sm:text-base">
              Welcome back,&nbsp;
              <span className="font-semibold text-pink-500">
                {handworker ? handworker.name : "Loading..."}
              </span>
            </p>
          </div>
        </div>

        {/* Right side: Bell + Profile */}
        <div className="flex items-center space-x-6">
          {/* Bell Notification */}
          <div className="relative">
            <Bell className="w-8 h-8 sm:w-8 sm:h-8 text-gray-700 cursor-pointer hover:text-gray-900 transition-colors" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-pink-500 rounded-full"></span>
          </div>

          {/* Profile */}
          <div className="relative group">
            <div className="flex items-center space-x-3 sm:space-x-3">
              {handworker?.profileImage ? (
                <img
                  src={handworker.profileImage}
                  alt={handworker.name}
                  className="w-8 h-8 sm:w-11 sm:h-11 rounded-full border-2 border-gray-200 object-cover"
                />
              ) : (
                <div className="w-11 h-11 sm:w-11 sm:h-11 bg-pink-500 rounded-full flex items-center justify-center border-2 border-gray-200">
                  <span className="text-white font-semibold text-sm sm:text-lg">
                    {handworker?.name?.charAt(0).toUpperCase() || "H"}
                  </span>
                </div>
              )}
              <span className="hidden sm:block text-sm sm:text-base font-medium text-gray-700">
                {handworker?.name || "Handworker"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HandworkerHeader;