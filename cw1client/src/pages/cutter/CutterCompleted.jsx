import React, { useEffect, useState } from "react";
import { getTasks, updateStaff } from "../../api/cutter";

const CompletedTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusUpdates, setStatusUpdates] = useState({});

  const fetchTasks = async () => {
    try {
      const data = await getTasks();
      const allTasks = Array.isArray(data) ? data : data.tasks || [];
      setTasks(allTasks.filter((t) => t.status === "done"));
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
      setStatusUpdates((prev) => {
        const updated = { ...prev };
        delete updated[taskId]; // reset so Save hides again
        return updated;
      });
      fetchTasks(); // Refresh list
    } catch (err) {
      console.error("Error saving status:", err);
    }
  };

  const renderStatusBadge = (status) => {
    let color = "bg-gray-500";
    if (status === "pending") color = "bg-yellow-500";
    if (status === "done") color = "bg-green-500";

    return (
      <span className={`px-2 py-1 text-white text-sm rounded ${color}`}>
        {status}
      </span>
    );
  };

  if (loading) return <p className="text-center mt-6">Loading...</p>;
  if (!tasks.length)
    return <p className="text-center mt-6 text-gray-500">No completed tasks.</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Completed Tasks</h2>
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
                <td className="border px-4 py-2 capitalize">
                  {renderStatusBadge(task.status)}
                </td>
                <td className="border px-4 py-2 flex items-center gap-2">
                  <select
                    value={statusUpdates[task._id] || ""}
                    onChange={(e) => handleSelectChange(task._id, e.target.value)}
                    className="border px-2 py-1 rounded"
                  >
                    <option value="" disabled>
                      Select Status
                    </option>
                    <option value="pending">Pending</option>
                    <option value="done">Done</option>
                  </select>

                  {/* Show Save button only if status is changed */}
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

export default CompletedTasks;
