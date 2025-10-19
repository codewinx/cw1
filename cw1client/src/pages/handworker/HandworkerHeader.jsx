import React, { useEffect, useState } from "react";
import { Bell } from "react-feather";
import { getCurrentStaff } from "../../api/handworker";
// import CutterProfile from "./CutterProfile";

const HandworkerHeader = () => {
  const [handworker, sethandworker] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const fetchHandworker = async () => {
      try {
        const data = await getCurrentStaff();
        if (data.success && data.staff) {
          sethandworker(data.staff);
        }
      } catch (err) {
        console.error("Error fetching staff:", err);
      }
    };
    fetchHandworker();
  }, []);

  if (!handworker) return null;

  return (
    <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sticky top-0 z-40 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 sm:w-8"></div>
          <div className="px-2">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Dashboard
            </h1>
            <p className="text-gray-500 text-sm sm:text-base">
              Welcome back,&nbsp;
              <span className="font-semibold text-pink-500">{handworker.name}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <div className="relative">
            <Bell className="w-8 h-8 text-gray-700 cursor-pointer hover:text-gray-900 transition-colors" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-pink-500 rounded-full"></span>
          </div>

          <div className="relative group">
            <div
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => setShowProfile(true)}
            >
              {handworker.profileImage ? (
                <img
                  src={handworker.profileImage}
                  alt={handworker.name}
                  className="w-11 h-11 rounded-full border-2 border-gray-200 object-cover"
                />
              ) : (
                <div className="w-11 h-11 bg-pink-500 rounded-full flex items-center justify-center border-2 border-gray-200">
                  <span className="text-white font-semibold text-lg">
                    {handworker.name?.charAt(0).toUpperCase() || "C"}
                  </span>
                </div>
              )}
              <span className="hidden sm:block text-base font-medium text-gray-700">
                {handworker.name}
              </span>
            </div>
          </div>
        </div>
      </div>

      {showProfile && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg relative w-[95%] sm:max-w-md max-h-[90vh] overflow-y-auto">
            <CutterProfile handworker={handworker} setShowProfile={setShowProfile} />
          </div>
        </div>
      )}
    </div>
  );
};

export default HandworkerHeader;
