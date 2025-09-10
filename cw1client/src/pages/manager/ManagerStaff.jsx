import React from "react";

const ManagerStaff = () => {
  // Dummy data for now – later connect with backend API
  const staffList = [
    {
      id: 1,
      name: "Amit Sharma",
      role: "Cutter",
      status: "Available",
      assignedOrders: 3,
    },
    {
      id: 2,
      name: "Sneha Patil",
      role: "Tailor",
      status: "Busy",
      assignedOrders: 5,
    },
    {
      id: 3,
      name: "Ravi Kumar",
      role: "Handworker",
      status: "Available",
      assignedOrders: 1,
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manager Staff</h1>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-3">Staff ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Role</th>
              <th className="p-3">Status</th>
              <th className="p-3">Assigned Orders</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {staffList.map((staff) => (
              <tr key={staff.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{staff.id}</td>
                <td className="p-3">{staff.name}</td>
                <td className="p-3">{staff.role}</td>
                <td
                  className={`p-3 font-medium ${
                    staff.status === "Available"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {staff.status}
                </td>
                <td className="p-3">{staff.assignedOrders}</td>
                <td className="p-3">
                  <button className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                    View
                  </button>
                  <button className="ml-2 px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600">
                    Assign
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

export default ManagerStaff;
