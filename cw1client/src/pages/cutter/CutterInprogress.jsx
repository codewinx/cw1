import React, { useEffect, useState } from "react";
import { getTasks, updateStaff } from "../../api/cutter";

const InProgressTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusUpdates, setStatusUpdates] = useState({});

  const fetchTasks = async () => {
    try {
      const data = await getTasks();
      const allTasks = Array.isArray(data) ? data : data.tasks || [];
      setTasks(allTasks.filter((t) => t.status === "in-progress"));
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
      fetchTasks(); // refresh
    } catch (err) {
      console.error("Error saving status:", err);
    }
  };

  const getStatusBadge = (status) => {
    let color = "bg-gray-300 text-gray-800";
    if (status === "pending") color = "bg-red-100 text-red-700";
    if (status === "in-progress") color = "bg-yellow-100 text-yellow-700";
    if (status === "done") color = "bg-green-100 text-green-700";
    return (
      <span className={`px-3 py-1 text-sm rounded-full font-medium ${color}`}>
        {status}
      </span>
    );
  };

  if (loading) return <p className="text-center mt-6">Loading...</p>;
  if (!tasks.length)
    return <p className="text-center mt-6 text-gray-500">No in-progress tasks.</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">In Progress Tasks</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2 text-left">Order No</th>
              <th className="border px-4 py-2 text-left">Service</th>
              <th className="border px-4 py-2 text-left">Expected Date</th>
              <th className="border px-4 py-2 text-left">Status</th>
              <th className="border px-4 py-2 text-left">Update Status</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task._id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{task.order?.orderNo || "N/A"}</td>
                <td className="border px-4 py-2">{task.order?.service || "N/A"}</td>
                <td className="border px-4 py-2">
                  {task.order?.expectedDate
                    ? new Date(task.order.expectedDate).toDateString()
                    : "N/A"}
                </td>
                <td className="border px-4 py-2">{getStatusBadge(task.status)}</td>

                {/* ✅ Dropdown with default + Save only when selected */}
                <td className="border px-4 py-2 flex items-center gap-2">
                  <select
                    value={statusUpdates[task._id] || ""}
                    onChange={(e) => handleSelectChange(task._id, e.target.value)}
                    className="border px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="" disabled>
                      Select Status
                    </option>
                    <option value="done">Done</option>
                    <option value="pending">Pending</option>
                  </select>

                  {/* Show Save button only if a value is chosen */}
                  {statusUpdates[task._id] && (
                    <button
                      onClick={() => handleSaveStatus(task._id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Save
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InProgressTasks;
