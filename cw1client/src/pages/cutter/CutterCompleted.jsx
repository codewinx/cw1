import React, { useEffect, useState } from "react";
import { getTasks } from "../../api/cutter";

const CompletedTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ Fetch completed + reassigned done tasks
  const fetchTasks = async () => {
    try {
      const data = await getTasks();

      const completed = Array.isArray(data.completed) ? data.completed : [];
      const reassigned = Array.isArray(data.reassigned) ? data.reassigned : [];

      // ✅ Take only reassigned tasks that are done
      const reassignedDone = reassigned.filter(
        (task) => task.status === "done"
      );

      const allCompleted = [...completed, ...reassignedDone];

      setTasks(allCompleted);
      setFilteredTasks(allCompleted);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setTasks([]);
      setFilteredTasks([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // 🔎 Search filter
  useEffect(() => {
    if (!searchTerm) {
      setFilteredTasks(tasks);
      return;
    }
    setFilteredTasks(
      tasks.filter((task) =>
        task.order?.orderNo?.toString().includes(searchTerm)
      )
    );
  }, [searchTerm, tasks]);

  // Badge colors
  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return "bg-red-100 text-red-700";
      case "in-progress":
        return "bg-yellow-100 text-yellow-700";
      case "done":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading)
    return <p className="text-center mt-6">Loading tasks...</p>;

  if (!filteredTasks.length)
    return (
      <p className="text-center mt-6 text-gray-500">
        No completed tasks found.
      </p>
    );

  return (
    <div className="p-2">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Completed Tasks</h2>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by Order No"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 px-3 py-2 rounded w-full sm:w-1/2 focus:outline-none focus:ring-2 focus:ring-pink-400 shadow-sm"
        />
      </div>

      {/* Task Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredTasks.map((task) => (
          <div
            key={task._id}
            className="border rounded-lg shadow-md bg-white hover:shadow-lg transition overflow-hidden"
          >
            {/* Card Header */}
            <div className="bg-gradient-to-r from-pink-500 to-pink-700 text-white px-4 py-2 flex justify-between items-center">
              <h3 className="font-bold text-base flex items-center gap-2">
                Order #{task.order?.orderNo || "N/A"}
                {task.wasReassigned && (
                  <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold">
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

            {/* Card Details */}
            <div className="divide-y text-sm">
              {/* Service */}
              <div className="px-4 py-3 flex justify-between items-center">
                <span className="font-medium text-gray-600">Service</span>
                <span className="text-gray-800">
                  {task.order?.service || "N/A"}
                </span>
              </div>

              {/* Expected / Deadline */}
              <div className="px-4 py-3 flex justify-between items-center">
                <span className="font-medium text-gray-600">Expected</span>
                <span className="text-gray-800">
                  {task.latestDeadline
                    ? new Date(task.latestDeadline).toDateString()
                    : "N/A"}
                </span>
              </div>

              {/* Measurements */}
              <div className="px-4 py-3">
                <span className="font-medium text-gray-600 block mb-1">
                  Measurements
                </span>
                {task.order?.measurement?.length > 0 ? (
                  <ul className="list-disc ml-5 text-gray-700 text-xs">
                    {task.order.measurement.map((m) => (
                      <li key={m._id}>
                        <strong>{m.category}:</strong>{" "}
                        {m.data.map((d) => `${d.key}: ${d.value}`).join(", ")}
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
