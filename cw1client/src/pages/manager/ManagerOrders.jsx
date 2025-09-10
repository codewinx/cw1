import React from "react";

const ManagerOrders = () => {
  // Dummy data for now – later you can fetch from backend API
  const orders = [
    {
      id: 1,
      customer: "John Doe",
      type: "Cutting",
      status: "Pending",
      assignedTo: "Worker A",
      date: "2025-09-10",
    },
    {
      id: 2,
      customer: "Jane Smith",
      type: "Tailoring",
      status: "Completed",
      assignedTo: "Worker B",
      date: "2025-09-09",
    },
    {
      id: 3,
      customer: "Rahul Patil",
      type: "Handwork",
      status: "In Progress",
      assignedTo: "Worker C",
      date: "2025-09-08",
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manager Orders</h1>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-3">Order ID</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Type</th>
              <th className="p-3">Status</th>
              <th className="p-3">Assigned To</th>
              <th className="p-3">Date</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{order.id}</td>
                <td className="p-3">{order.customer}</td>
                <td className="p-3">{order.type}</td>
                <td
                  className={`p-3 font-medium ${
                    order.status === "Completed"
                      ? "text-green-600"
                      : order.status === "Pending"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {order.status}
                </td>
                <td className="p-3">{order.assignedTo}</td>
                <td className="p-3">{order.date}</td>
                <td className="p-3">
                  <button className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagerOrders;
