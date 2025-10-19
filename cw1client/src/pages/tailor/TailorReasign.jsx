import React, { useEffect, useState } from "react";
import { getTasks, updateStaff } from "../../api/tailor";

const TailorReassign = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusUpdates, setStatusUpdates] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await getTasks();
      let reassigned = Array.isArray(data?.reassigned) ? data.reassigned : [];

      // Always mark as reassigned
      reassigned = reassigned.map(t => ({ ...t, wasReassigned: true }));

      // Remove duplicates by orderNo (keep latest updated)
      const uniqueTasks = Object.values(
        reassigned.reduce((acc, task) => {
          const orderNo = task.order?.orderNo;
          if (!orderNo || !acc[orderNo]) {
            acc[orderNo] = task;
          } else {
            if (
              new Date(task.updatedAt || task.createdAt) >
              new Date(acc[orderNo].updatedAt || acc[orderNo].createdAt)
            ) {
              acc[orderNo] = task;
            }
          }
          return acc;
        }, {})
      );

      setTasks(uniqueTasks);
      setFilteredTasks(uniqueTasks);
    } catch (err) {
      console.error("Error fetching reassigned tasks:", err);
      setTasks([]);
      setFilteredTasks([]);
    } finally {
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
      tasks.filter(task =>
        task.order?.orderNo?.toString().includes(searchTerm)
      )
    );
  }, [searchTerm, tasks]);

  const handleSelectChange = (taskId, value) => {
    setStatusUpdates(prev => ({ ...prev, [taskId]: value }));
  };

  const handleSaveStatus = async (taskId) => {
    try {
      const status = statusUpdates[taskId];
      if (!status) return;

      await updateStaff(taskId, { status, wasReassigned: true });

      setTasks(prev => prev.filter(t => t._id !== taskId));
      setFilteredTasks(prev => prev.filter(t => t._id !== taskId));

      setStatusUpdates(prev => {
        const updated = { ...prev };
        delete updated[taskId];
        return updated;
      });
    } catch (err) {
      console.error("Error saving status:", err);
    }
  };

  const getStatusBadge = status => {
    switch (status) {
      case "pending":
        return "bg-red-100 text-red-700";
      case "in-progress":
        return "bg-yellow-100 text-yellow-700";
      case "done":
        return "bg-green-100 text-green-700";
      case "reassigned":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) return <p className="text-center mt-6">Loading tasks...</p>;
  if (!filteredTasks.length)
    return <p className="text-center mt-6 text-gray-500">No reassigned tasks found.</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Reassigned Tasks</h2>

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
                <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold">
                  Reassigned
                </span>
              </h3>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusBadge(
                  task.status
                )}`}
              >
                {task.status.toUpperCase()}
              </span>
            </div>

            {/* Details */}
            <div className="divide-y text-sm px-4 py-3">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-600">Service</span>
                <span className="text-gray-800">
                  {task.order?.service?.name || "N/A"} ({task.order?.service?.category || "N/A"})
                </span>
              </div>

              <div className="flex justify-between items-center mt-2">
                <span className="font-medium text-gray-600">Expected</span>
                <span className="text-gray-800">
                  {task.order?.expectedDate
                    ? new Date(task.order.expectedDate).toDateString()
                    : "N/A"}
                </span>
              </div>

              <div className="mt-2">
                <span className="font-medium text-gray-600 block mb-1">Measurements</span>
                {task.order?.measurements?.length > 0 ? (
                  <ul className="list-disc ml-5 text-gray-700 text-xs">
                    {task.order.measurements.map((m, i) => (
                      <li key={i}>
                        <strong>{m.fieldName}:</strong> {m.value || "-"}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-gray-400">N/A</span>
                )}
              </div>

              {/* Status Update */}
              <div className="flex items-center gap-2 mt-3">
                <select
                  value={statusUpdates[task._id] || ""}
                  onChange={e => handleSelectChange(task._id, e.target.value)}
                  className="border border-gray-300 px-2 py-1 rounded w-full text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 shadow-sm"
                >
                  <option value="" disabled>
                    Update Status
                  </option>
                  <option value="done">Done</option>
                  <option value="in-progress">In Progress</option>
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

export default TailorReassign;
