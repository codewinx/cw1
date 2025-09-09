import React from "react";

const TailorDashboard = () => {
  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6">
        Dashboard
      </h1>

      {/* Example Responsive Grid Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Card 1 */}
        <div className="bg-white shadow rounded-lg p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-gray-700">
            Assigned Tasks
          </h2>
          <p className="text-sm sm:text-base text-gray-500 mt-2">
            View and manage tasks assigned to you.
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white shadow rounded-lg p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-gray-700">
            Completed Work
          </h2>
          <p className="text-sm sm:text-base text-gray-500 mt-2">
            Track your completed tailoring jobs.
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white shadow rounded-lg p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-gray-700">
            Earnings
          </h2>
          <p className="text-sm sm:text-base text-gray-500 mt-2">
            Check your monthly progress.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TailorDashboard;
