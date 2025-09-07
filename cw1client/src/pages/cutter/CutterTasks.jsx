import React, { useEffect, useState } from "react";
import { getTasks, updateStaff } from "../../api/cutter";

const CutterTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const data = await getTasks();
      if (Array.isArray(data)) setTasks(data);
      else if (Array.isArray(data.tasks)) setTasks(data.tasks);
      else setTasks([]);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setTasks([]);
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      await updateStaff(taskId, { status });
      fetchTasks(); // refresh tasks
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  if (loading) return <p className="text-center mt-6">Loading tasks...</p>;
  if (!tasks.length)
    return <p className="text-center mt-6 text-gray-500">No tasks assigned yet.</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Assigned Tasks (Cutter)</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2 text-left">Order No</th>
              <th className="border px-4 py-2 text-left">Service</th>
              <th className="border px-4 py-2 text-left">Expected Date</th>
              <th className="border px-4 py-2 text-left">Measurements</th>
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
                <td className="border px-4 py-2">
                  {task.order?.measurement?.length > 0 ? (
                    <ul className="list-disc ml-5 text-sm">
                      {task.order.measurement.map((m) => (
                        <li key={m._id}>
                          <strong>{m.category}:</strong>{" "}
                          {m.data.map((d) => `${d.key}: ${d.value}`).join(", ")}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    "N/A"
                  )}
                </td>
                <td className="border px-4 py-2 capitalize">
                  {task.status}
                </td>
                <td className="border px-4 py-2">
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task._id, e.target.value)}
                    className="border px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CutterTasks;
