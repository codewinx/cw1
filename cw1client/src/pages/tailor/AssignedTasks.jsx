import React, { useEffect, useState } from "react";
import { getTasks,updateStaff } from "../../api/tailor";
import { Eye, EyeOff } from "lucide-react";

const CurrentTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusUpdates, setStatusUpdates] = useState({});
  const [expandedTask, setExpandedTask] = useState(null);

  const fetchTasks = async () => {
    try {
      const data = await getTasks();
      let tasksArray = [];

      if (Array.isArray(data)) tasksArray = data;
      else if (Array.isArray(data.tasks)) tasksArray = data.tasks;

      setTasks(tasksArray.filter((task) => task.status === "pending"));
      setLoading(false);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setTasks([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

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
      setTasks((prev) => prev.filter((task) => task._id !== taskId));
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

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

  if (loading) return <p className="text-center mt-6">Loading tasks...</p>;
  if (!tasks.length)
    return <p className="text-center mt-6 text-gray-500">No current tasks.</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Current Tasks</h2>

      {/* ✅ Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2 text-left">Order No</th>
              <th className="border px-4 py-2 text-left">Service</th>
              <th className="border px-4 py-2 text-left">Expected Date</th>
              <th className="border px-4 py-2 text-left">Status</th>
              <th className="border px-4 py-2 text-left">Update Status</th>
              <th className="border px-4 py-2 text-left">Measurements</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <React.Fragment key={task._id}>
                <tr className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{task.order?.orderNo || "N/A"}</td>
                  <td className="border px-4 py-2">{task.order?.service || "N/A"}</td>
                  <td className="border px-4 py-2">
                    {task.order?.expectedDate
                      ? new Date(task.order.expectedDate).toDateString()
                      : "N/A"}
                  </td>
                  <td className="border px-4 py-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(
                        task.status
                      )}`}
                    >
                      {task.status}
                    </span>
                  </td>
                  <td className="border px-4 py-2 flex items-center gap-2">
                    <select
                      value={statusUpdates[task._id] || ""}
                      onChange={(e) => handleSelectChange(task._id, e.target.value)}
                      className="border px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      <option value="" disabled>
                        Select Status
                      </option>
                      <option value="in-progress">In Progress</option>
                      <option value="done">Done</option>
                    </select>
                    {statusUpdates[task._id] && (
                      <button
                        onClick={() => handleSaveStatus(task._id)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      >
                        Save
                      </button>
                    )}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <button
                      onClick={() =>
                        setExpandedTask(expandedTask === task._id ? null : task._id)
                      }
                      className="text-blue-600 hover:text-blue-800 flex items-center justify-center gap-1"
                    >
                      {expandedTask === task._id ? (
                        <>
                          <EyeOff className="w-4 h-4" /> Hide
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4" /> View
                        </>
                      )}
                    </button>
                  </td>
                </tr>

                {/* Expanded measurements row */}
                {expandedTask === task._id && (
                  <tr>
                    <td colSpan="6" className="border px-4 py-3 bg-gray-50">
                      {task.order?.measurement?.length > 0 ? (
                        <ul className="list-disc ml-6 space-y-1 text-sm text-gray-700">
                          {task.order.measurement.map((m) => (
                            <li key={m._id}>
                              <strong>{m.category}:</strong>{" "}
                              {m.data.map((d) => `${d.key}: ${d.value}`).join(", ")}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500 text-sm">No measurements available.</p>
                      )}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Mobile Card View */}
      <div className="md:hidden space-y-4">
        {tasks.map((task) => (
          <div
            key={task._id}
            className="border rounded-lg shadow bg-white p-4 space-y-2"
          >
            <p>
              <span className="font-semibold">Order No:</span>{" "}
              {task.order?.orderNo || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Service:</span>{" "}
              {task.order?.service || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Expected Date:</span>{" "}
              {task.order?.expectedDate
                ? new Date(task.order.expectedDate).toDateString()
                : "N/A"}
            </p>

            <p>
              <span className="font-semibold">Status:</span>{" "}
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(
                  task.status
                )}`}
              >
                {task.status}
              </span>
            </p>

            <div className="flex items-center gap-2">
              <select
                value={statusUpdates[task._id] || ""}
                onChange={(e) => handleSelectChange(task._id, e.target.value)}
                className="border px-2 py-1 rounded flex-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="" disabled>
                  Select Status
                </option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
              {statusUpdates[task._id] && (
                <button
                  onClick={() => handleSaveStatus(task._id)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  Save
                </button>
              )}
            </div>

            {/* Measurement toggle inside card */}
            <button
              onClick={() =>
                setExpandedTask(expandedTask === task._id ? null : task._id)
              }
              className="mt-2 flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
            >
              {expandedTask === task._id ? (
                <>
                  <EyeOff className="w-4 h-4" /> Hide Measurements
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" /> View Measurements
                </>
              )}
            </button>
            {expandedTask === task._id && (
              <div className="mt-2 bg-gray-50 p-2 rounded text-sm text-gray-700">
                {task.order?.measurement?.length > 0 ? (
                  <ul className="list-disc ml-5 space-y-1">
                    {task.order.measurement.map((m) => (
                      <li key={m._id}>
                        <strong>{m.category}:</strong>{" "}
                        {m.data.map((d) => `${d.key}: ${d.value}`).join(", ")}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No measurements available.</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CurrentTasks;
