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
      {/* ✅ Title on top-left */}
      <h1 className="text-4xl font-bold text-gray-700 mb-6">Overview</h1>

      {/* 3 task boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {boxData.map((box) => (
          <div
            key={box.label}
            className={`p-6 rounded-lg shadow-md ${box.color} text-white flex flex-col items-center justify-center`}
          >
            <h2 className="text-lg font-semibold">{box.label}</h2>
            <p className="mt-2 text-3xl font-bold">{box.count}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CutterDashboard;
