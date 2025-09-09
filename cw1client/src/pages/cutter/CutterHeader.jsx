import React, { useEffect, useState } from "react";
import { Bell } from "react-feather";
import { getStaff } from "../../api/cutter";

const CutterHeader = () => {
  const [cutter, setCutter] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const fetchCutter = async () => {
      try {
        const data = await getStaff();
        if (Array.isArray(data)) {
          const cutterStaff = data.find((staff) => staff.role === "Cutter");
          setCutter(cutterStaff || data[0]);
        } else {
          setCutter(data);
        }
      } catch (err) {
        console.error("Error fetching staff:", err);
      }
    };
    fetchCutter();
  }, []);

  return (
    <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sticky top-0 z-40 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Left spacer + Title */}
        <div className="flex items-center gap-3">
          {/* Just empty spacer instead of hamburger */}
          <div className="w-7 sm:w-8"></div>

          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Dashboard
            </h1>
            <p className="text-gray-500 text-sm sm:text-base">
              Welcome back,&nbsp;<span className="font-semibold text-pink-500">{cutter ? cutter.name : "Loading..."}</span>
            </p>
          </div>
        </div>

        {/* Right side: Bell + Profile */}
        <div className="flex items-center space-x-6">
          {/* Bell */}
          <div className="relative">
            <Bell className="w-8 h-8 text-gray-700 cursor-pointer hover:text-gray-900 transition-colors" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-pink-500 rounded-full"></span>
          </div>

          {/* Profile */}
          <div className="relative group">
            <div className="flex items-center space-x-3 cursor-pointer">
              {cutter?.profileImage ? (
                <img
                  src="https://i.pinimg.com/564x/7b/47/0e/7b470e0006589eae28665a422ea8d858.jpg"
                  alt={cutter.name}
                  className="w-11 h-11 rounded-full border-2 border-gray-200 object-cover"
                />
              ) : (
                <div className="w-11 h-11 bg-pink-500 rounded-full flex items-center justify-center border-2 border-gray-200">
                  <span className="text-white font-semibold text-lg">
                    {cutter?.name?.charAt(0).toUpperCase() || "C"}
                  </span>
                </div>
              )}
              <span className="hidden sm:block text-base font-medium text-gray-700">
                {cutter?.name || "Cutter"}
              </span>
            </div>

            {/* Dropdown */}
            <div
              className="absolute right-0 mt-2 w-44 bg-white rounded-md shadow-lg border border-gray-200 
                         opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                         transition-all duration-200"
            >
            
              <button
                onClick={() => console.log("Logout")}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Popup */}
      {showProfile && cutter && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg relative w-[95%] sm:max-w-md max-h-[90vh] overflow-y-auto">
            <CutterProfile cutter={cutter} setShowProfile={setShowProfile} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CutterHeader;
