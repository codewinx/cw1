import React, { useEffect, useState } from "react";
import { getTasks } from "../../api/cutter";

const CutterDashboard = () => {
  const [taskCounts, setTaskCounts] = useState({
    pending: 0,
    inProgress: 0,
    done: 0,
    reassigned: {
      total: 0,
      inProgress: 0,
      done: 0,
    },
  });

  const badgeColors = {
    pending: "bg-red-400",       // red
    inProgress: "bg-yellow-300", // yellow
    done: "bg-green-400",        // green
    reassigned: "bg-purple-400", // purple
  };

  const fetchTaskCounts = async () => {
    try {
      const data = await getTasks();

      const allTasks = [
        ...(data.pending || []),
        ...(data.inProgress || []),
        ...(data.completed || []),
        ...(data.reassigned || []),
      ];

      // Normal tasks (not reassigned)
      const normalTasks = allTasks.filter((t) => !t.wasReassigned);
      const pendingCount = normalTasks.filter((t) => t.status === "pending").length;
      const inProgressCount = normalTasks.filter((t) => t.status === "in-progress").length;
      const doneCount = normalTasks.filter((t) => t.status === "done").length;

      // Reassigned tasks (exclude pending)
      const reassignedTasks = allTasks.filter(
        (t) => t.wasReassigned && t.status !== "pending"
      );
      const reassignedInProgress = reassignedTasks.filter((t) => t.status === "in-progress").length;
      const reassignedDone = reassignedTasks.filter((t) => t.status === "done").length;

      setTaskCounts({
        pending: pendingCount,
        inProgress: inProgressCount,
        done: doneCount,
        reassigned: {
          total: reassignedTasks.length,
          inProgress: reassignedInProgress,
          done: reassignedDone,
        },
      });
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
    { 
      label: "Reassigned Tasks",
      count: `In Progress: ${taskCounts.reassigned.inProgress} | Done: ${taskCounts.reassigned.done}`,
      color: badgeColors.reassigned,
    },
  ];

  return (
    <div className="p-6">
      {/* ✅ Title */}
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-700 mb-8">
        Dashboard Overview
      </h1>

      {/* ✅ Task Summary Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        {boxData.map((box) => (
          <div
            key={box.label}
            className={`p-6 rounded-xl shadow-lg ${box.color} text-white flex flex-col items-center justify-center transition transform hover:scale-105 hover:shadow-2xl`}
          >
            <h2 className="text-xl sm:text-xl font-semibold text-center">{box.label}</h2>
            <p className="mt-3 text-xl sm:text-2xl  text-center">{box.count}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CutterDashboard;
