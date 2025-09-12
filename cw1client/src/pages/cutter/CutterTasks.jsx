import React, { useEffect, useState } from "react";
import { getTasks, updateStaff } from "../../api/cutter";

const CurrentTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusUpdates, setStatusUpdates] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

 const fetchTasks = async () => {
  try {
    const data = await getTasks();

    // ✅ Use only backend's inProgress array
    let pendingTasks = Array.isArray(data?.pending) ? data.pending : [];

    // ✅ Safety filter to exclude reassigned tasks (like pending logic)
    pendingTasks = pendingTasks.filter(
      (task) => !task.wasReassigned && !task.isReassigned
    );

    setTasks(pendingTasks);
    setFilteredTasks(pendingTasks);
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

  useEffect(() => {
    if (!searchTerm) {
      setFilteredTasks(tasks);
      return;
    }
    const temp = tasks.filter((task) =>
      task.order?.orderNo?.toString().includes(searchTerm)
    );
    setFilteredTasks(temp);
  }, [searchTerm, tasks]);

  const handleSelectChange = (taskId, value) => {
    setStatusUpdates((prev) => ({
      ...prev,
      [taskId]: value,
    }));
  };

  const handleSaveStatus = async (taskId) => {
    try {
      const status = statusUpdates[taskId];
      if (!status) return;

      await updateStaff(taskId, { status });

      // remove from pending after update
      const updatedTasks = tasks.filter((task) => task._id !== taskId);
      setTasks(updatedTasks);
      setFilteredTasks(updatedTasks);
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) return <p className="text-center mt-6">Loading tasks...</p>;
  if (!filteredTasks.length)
    return <p className="text-center mt-6 text-gray-500">No pending tasks found.</p>;

  return (
    <div className="p-2">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Pending Tasks</h2>

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

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredTasks.map((task) => (
          <div
            key={task._id}
            className="border rounded-lg shadow-md bg-white hover:shadow-lg transition overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-pink-500 to-pink-700 text-white px-4 py-2 flex justify-between items-center">
              <h3 className="font-bold text-base">
                Order #{task.order?.orderNo || "N/A"}
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
                  {task.order?.service || "N/A"}
                </span>
              </div>

              <div className="px-4 py-3 flex justify-between items-center">
                <span className="font-medium text-gray-600">Expected</span>
                <span className="text-gray-800">
                  {task.order?.expectedDate
                    ? new Date(task.order.expectedDate).toDateString()
                    : "N/A"}
                </span>
              </div>

              {/* Measurements */}
              <div className="px-4 py-3 flex flex-col sm:flex-row sm:justify-between gap-4">
                <div className="flex-1 min-w-[50%]">
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

              {/* Controls */}
              <div className="px-4 py-3 flex items-center gap-2">
                <select
                  value={statusUpdates[task._id] || ""}
                  onChange={(e) =>
                    handleSelectChange(task._id, e.target.value)
                  }
                  className="border border-gray-300 px-2 py-1 rounded w-full text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 shadow-sm"
                >
                  <option value="" disabled>
                    Update Status
                  </option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>

                {statusUpdates[task._id] && (
                  <button
                    onClick={() => handleSaveStatus(task._id)}
                    className="bg-pink-600 text-white px-4 py-1 rounded hover:bg-pink-700 shadow-sm transition"
                  >
                    Save
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CurrentTasks;
