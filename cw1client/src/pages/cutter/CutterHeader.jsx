import React, { useEffect, useState } from "react";
import { Bell } from "react-feather";
import { Link } from "react-router-dom";
import { getStaff } from "../../api/cutter"; // ✅ Import API function

const CutterHeader = () => {
  const [cutter, setCutter] = useState(null);

  useEffect(() => {
    const fetchCutter = async () => {
      try {
        const data = await getStaff(); // Call imported API

        // If API returns an array, find the cutter
        if (Array.isArray(data)) {
          const cutterStaff = data.find((staff) => staff.role === "Cutter");
          setCutter(cutterStaff || data[0]); // fallback to first staff
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
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Side */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">
            Welcome back, {cutter ? cutter.name : "Loading..."}
          </p>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          {/* Notification Bell */}
          <div className="relative">
            <Bell className="w-6 h-6 text-gray-400" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-pink-500 rounded-full"></span>
          </div>

          {/* Profile + Dropdown */}
          <div className="relative group">
            <div className="flex items-center space-x-3 cursor-pointer">
              {cutter?.profileImage ? (
                <img
                  src={cutter.profileImage}
                  alt={cutter.name}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {cutter?.name?.charAt(0).toUpperCase() || "C"}
                  </span>
                </div>
              )}
              <span className="text-sm font-medium text-gray-700">
                {cutter?.name || "Cutter"}
              </span>
            </div>

            {/* Dropdown menu */}
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg border border-gray-200 
                            opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                            transition-all duration-200">
              <Link
                to="/cutter/profile"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                My Profile
              </Link>
              <Link
                to="/logout"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Logout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CutterHeader;
