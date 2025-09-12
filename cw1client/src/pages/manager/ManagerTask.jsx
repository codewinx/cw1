import React, { useEffect, useState } from "react";
import { getTasks, updateTaskStatus } from "../../api/manager";
import { Eye, EyeOff } from "lucide-react";

const ManagerTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusUpdates, setStatusUpdates] = useState({});
  const [expandedTask, setExpandedTask] = useState(null);

  const fetchTasks = async () => {
    try {
      const data = await getTasks();
      let tasksArray = Array.isArray(data) ? data : data.tasks || [];
      setTasks(tasksArray.filter((t) => t.status === "pending"));
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

      const updatedTask = await updateTaskStatus(taskId, status);
      setTasks((prev) =>
        prev.map((task) =>
          task._id === taskId ? { ...task, ...updatedTask } : task
        )
      );
      setStatusUpdates((prev) => {
        const updated = { ...prev };
        delete updated[taskId];
        return updated;
      });
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

  if (loading)
    return <p className="text-center mt-6">Loading pending tasks...</p>;

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
        Pending Tasks
      </h2>

      {tasks.length === 0 ? (
        <p className="text-gray-500">No pending tasks.</p>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2 text-left">Order No</th>
                  <th className="border px-4 py-2 text-left">Service</th>
                  <th className="border px-4 py-2 text-left">Expected Date</th>
                  <th className="border px-4 py-2 text-left">Status</th>
                  <th className="border px-4 py-2 text-left">Remarks</th>
                  <th className="border px-4 py-2 text-left">Update Status</th>
                  <th className="border px-4 py-2 text-left">Measurements</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <React.Fragment key={task._id}>
                    <tr className="hover:bg-gray-50">
                      <td className="border px-4 py-2">
                        {task.order?.orderNo || "N/A"}
                      </td>
                      <td className="border px-4 py-2">
                        {task.order?.service || "N/A"}
                      </td>
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
                      <td className="border px-4 py-2 text-sm text-gray-700">
                        {task.remarks || "No remarks"}
                      </td>
                      <td className="border px-4 py-2 flex items-center gap-2">
                        <select
                          value={statusUpdates[task._id] || ""}
                          onChange={(e) =>
                            handleSelectChange(task._id, e.target.value)
                          }
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
                            setExpandedTask(
                              expandedTask === task._id ? null : task._id
                            )
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

                    {expandedTask === task._id && (
                      <tr>
                        <td colSpan="7" className="border px-4 py-3 bg-gray-50">
                          {task.order?.measurement?.length > 0 ? (
                            <ul className="list-disc ml-6 space-y-1 text-sm text-gray-700">
                              {task.order.measurement.map((m) => (
                                <li key={m._id}>
                                  <strong>{m.category}:</strong>{" "}
                                  {m.data
                                    .map((d) => `${d.key}: ${d.value}`)
                                    .join(", ")}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-gray-500 text-sm">
                              No measurements available.
                            </p>
                          )}
                          <div className="mt-3 text-sm text-gray-800">
                            <strong>Remarks:</strong>{" "}
                            {task.remarks || "No remarks provided"}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="grid gap-4 md:hidden">
            {tasks.map((task) => (
              <div
                key={task._id}
                className="border rounded-lg p-4 shadow-sm bg-white"
              >
                <p className="text-sm">
                  <strong>Order No:</strong> {task.order?.orderNo || "N/A"}
                </p>
                <p className="text-sm">
                  <strong>Service:</strong> {task.order?.service || "N/A"}
                </p>
                <p className="text-sm">
                  <strong>Expected Date:</strong>{" "}
                  {task.order?.expectedDate
                    ? new Date(task.order.expectedDate).toDateString()
                    : "N/A"}
                </p>
                <p className="text-sm flex items-center gap-2">
                  <strong>Status:</strong>{" "}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                      task.status
                    )}`}
                  >
                    {task.status}
                  </span>
                </p>
                <p className="text-sm">
                  <strong>Remarks:</strong> {task.remarks || "No remarks"}
                </p>

                {/* Status Update */}
                <div className="mt-3 flex items-center gap-2">
                  <select
                    value={statusUpdates[task._id] || ""}
                    onChange={(e) =>
                      handleSelectChange(task._id, e.target.value)
                    }
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

                {/* Measurement Toggle */}
                <button
                  onClick={() =>
                    setExpandedTask(
                      expandedTask === task._id ? null : task._id
                    )
                  }
                  className="mt-3 text-blue-600 hover:text-blue-800 flex items-center gap-1"
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
                  <div className="mt-2 bg-gray-50 p-3 rounded">
                    {task.order?.measurement?.length > 0 ? (
                      <ul className="list-disc ml-6 space-y-1 text-sm text-gray-700">
                        {task.order.measurement.map((m) => (
                          <li key={m._id}>
                            <strong>{m.category}:</strong>{" "}
                            {m.data
                              .map((d) => `${d.key}: ${d.value}`)
                              .join(", ")}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500 text-sm">
                        No measurements available.
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ManagerTasks;
