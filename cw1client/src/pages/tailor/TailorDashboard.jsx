import React, { useEffect, useState } from "react";
import { getTaskStatusCounts } from "../../api/tailor";

const TailorDashboard = () => {
  const [counts, setCounts] = useState({ pending: 0, inProgress: 0, done: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const data = await getTaskStatusCounts();
        console.log("Task counts:", data); // debug
        setCounts(data);
      } catch (err) {
        console.error("Error fetching task counts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  const statusCards = [
    { label: "Pending Tasks", value: counts.pending, color: "text-blue-600", description: "Tasks not yet started" },
    { label: "In Progress", value: counts.inProgress, color: "text-yellow-500", description: "Tasks currently in progress" },
    { label: "Completed Tasks", value: counts.done, color: "text-green-600", description: "Tasks you have completed" },
  ];

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-6">Dashboard</h1>

      {/* Task Counts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statusCards.map((card) => (
          <div key={card.label} className="bg-white shadow rounded-lg p-6 flex flex-col justify-between">
            <h2 className="text-lg font-semibold text-gray-700">{card.label}</h2>
            {loading ? (
              <p className="text-gray-500 mt-2">Loading...</p>
            ) : (
              <p className={`text-2xl font-bold ${card.color} mt-2`}>{card.value}</p>
            )}
            <p className="text-sm text-gray-500 mt-2">{card.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TailorDashboard;
