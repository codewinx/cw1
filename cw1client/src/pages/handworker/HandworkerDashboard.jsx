// src/pages/handworker/HandworkerDashboard.jsx
import React from "react";

const HandworkerDashboard = () => {
  const stats = [
    { title: "Total Tasks", value: 0 },
    { title: "Pending Tasks", value: 0 },
    { title: "In Progress", value: 0 },
    { title: "Completed Tasks", value: 0 },
  ];

  return (
    <div className="p-8 bg-gradient-to-br from-yellow-50 via-white to-orange-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Handworker Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition"
          >
            <h2 className="text-gray-500 text-sm">{stat.title}</h2>
            <p className="text-2xl font-bold text-orange-600 mt-2">
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HandworkerDashboard;
