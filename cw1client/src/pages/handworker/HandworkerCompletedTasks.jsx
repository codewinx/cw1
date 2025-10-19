import React, { useEffect, useState } from "react";
import { getTasks } from "../../api/handworker";

const CompletedTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await getTasks();

      const completed = Array.isArray(data.done) ? data.done : [];
      const reassigned = Array.isArray(data.reassigned) ? data.reassigned : [];

      // Include reassigned tasks that are done
      const reassignedDone = reassigned
        .filter(task => task.status === "done" && !task.isReassigned)
        .map(task => ({ ...task, wasReassigned: true }));

      const allCompleted = [
        ...completed.map(t => ({ ...t, wasReassigned: t.wasReassigned || false })),
        ...reassignedDone,
      ];

      // Remove duplicates by orderNo (keep latest)
      const uniqueTasks = [];
      const seenOrderNos = new Set();
      for (let i = allCompleted.length - 1; i >= 0; i--) {
        const task = allCompleted[i];
        const orderNo = task.order?.orderNo;
        if (!seenOrderNos.has(orderNo)) {
          uniqueTasks.unshift(task); // keep latest occurrence
          seenOrderNos.add(orderNo);
        }
      }

      setTasks(uniqueTasks);
      setFilteredTasks(uniqueTasks);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setTasks([]);
      setFilteredTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Search filter
  useEffect(() => {
    if (!searchTerm) {
      setFilteredTasks(tasks);
      return;
    }
    setFilteredTasks(
      tasks.filter(task =>
        task.order?.orderNo?.toString().includes(searchTerm)
      )
    );
  }, [searchTerm, tasks]);

  const getStatusBadge = status => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "in-progress":
        return "bg-blue-100 text-blue-700";
      case "done":
        return "bg-green-100 text-green-700";
      case "reassigned":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) return <p className="text-center mt-6">Loading tasks...</p>;
  if (!filteredTasks.length)
    return <p className="text-center mt-6 text-gray-500">No completed tasks found.</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Completed Tasks</h2>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by Order No"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="border border-gray-300 px-3 py-2 rounded w-full sm:w-1/2 focus:outline-none focus:ring-2 focus:ring-pink-400 shadow-sm"
        />
      </div>

      {/* Task Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredTasks.map(task => (
          <div
            key={task._id}
            className="border rounded-lg shadow-md bg-white hover:shadow-lg transition overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-pink-500 to-pink-700 text-white px-4 py-2 flex justify-between items-center">
              <h3 className="font-bold text-base flex items-center gap-2">
                Order #{task.order?.orderNo || "N/A"}
                {task.wasReassigned && (
                  <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold">
                    Reassigned
                  </span>
                )}
              </h3>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusBadge(
                  task.status
                )}`}
              >
                {task.status.toUpperCase()}
              </span>
            </div>

            {/* Task Details */}
            <div className="divide-y text-sm">
              <div className="px-4 py-3 flex justify-between items-center">
                <span className="font-medium text-gray-600">Service</span>
                <span className="text-gray-800">
                  {task.order?.service?.name || "N/A"} ({task.order?.service?.category || "N/A"})
                </span>
              </div>

              <div className="px-4 py-3 flex justify-between items-center">
                <span className="font-medium text-gray-600">Expected</span>
                <span className="text-gray-800">
                  {task.order?.expectedDate ? new Date(task.order.expectedDate).toDateString() : "N/A"}
                </span>
              </div>

              <div className="px-4 py-3">
                <span className="font-medium text-gray-600 block mb-1">Measurements</span>
                {task.order?.measurements?.length > 0 ? (
                  <ul className="list-disc ml-5 text-gray-700 text-xs">
                    {task.order.measurements.map((m, index) => (
                      <li key={index}>
                        <strong>{m.fieldName}:</strong> {m.value || "-"}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-gray-400">N/A</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompletedTasks;
