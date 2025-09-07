import React, { useEffect, useState } from "react";
import { getOrders } from "../../api/order";
import { getAllStaff } from "../../api/staff";
import { assignTask } from "../../api/task";

const ROLE_MAP = {
  Tailor: "Tailor",
  Cutter: "Cutter",
  Handworker: "Handworker",
};

const AdminTaskManager = () => {
  const [orders, setOrders] = useState([]);
  const [staff, setStaff] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedWorkers, setSelectedWorkers] = useState({}); // { Tailor: {staffId, deadline} }

  // Fetch orders + staff
  useEffect(() => {
    const fetchData = async () => {
      try {
        const orderData = await getOrders();
        setOrders(orderData.data || orderData);
        const staffData = await getAllStaff();
        setStaff(staffData.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  // Assign task with deadline
  const handleAssign = async (role) => {
    const workerData = selectedWorkers[role];
    if (!workerData?.staffId) {
      alert("Please select a worker before assigning.");
      return;
    }

    try {
      await assignTask({
        orderId: selectedOrder._id,
        staffId: workerData.staffId,
        stage: role,
        deadline: workerData.deadline, // 👈 send deadline
      });
      alert(`${role} task assigned successfully ✅`);

      // Refresh orders after assigning
      const orderData = await getOrders();
      setOrders(orderData.data || orderData);

      // Update selected order with fresh data
      const updated = (orderData.data || orderData).find(
        (o) => o._id === selectedOrder._id
      );
      setSelectedOrder(updated);

      // Reset dropdown & deadline
      setSelectedWorkers((prev) => ({ ...prev, [role]: {} }));
    } catch (err) {
      alert(err.response?.data?.error || "Failed to assign task");
    }
  };

  // Role assignment box
  const renderRoleBox = (role, label) => {
    const currentTask = selectedOrder?.tasks?.find((t) => t.stage === role);
    const assignedStaff = currentTask?.assignedTo?._id || "";

    // 👇 FIXED: Format the deadline to YYYY-MM-DD for the input value
    const assignedDeadline = currentTask?.deadline;
    const formattedDeadline = assignedDeadline
      ? new Date(assignedDeadline).toISOString().split('T')[0]
      : "";

    return (
      <div className="border rounded-lg p-4 w-full md:w-1/3">
        <h3 className="font-semibold mb-2">{label}</h3>

        {/* Worker Dropdown */}
        <select
          className="border p-2 rounded w-full mb-2"
          value={selectedWorkers[role]?.staffId || assignedStaff}
          onChange={(e) =>
            setSelectedWorkers((prev) => ({
              ...prev,
              [role]: { ...(prev[role] || {}), staffId: e.target.value },
            }))
          }
        >
          <option value="">Select worker...</option>
          {staff
            .filter((s) => s.role?.toLowerCase() === role.toLowerCase())
            .map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
        </select>

        {/* Deadline input */}
        <input
          type="date"
          className="border p-2 rounded w-full mb-2"
          value={selectedWorkers[role]?.deadline || formattedDeadline}
          onChange={(e) =>
            setSelectedWorkers((prev) => ({
              ...prev,
              [role]: { ...(prev[role] || {}), deadline: e.target.value },
            }))
          }
        />

        {/* Status */}
        <p
          className={`text-sm mb-2 ${
            currentTask ? "text-green-600" : "text-yellow-600"
          }`}
        >
          Status: {currentTask ? "Assigned" : "Pending"}
        </p>

        <button
          onClick={() => handleAssign(role)}
          className="px-4 py-2 border rounded bg-blue-100"
        >
          {currentTask ? "Re-Assign" : "Assign"}
        </button>
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Task Manager</h1>

      {/* Orders Table */}
      {!selectedOrder && (
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Order No</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders?.length > 0 ? (
                orders.map((order) => (
                  <tr key={order._id} className="border-b">
                    <td className="px-4 py-3">{order.orderNo}</td>
                    <td className="px-4 py-3">{order.customer?.name}</td>
                    <td className="px-4 py-3">{order.category}</td>
                    <td className="px-4 py-3">{order.service}</td>
                    <td className="px-4 py-3">{order.status}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="px-3 py-1 bg-blue-600 text-white rounded"
                      >
                        Assign
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-4 py-6 text-center text-gray-500"
                  >
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Assignment Panel */}
      {selectedOrder && (
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-bold">
              Order No: {selectedOrder.orderNo}
            </h2>
            <button
              onClick={() => setSelectedOrder(null)}
              className="px-3 py-1 border rounded text-gray-600"
            >
              Back
            </button>
          </div>
          <p className="mb-2">
            Date: {new Date(selectedOrder.createdAt).toLocaleDateString()} |{" "}
            Category: {selectedOrder.category}
          </p>

          {/* Role Assignments */}
          <div className="flex flex-wrap gap-4 mb-6">
            {Object.entries(ROLE_MAP).map(([key, label]) =>
              renderRoleBox(key, label)
            )}
          </div>

          {/* Task Summary */}
          <h3 className="font-semibold mb-2">Task Summary</h3>
          <div className="overflow-x-auto">
            <table className="w-full border rounded-lg text-sm">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="px-4 py-2">Order</th>
                  <th className="px-4 py-2">Tailor</th>
                  <th className="px-4 py-2">Cutter</th>
                  <th className="px-4 py-2">Handworker</th>
                  <th className="px-4 py-2">Deadline</th>
                  <th className="px-4 py-2">Assigned By</th>
                  <th className="px-4 py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-2">{selectedOrder.orderNo}</td>
                  <td className="px-4 py-2">
                    {selectedOrder.tasks?.find((t) => t.stage === "Tailor")
                      ?.assignedTo?.name || "-"}
                  </td>
                  <td className="px-4 py-2">
                    {selectedOrder.tasks?.find((t) => t.stage === "Cutter")
                      ?.assignedTo?.name || "-"}
                  </td>
                  <td className="px-4 py-2">
                    {selectedOrder.tasks?.find((t) => t.stage === "Handworker")
                      ?.assignedTo?.name || "-"}
                  </td>
                  <td className="px-4 py-2">
                    {selectedOrder.tasks?.find((t) => t.deadline)
                      ? new Date(
                          selectedOrder.tasks.find((t) => t.deadline).deadline
                        ).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="px-4 py-2">
                    {selectedOrder.tasks?.[0]?.assignedBy?.name || "-"}
                  </td>
                  <td className="px-4 py-2">
                    {new Date(selectedOrder.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTaskManager;