import React, { useEffect, useState } from "react";
import { Bell } from "react-feather";
import { getStaff } from "../../api/cutter";
import CutterProfile from "./CutterProfile"; // Import your profile component

const CutterHeader = () => {
  const [cutter, setCutter] = useState(null);
  const [showProfile, setShowProfile] = useState(false); // Popup state

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
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">
            Welcome back, {cutter ? cutter.name : "Loading..."}
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <Bell className="w-6 h-6 text-gray-400" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-pink-500 rounded-full"></span>
          </div>

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

            <div
              className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg border border-gray-200 
                         opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                         transition-all duration-200"
            >
              <button
                onClick={() => setShowProfile(true)} // Show popup on click
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                My Profile
              </button>
              <button
                onClick={() => console.log("Logout")} // Handle logout
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

   {showProfile && cutter && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg relative max-w-md w-full max-h-[90vh] overflow-y-auto">
      <CutterProfile cutter={cutter} setShowProfile={setShowProfile} />
    </div>
  </div>
)}
    </div>
  );
};

export default CutterHeader;
