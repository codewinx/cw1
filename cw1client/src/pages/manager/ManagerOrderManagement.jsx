import React from "react";

const ManagerOrderManagement = () => {
  // Dummy data – replace with API data later
  const orders = [
    { id: 1, orderNumber: "#1001", customer: "John Doe", status: "Pending" },
    { id: 2, orderNumber: "#1002", customer: "Alice Smith", status: "Completed" },
    { id: 3, orderNumber: "#1003", customer: "Bob Johnson", status: "In Progress" },
    { id: 4, orderNumber: "#1004", customer: "Mary Jane", status: "Pending" },
  ];

  return (
    <div className="p-4 sm:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl sm:text-3xl font-extrabold mb-6 text-center sm:text-left text-gray-800">
        Order Management
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="p-4 bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-transform transform hover:-translate-y-1"
          >
            <h2 className="text-lg font-semibold text-gray-700">
              {order.orderNumber}
            </h2>
            <p className="text-gray-500 mt-1">
              <span className="font-semibold">Customer:</span> {order.customer}
            </p>
            <p
              className={`mt-2 font-bold ${
                order.status === "Completed"
                  ? "text-green-600"
                  : order.status === "Pending"
                  ? "text-red-500"
                  : "text-yellow-600"
              }`}
            >
              {order.status}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManagerOrderManagement;
