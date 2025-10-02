import React, { useEffect, useState } from "react";
import { getAssignableStaff, assignTask, getOrdersWithItems } from "../../api/task";

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-800",
  "in-progress": "bg-blue-100 text-blue-800",
  done: "bg-green-100 text-green-800",
  reassigned: "bg-orange-100 text-orange-800",
  "Not Assigned": "bg-gray-100 text-gray-600"
};

const AdminTaskManager = () => {
  const [ordersWithItems, setOrdersWithItems] = useState([]);
  const [assignableStaff, setAssignableStaff] = useState({});
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedWorkers, setSelectedWorkers] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showMeasurementsFor, setShowMeasurementsFor] = useState(null);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const ordersData = await getOrdersWithItems();
        setOrdersWithItems(ordersData.data || ordersData);
      } catch (err) {
        console.error("Error fetching orders:", err);
        showMessage("error", "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Fetch assignable staff for selected order
  useEffect(() => {
    const fetchStaff = async () => {
      const serviceId = selectedOrder?.mainOrder?.service?._id;
      if (!serviceId) return;
      try {
        const staffData = await getAssignableStaff(serviceId);
        setAssignableStaff(prev => ({
          ...prev,
          [serviceId]: staffData.data || staffData
        }));
      } catch (err) {
        console.error("Error fetching staff:", err);
      }
    };
    fetchStaff();
  }, [selectedOrder]);

  const getItemIndex = (orderGroup, item) => {
    if (!orderGroup) return 1;
    if (!item) return 1; 
    const idx = orderGroup.items.findIndex(i => i._id === item._id);
    return idx >= 0 ? idx + 2 : 1;
  };

  const filteredOrders = ordersWithItems.filter(orderGroup => {
    const order = orderGroup.mainOrder;
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      (order.customer?.name && order.customer.name.toLowerCase().includes(searchLower)) ||
      (order.service?.category && order.service.category.toLowerCase().includes(searchLower)) ||
      (order.service?.name && order.service.name.toLowerCase().includes(searchLower));
    const matchesStatus = !statusFilter || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAssignTask = async (role, itemId = null) => {
    const workerData = selectedWorkers[role];
    if (!workerData?.staffId) {
      showMessage("error", "Please select a worker before assigning.");
      return;
    }

    const orderId = itemId || selectedOrder?.mainOrder?._id;
    if (!orderId) {
      showMessage("error", "No order selected.");
      return;
    }

    try {
      const taskData = {
        orderId,
        stage: role,
        staffId: workerData.staffId,
        deadline: workerData.deadline || null,
        remarks: `Assigned for ${itemId ? 'Item' : 'Main Order'}`,
        itemId: itemId || null
      };

      const result = await assignTask(taskData);

      if (result.success) {
        showMessage("success", "Task assigned successfully!");

        // Refresh orders
        const ordersData = await getOrdersWithItems();
        setOrdersWithItems(ordersData.data || ordersData);

        const updatedOrder = (ordersData.data || ordersData).find(
          o => o.mainOrder._id === selectedOrder.mainOrder._id
        );
        setSelectedOrder(updatedOrder);

        setSelectedWorkers(prev => ({ ...prev, [role]: {} }));
      } else {
        showMessage("error", result.message || "Failed to assign task");
      }
    } catch (err) {
      console.error(err);
      showMessage("error", err.response?.data?.message || "Failed to assign task");
    }
  };

  const RoleAssignmentCard = ({ role, itemId = null, itemName = null, availableStaff = [] }) => {
    const allTasks = selectedItem?.tasks || selectedOrder.mainOrder.tasks || [];
    const currentTask = allTasks.find(
      t => t.stage === role && String(t.itemId || "") === String(itemId || "")
    );
    const taskStatus = currentTask?.status || "Not Assigned";

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-semibold text-gray-800">{role} {itemName && `- ${itemName}`}</h4>
          <span className={`px-2 py-1 rounded text-xs ${STATUS_COLORS[taskStatus] || STATUS_COLORS["Not Assigned"]}`}>
            {taskStatus}
          </span>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Worker</label>
            <select
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              value={selectedWorkers[role]?.staffId || currentTask?.assignedTo?._id || ""}
              onChange={(e) => setSelectedWorkers(prev => ({
                ...prev,
                [role]: { ...prev[role], staffId: e.target.value }
              }))}
            >
              <option value="">Choose worker...</option>
              {availableStaff.map(s => (
                <option key={s._id} value={s._id}>
                  {s.name} ({s.role}) {s.certified && "⭐"} {s.experience > 0 && `(${s.experience}yrs)`}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
            <input
              type="date"
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              value={selectedWorkers[role]?.deadline || (currentTask?.deadline ? new Date(currentTask.deadline).toISOString().split('T')[0] : "")}
              onChange={(e) => setSelectedWorkers(prev => ({
                ...prev,
                [role]: { ...prev[role], deadline: e.target.value }
              }))}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          {currentTask && (
            <div className="bg-gray-50 p-2 rounded text-sm">
              <p><strong>Current:</strong> {currentTask.assignedTo?.name}</p>
              {currentTask.deadline && <p><strong>Deadline:</strong> {new Date(currentTask.deadline).toLocaleDateString()}</p>}
              {currentTask.remarks && <p><strong>Remarks:</strong> {currentTask.remarks}</p>}
            </div>
          )}

          <button
            onClick={() => handleAssignTask(role, itemId)}
            className={`w-full py-2 rounded font-medium transition-colors ${currentTask ? "bg-orange-500 hover:bg-orange-600 text-white" : "bg-blue-500 hover:bg-blue-600 text-white"}`}
            disabled={!selectedWorkers[role]?.staffId}
          >
            {currentTask ? "Reassign Task" : "Assign Task"}
          </button>
        </div>
      </div>
    );
  };

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div></div>;

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      {message.text && <div className={`mb-4 p-3 rounded ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{message.text}</div>}

      <h1 className="text-2xl font-bold mb-2">Task Assignment System</h1>
      <p className="text-gray-600 mb-6">Assign or Reassign work to staff members</p>

      {!selectedOrder ? (
        <>
          <div className="flex gap-4 mb-6">
            <input
              type="text"
              placeholder="Search by customer name, or category..."
              className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="Placed">Placed</option>
              <option value="Cutting">Cutting</option>
              <option value="Handworking">Handworking</option>
              <option value="Stitching">Stitching</option>
              <option value="Quality Check">Quality Check</option>
            </select>
          </div>

          <div className="grid gap-4">
            {filteredOrders.length > 0 ? filteredOrders.map((orderGroup, idx) => (
              <div key={orderGroup.mainOrder._id} className="border rounded-lg p-4 bg-white shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-lg">#ORD {idx + 1}</h3>
                    <p className="text-gray-600">Customer: {orderGroup.mainOrder.customer?.name}</p>
                    <p className="text-gray-600">Category: {orderGroup.mainOrder.service?.category}</p>
                    <p className="text-gray-600">Service: {orderGroup.mainOrder.service?.name}</p>
                  </div>
                  <button onClick={() => setSelectedOrder(orderGroup)} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">Assign Tasks</button>
                </div>
              </div>
            )) : <div className="text-center py-8 text-gray-500">No orders found matching your criteria</div>}
          </div>
        </>
      ) : (
        <>
          <div className="bg-white border rounded-lg p-4 mb-4 shadow-sm flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold">
                {selectedItem ? `Item ${getItemIndex(selectedOrder, selectedItem)} / ${selectedOrder.items.length + 1}` : "Main Order"}
              </h2>
              <p className="text-gray-600">Customer: {selectedOrder.mainOrder.customer?.name}</p>
              <p className="text-gray-600">Category: {selectedOrder.mainOrder.service?.category}</p>
              <p className="text-gray-600">Service: {selectedOrder.mainOrder.service?.name}</p>
            </div>
            <button
              onClick={() => { setSelectedOrder(null); setSelectedItem(null); setSelectedWorkers({}); setShowMeasurementsFor(null); }}
              className="text-gray-600 hover:text-gray-800 px-4 py-2 rounded hover:bg-gray-100 transition-colors"
            >
              ← Back
            </button>
          </div>

          {/* Item Selection */}
          <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-bold mb-3">Select Item:</h3>
            <div className="flex flex-wrap gap-2 items-center">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedItem(null)}
                  className={`px-4 py-2 rounded ${!selectedItem ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
                >
                  Main Order
                </button>
                <button
                  onClick={() => setShowMeasurementsFor(showMeasurementsFor === null ? "main" : null)}
                  className="p-2 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                  title="View Measurements"
                >
                  👁
                </button>
              </div>

              {selectedOrder.items.map(item => (
                <div key={item._id} className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedItem(item)}
                    className={`px-4 py-2 rounded ${selectedItem?._id === item._id ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
                  >
                    Item {getItemIndex(selectedOrder, item)} / {selectedOrder.items.length + 1} ({item.service?.name})
                  </button>
                  <button
                    onClick={() => setShowMeasurementsFor(showMeasurementsFor === item._id ? null : item._id)}
                    className="p-2 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                    title="View Measurements"
                  >
                    👁
                  </button>
                </div>
              ))}
            </div>

            {showMeasurementsFor !== null && (
              <div className="mt-4 p-3 bg-gray-50 border rounded shadow-sm">
                <h4 className="font-semibold mb-2">Measurements:</h4>
                {showMeasurementsFor === "main" ? (
                  selectedOrder.mainOrder.measurements.map((m, idx) => (
                    <p key={idx} className="text-gray-700 text-sm">{m.fieldName}: {m.value}</p>
                  ))
                ) : (
                  selectedOrder.items.find(i => i._id === showMeasurementsFor)?.measurements.map((m, idx) => (
                    <p key={idx} className="text-gray-700 text-sm">{m.fieldName}: {m.value}</p>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Role Assignment Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {["Admin", "Cutter", "Handworker", "Manager"].map(role => {
              const staffForRole = (assignableStaff[selectedOrder.mainOrder.service._id] || []).filter(s => s.role === role);
              if (staffForRole.length === 0) return null;

              return (
                <RoleAssignmentCard
                  key={role}
                  role={role}
                  itemId={selectedItem?._id}
                  itemName={selectedItem ? `Item ${getItemIndex(selectedOrder, selectedItem)}` : null}
                  availableStaff={staffForRole}
                />
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminTaskManager;
