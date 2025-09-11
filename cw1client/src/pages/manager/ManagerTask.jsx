import React from "react";

const ManagerTask = () => {
  // Dummy data – replace with API later
  const tasks = [
    { id: 1, orderNumber: "#201", stage: "Cutting", assignedTo: "John", status: "In Progress" },
    { id: 2, orderNumber: "#202", stage: "Tailoring", assignedTo: "Alice", status: "Pending" },
    { id: 3, orderNumber: "#203", stage: "Handworker", assignedTo: "Bob", status: "Completed" },
  ];

  return (
    <div className="p-4 sm:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl sm:text-3xl font-extrabold mb-6 text-center sm:text-left text-gray-800">
        Tasks
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="p-4 bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-transform transform hover:-translate-y-1 flex flex-col justify-between"
          >
            <div>
              <h2 className="text-lg font-semibold text-gray-700">{task.orderNumber}</h2>
              <p className="text-gray-500 mt-1">
                <span className="font-semibold">Stage:</span> {task.stage}
              </p>
              <p className="text-gray-500 mt-1">
                <span className="font-semibold">Assigned To:</span> {task.assignedTo}
              </p>
              <p
                className={`mt-2 font-bold ${
                  task.status === "Completed"
                    ? "text-green-600"
                    : task.status === "Pending"
                    ? "text-red-500"
                    : "text-yellow-600"
                }`}
              >
                {task.status}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManagerTask;
