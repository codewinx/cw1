import React from "react";

const ManagerDashboard = () => {
  // Dummy data for now – later you can fetch from API
  const stats = [
    { title: "Total Orders", value: 120 },
    { title: "Cutting Orders", value: 35 },
    { title: "Tailoring Orders", value: 28 },
    { title: "Handworker Orders", value: 15 },
    { title: "Completed Orders", value: 90 },
    { title: "Pending Orders", value: 25 },
    { title: "Assigned Orders", value: 60 },
  ];

  return (
    <div className="p-8 bg-gradient-to-br from-white via-pink-50 to-rose-50 min-h-screen">
      <h1 className="text-3xl font-extrabold bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent mb-10">
        Manager Dashboard
      </h1>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {stats.map((item, index) => (
          <div
            key={index}
            className="p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-1 border border-pink-100 relative overflow-hidden"
          >
            {/* subtle gradient background accent */}
            <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-white to-rose-50 opacity-60 rounded-2xl pointer-events-none"></div>

            <div className="relative z-10">
              <h2 className="text-lg font-semibold text-gray-700 tracking-wide">
                {item.title}
              </h2>
              <p className="text-4xl font-extrabold bg-gradient-to-r from-pink-600 to-rose-500 text-transparent bg-clip-text mt-3">
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManagerDashboard;
