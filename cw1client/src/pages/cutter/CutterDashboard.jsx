import React, { useEffect, useState } from "react";
import { getTasks } from "../../api/cutter";

const CutterDashboard = () => {
  const [taskCounts, setTaskCounts] = useState({
    pending: 0,
    inProgress: 0,
    done: 0,
  });

  const badgeColors = {
    pending: "bg-red-400",       // lighter red
    inProgress: "bg-yellow-300", // lighter yellow
    done: "bg-green-400",        // lighter green
  };

  const fetchTaskCounts = async () => {
    try {
      const data = await getTasks();
      const tasksArray = Array.isArray(data) ? data : data.tasks || [];

      const counts = {
        pending: tasksArray.filter((t) => t.status === "pending").length,
        inProgress: tasksArray.filter((t) => t.status === "in-progress").length,
        done: tasksArray.filter((t) => t.status === "done").length,
      };

      setTaskCounts(counts);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  useEffect(() => {
    fetchTaskCounts();
  }, []);

  const boxData = [
    { label: "Pending Tasks", count: taskCounts.pending, color: badgeColors.pending },
    { label: "In Progress Tasks", count: taskCounts.inProgress, color: badgeColors.inProgress },
    { label: "Completed Tasks", count: taskCounts.done, color: badgeColors.done },
  ];

  return (
    <div className="p-6">
      {/* ✅ Title */}
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-700 mb-8">
        Dashboard Overview
      </h1>

      {/* ✅ Task Summary Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {boxData.map((box) => (
          <div
            key={box.label}
            className={`p-6 rounded-xl shadow-lg ${box.color} text-white flex flex-col items-center justify-center transition transform hover:scale-105 hover:shadow-2xl`}
          >
            <h2 className="text-lg sm:text-xl font-semibold text-center">{box.label}</h2>
            <p className="mt-3 text-3xl sm:text-4xl font-extrabold">{box.count}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CutterDashboard;
