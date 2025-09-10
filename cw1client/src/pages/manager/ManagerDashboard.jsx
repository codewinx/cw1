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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manager Dashboard</h1>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((item, index) => (
          <div
            key={index}
            className="p-6 bg-white shadow-md rounded-2xl border hover:shadow-lg transition"
          >
            <h2 className="text-lg font-semibold text-gray-700">{item.title}</h2>
            <p className="text-3xl font-bold text-indigo-600 mt-2">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManagerDashboard;
