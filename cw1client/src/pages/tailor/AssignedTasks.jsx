import React, { useEffect, useState } from "react";
import { getTasks, updateTaskStatus } from "../../api/tailor";

const TailorTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusUpdates, setStatusUpdates] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch tasks from backend
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await getTasks();

      let pendingTasks = Array.isArray(data?.pending) ? data.pending : [];
      pendingTasks = pendingTasks.filter(
        (task) => !task.wasReassigned && !task.isReassigned
      );

      setTasks(pendingTasks);
      setFilteredTasks(pendingTasks);
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
    const temp = tasks.filter((task) =>
      task.order?.orderNo?.toString().includes(searchTerm)
    );
    setFilteredTasks(temp);
  }, [searchTerm, tasks]);

  // Handle status select
  const handleSelectChange = (taskId, value) => {
    setStatusUpdates((prev) => ({
      ...prev,
      [taskId]: value,
    }));
  };

  // Save status to backend
  const handleSaveStatus = async (taskId) => {
    try {
      const status = statusUpdates[taskId];
      if (!status) return;

      await updateTaskStatus(taskId, status);

      const updatedTasks = tasks.filter((task) => task._id !== taskId);
      setTasks(updatedTasks);
      setFilteredTasks(updatedTasks);

      alert("✅ Task status updated successfully");
    } catch (err) {
      console.error("Error updating status:", err);
      alert("❌ Failed to update task status");
    }
  };

  const getStatusBadge = (status) => {
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
    return (
      <p className="text-center mt-6 text-gray-500">No pending tasks found.</p>
    );

  return (
    <div className="p-4">
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
              {/* Service */}
              <div className="px-4 py-3 flex justify-between items-center">
                <span className="font-medium text-gray-600">Service</span>
                <span className="text-gray-800">
                  {task.order?.service?.name || "N/A"} (
                  {task.order?.service?.category})
                </span>
              </div>

              {/* Expected Date */}
              <div className="px-4 py-3 flex justify-between items-center">
                <span className="font-medium text-gray-600">Expected</span>
                <span className="text-gray-800">
                  {task.order?.expectedDate
                    ? new Date(task.order.expectedDate).toDateString()
                    : "N/A"}
                </span>
              </div>

              {/* Measurements */}
<div className="px-4 py-3">
  <span className="font-medium text-gray-600 block mb-1">
    Measurements
  </span>
  {task.order?.service?.measurements?.length > 0 ? (
    <ul className="list-disc ml-5 text-gray-700 text-xs">
      {task.order.service.measurements.map((label, index) => {
        const valueObj = task.order?.measurements?.find(
          (m) => m.fieldName === label
        );
        return (
          <li key={index}>
            <strong>{label}:</strong> {valueObj?.value || "-"}
          </li>
        );
      })}
    </ul>
  ) : (
    <span className="text-gray-400">N/A</span>
  )}
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

export default TailorTasks;

