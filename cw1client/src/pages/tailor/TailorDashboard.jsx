import React, { useEffect, useState } from "react";
import { getTasks } from "../../api/tailor";

const TailorDashboard = () => {
  const [taskCounts, setTaskCounts] = useState({
    pending: 0,
    inProgress: 0,
    done: 0,
    reassigned: { total: 0 },
  });

  const badgeColors = {
    pending: "bg-red-400",
    inProgress: "bg-yellow-300",
    done: "bg-green-400",
    reassigned: "bg-purple-400",
  };

  const fetchTaskCounts = async () => {
    try {
      const data = await getTasks();
      const { pending = [], inProgress = [], completed = [], reassigned = [] } = data;

      // Merge all tasks
      const allTasks = [...pending, ...inProgress, ...completed, ...reassigned];

      // Normal tasks (not reassigned)
      const normalTasks = allTasks.filter((t) => !t.wasReassigned);
      const pendingCount = normalTasks.filter(
        (t) => t.status?.toLowerCase() === "pending"
      ).length;
      const inProgressCount = normalTasks.filter(
        (t) => t.status?.toLowerCase() === "in-progress"
      ).length;
      const doneCount = normalTasks.filter(
        (t) =>
          t.status?.toLowerCase() === "done" ||
          t.status?.toLowerCase() === "completed"
      ).length;

      // Reassigned tasks (only total count)
      const reassignedTasks = allTasks.filter((t) => t.wasReassigned);

      setTaskCounts({
        pending: pendingCount,
        inProgress: inProgressCount,
        done: doneCount,
        reassigned: { total: reassignedTasks.length },
      });
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  useEffect(() => {
    fetchTaskCounts();
    const interval = setInterval(fetchTaskCounts, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const boxData = [
    { label: "Pending Tasks", count: taskCounts.pending, color: badgeColors.pending },
    { label: "In Progress Tasks", count: taskCounts.inProgress, color: badgeColors.inProgress },
    { label: "Completed Tasks", count: taskCounts.done, color: badgeColors.done },
    { label: "Reassigned Tasks", count: taskCounts.reassigned.total, color: badgeColors.reassigned },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-700 mb-8">
        Dashboard Overview
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {boxData.map((box) => (
          <div
            key={box.label}
            className={`p-6 rounded-xl shadow-lg ${box.color} text-white flex flex-col items-center justify-center transition transform hover:scale-105 hover:shadow-2xl`}
          >
            <h2 className="text-lg sm:text-xl font-semibold text-center min-h-[3rem] flex items-center justify-center">
              {box.label}
            </h2>
            <p className="mt-3 text-2xl sm:text-3xl font-bold text-center">{box.count}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TailorDashboard;
