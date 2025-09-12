import React, { useEffect, useState } from "react";
import { getTasks, updateStaff } from "../../api/cutter";

const CutterReassign = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusUpdates, setStatusUpdates] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

 const fetchTasks = async () => {
  try {
    const data = await getTasks();
    const reassigned = data?.reassigned || []; // ✅ backend already gives reassigned tasks
    setTasks(reassigned);
    setFilteredTasks(reassigned);
    setLoading(false);
  } catch (err) {
    console.error("Error fetching reassigned tasks:", err);
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

    await updateStaff(taskId, { status });

    // ✅ Remove from reassigned page immediately
    setTasks((prev) => prev.filter((task) => task._id !== taskId));
    setFilteredTasks((prev) => prev.filter((task) => task._id !== taskId));

    setStatusUpdates((prev) => {
      const updated = { ...prev };
      delete updated[taskId];
      return updated;
    });

    // The task will now appear on the corresponding page automatically after backend fetch
  } catch (err) {
    console.error("Error saving status:", err);
  }
};


  const getStatusBadge = (status, wasAssigned) => {
    let base = "";
    switch (status) {
      case "pending":
        base = "bg-red-100 text-red-700";
        break;
      case "in-progress":
        base = "bg-yellow-100 text-yellow-700";
        break;
      case "done":
        base = "bg-green-100 text-green-700";
        break;
      case "reassigned":
        base = "bg-pink-100 text-pink-700";
        break;
      default:
        base = "bg-gray-100 text-gray-700";
    }
    return `${base} ${wasAssigned ? "border border-pink-500" : ""}`;
  };

  if (loading)
    return <p className="text-center mt-6">Loading tasks...</p>;
  if (!filteredTasks.length)
    return <p className="text-center mt-6 text-gray-500">No reassigned tasks found.</p>;

  return (
    <div className="p-2">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Reassigned Tasks</h2>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by Order No"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 px-3 py-2 rounded w-full sm:w-1/2 focus:outline-none focus:ring-2 focus:ring-pink-400 shadow-sm"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredTasks.map((task) => (
          <div
            key={task._id}
            className="border rounded-lg shadow-md bg-white hover:shadow-lg transition overflow-hidden"
          >
            <div className="bg-gradient-to-r from-pink-500 to-pink-700 text-white px-4 py-2 flex justify-between items-center">
              <h3 className="font-bold text-base">
                Order #{task.order?.orderNo || "N/A"}
              </h3>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusBadge(
                  task.status,
                  task.wasAssigned
                )}`}
              >
                {task.status.toUpperCase()} {task.wasAssigned ? "(Assigned)" : ""}
              </span>
            </div>

            <div className="divide-y text-sm px-4 py-3">
              {/* Service */}
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-600">Service</span>
                <span className="text-gray-800">{task.order?.service || "N/A"}</span>
              </div>

              {/* Deadline */}
              <div className="flex justify-between items-center mt-2">
                <span className="font-medium text-gray-600">Expected Date</span>
                <span className="text-gray-800">
                  {task.deadline ? new Date(task.deadline).toDateString() : "N/A"}
                </span>
              </div>

              {/* Measurements */}
              <div className="mt-2">
                <span className="font-medium text-gray-600 block mb-1">Measurements</span>
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

              {/* Status Update */}
              <div className="flex items-center gap-2 mt-3">
                <select
                  value={statusUpdates[task._id] || ""}
                  onChange={(e) => handleSelectChange(task._id, e.target.value)}
                  className="border border-gray-300 px-2 py-1 rounded w-full text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 shadow-sm"
                >
                  <option value="" disabled>Update Status</option>
                  <option value="done">Done</option>
                  <option value="in-progress">In Progress</option>
                  <option value="reassigned">Reassign Again</option>
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

export default CutterReassign;
