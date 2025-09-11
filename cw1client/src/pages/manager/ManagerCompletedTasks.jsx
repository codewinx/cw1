import React from "react";

const ManagerCompletedTasks = () => {
  // Dummy data – later fetch from API
  const tasks = [
    { id: 1, title: "Order #101", stage: "Tailoring", assignedTo: "John", status: "Completed" },
    { id: 2, title: "Order #102", stage: "Cutting", assignedTo: "Alice", status: "Completed" },
    { id: 3, title: "Order #103", stage: "Handworker", assignedTo: "Bob", status: "Completed" },
  ];

  return (
    <div className="p-4 sm:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl sm:text-3xl font-extrabold mb-6 text-center sm:text-left text-gray-800">
        Completed Tasks
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="p-4 bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-transform transform hover:-translate-y-1"
          >
            <h2 className="text-lg font-semibold text-gray-700">{task.title}</h2>
            <p className="text-gray-500 mt-1">
              <span className="font-semibold">Stage:</span> {task.stage}
            </p>
            <p className="text-gray-500 mt-1">
              <span className="font-semibold">Assigned To:</span> {task.assignedTo}
            </p>
            <p className="text-green-600 mt-2 font-bold">{task.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManagerCompletedTasks;
