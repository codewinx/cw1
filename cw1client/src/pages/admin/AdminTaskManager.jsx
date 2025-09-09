// src/pages/admin/AdminTaskManager.jsx
import React, { useEffect, useState } from "react";
import { getOrders } from "../../api/order";
import { getAllStaff } from "../../api/staff";
import { assignTask } from "../../api/task";
import { getMeasurementsByCustomerId } from "../../api/measurement";

const ROLE_MAP = {
  Tailor: "Tailor",
  Cutter: "Cutter",
  Handworker: "Handworker",
};

const STATUS_COLORS = {
  Pending: "bg-yellow-100 text-yellow-800",
  "In Progress": "bg-blue-100 text-blue-800",
  Completed: "bg-green-100 text-green-800",
  Cancelled: "bg-red-100 text-red-800",
};

const AdminTaskManager = () => {
  const [orders, setOrders] = useState([]);
  const [staff, setStaff] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedWorkers, setSelectedWorkers] = useState({});
  const [measurements, setMeasurements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Fetch orders + staff
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [orderData, staffData] = await Promise.all([
          getOrders(),
          getAllStaff()
        ]);
        
        setOrders(orderData.data || orderData);
        setStaff(staffData.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Fetch measurements when an order is selected
  useEffect(() => {
    const fetchMeasurements = async () => {
      if (selectedOrder?.customer?._id) {
        try {
          const data = await getMeasurementsByCustomerId(selectedOrder.customer._id);
          setMeasurements(data);
        } catch (err) {
          console.error("Error fetching measurements:", err);
          setMeasurements([]);
        }
      }
    };
    fetchMeasurements();
  }, [selectedOrder]);

  // Filter orders based on search and status
  const filteredOrders = orders.filter(order => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm || 
                         (order.orderNo && String(order.orderNo).toLowerCase().includes(searchLower)) ||
                         (order.customer?.name && order.customer.name.toLowerCase().includes(searchLower)) ||
                         (order.category && order.category.toLowerCase().includes(searchLower)) ||
                         (order.service && order.service.toLowerCase().includes(searchLower));
    const matchesStatus = !statusFilter || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Assign task with deadline
  const handleAssign = async (role) => {
    const workerData = selectedWorkers[role];
    const currentTask = selectedOrder?.tasks?.find((t) => t.stage === role);
    const currentStaffId = currentTask?.assignedTo?._id;
    const staffId = workerData?.staffId || currentStaffId;
    const deadline = workerData?.deadline || currentTask?.deadline;

    if (!staffId) {
      alert("Please select a worker before assigning.");
      return;
    }

    try {
      await assignTask({
        orderId: selectedOrder._id,
        staffId,
        stage: role,
        deadline,
      });

      alert(`${role} task assigned successfully ✅`);

      // Refresh data
      const orderData = await getOrders();
      setOrders(orderData.data || orderData);
      const updated = (orderData.data || orderData).find(o => o._id === selectedOrder._id);
      setSelectedOrder(updated);
      setSelectedWorkers((prev) => ({ ...prev, [role]: {} }));
    } catch (err) {
      alert(err.response?.data?.error || "Failed to assign task");
    }
  };

  // Role assignment card component
  const RoleAssignmentCard = ({ role, label }) => {
    const currentTask = selectedOrder?.tasks?.find((t) => t.stage === role);
    const assignedStaff = currentTask?.assignedTo?._id || "";
    const assignedDeadline = currentTask?.deadline;
    const formattedDeadline = assignedDeadline
      ? new Date(assignedDeadline).toISOString().split("T")[0]
      : "";
    const taskStatus = currentTask?.status || "Not Assigned";

    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{label}</h3>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            currentTask ? STATUS_COLORS[taskStatus] || "bg-gray-100 text-gray-800" : "bg-gray-100 text-gray-600"
          }`}>
            {taskStatus}
          </span>
        </div>

        <div className="space-y-4">
          {/* Worker Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Worker
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              value={selectedWorkers[role]?.staffId || assignedStaff}
              onChange={(e) =>
                setSelectedWorkers((prev) => ({
                  ...prev,
                  [role]: { ...(prev[role] || {}), staffId: e.target.value },
                }))
              }
            >
              <option value="">Choose a worker...</option>
              {staff
                .filter((s) => s.role?.toLowerCase() === role.toLowerCase())
                .map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name} {currentTask?.assignedTo?._id === s._id && "(Current)"}
                  </option>
                ))}
            </select>
          </div>

          {/* Deadline Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deadline
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              value={selectedWorkers[role]?.deadline || formattedDeadline}
              onChange={(e) =>
                setSelectedWorkers((prev) => ({
                  ...prev,
                  [role]: { ...(prev[role] || {}), deadline: e.target.value },
                }))
              }
            />
          </div>

          {/* Current Assignment Info */}
          {currentTask && (
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Current:</span> {currentTask.assignedTo?.name}
              </p>
              {assignedDeadline && (
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Deadline:</span> {new Date(assignedDeadline).toLocaleDateString()}
                </p>
              )}
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={() => handleAssign(role)}
            className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
              currentTask 
                ? "bg-orange-500 hover:bg-orange-600 text-white" 
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {currentTask ? "Re-assign Task" : "Assign Task"}
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Task Management Center</h1>
          <p className="text-gray-600">Assign and manage tasks across your team efficiently</p>
        </div>

        {/* Orders List View */}
        {!selectedOrder && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Filters */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search by order number, customer name, or category..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="sm:w-48">
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order Details
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Service Info
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Task Progress
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredOrders?.length > 0 ? (
                    filteredOrders.map((order) => {
                      const tasksAssigned = order.tasks?.length || 0;
                      const totalTasks = Object.keys(ROLE_MAP).length;
                      const progressPercentage = (tasksAssigned / totalTasks) * 100;

                      return (
                        <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                #{order.orderNo}
                              </div>
                              <div className="text-sm text-gray-500">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {order.customer?.name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{order.category}</div>
                            <div className="text-sm text-gray-500">{order.service}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              STATUS_COLORS[order.status] || "bg-gray-100 text-gray-800"
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${progressPercentage}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-600">
                                {tasksAssigned}/{totalTasks}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                tasksAssigned > 0
                                  ? "bg-orange-100 text-orange-700 hover:bg-orange-200"
                                  : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                              }`}
                            >
                              {tasksAssigned > 0 ? "Manage Tasks" : "Assign Tasks"}
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center">
                        <div className="text-gray-500">
                          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          No orders found matching your criteria
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Task Assignment Detail View */}
        {selectedOrder && (
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Order #{selectedOrder.orderNo}
                  </h2>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>Customer: {selectedOrder.customer?.name}</span>
                    <span>•</span>
                    <span>Date: {new Date(selectedOrder.createdAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>Category: {selectedOrder.category}</span>
                    <span>•</span>
                    <span>Service: {selectedOrder.service}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  ← Back to Orders
                </button>
              </div>
            </div>

            {/* Role Assignment Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {Object.entries(ROLE_MAP).map(([key, label]) => (
                <RoleAssignmentCard key={key} role={key} label={label} />
              ))}
            </div>

            {/* Task Summary */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Task Assignment Summary</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned To</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deadline</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned By</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {Object.keys(ROLE_MAP).map((role) => {
                      const task = selectedOrder.tasks?.find((t) => t.stage === role);
                      return (
                        <tr key={role}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-medium text-gray-900">{ROLE_MAP[role]}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-900">
                              {task?.assignedTo?.name || "-"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-900">
                              {task?.deadline ? new Date(task.deadline).toLocaleDateString() : "-"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              task ? STATUS_COLORS[task.status] || "bg-gray-100 text-gray-800" : "bg-gray-100 text-gray-600"
                            }`}>
                              {task?.status || "Not Assigned"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-900">
                              {task?.assignedBy?.name || "-"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Customer Measurements */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Customer Measurements</h3>
              </div>
              {measurements?.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Measurements</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {measurements.map((m) => (
                        <tr key={m._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-medium text-gray-900">{m.category}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {m.data?.length > 0 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                                  {m.data.map((d, index) => (
                                    <span key={index} className="bg-gray-100 px-2 py-1 rounded text-xs">
                                      {d.key}: {d.value}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                "-"
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-6 text-center text-gray-500">
                  <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  No measurements found for this customer
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTaskManager;