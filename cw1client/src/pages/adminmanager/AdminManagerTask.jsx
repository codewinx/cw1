import React, { useEffect, useState } from "react";
import { getAssignableStaff, assignTask, getOrdersWithItems } from "../../api/admin+manager.js";
import { Users, Search, Filter, ArrowLeft, Eye, Calendar, Briefcase, Award, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-800",
  "in-progress": "bg-blue-100 text-blue-800",
  done: "bg-green-100 text-green-800",
  reassigned: "bg-orange-100 text-orange-800",
  "Not Assigned": "bg-gray-100 text-gray-600"
};

const STATUS_STYLES = {
  'Placed': 'bg-gray-100 text-gray-800',
  'Cutting': 'bg-blue-100 text-blue-800',
  'Handworking': 'bg-purple-100 text-purple-800',
  'Tailoring': 'bg-yellow-100 text-yellow-800',
  'Stitching': 'bg-orange-100 text-orange-800',
  'Quality Check': 'bg-indigo-100 text-indigo-800',
  'Ready to Deliver': 'bg-green-100 text-green-800',
  'Delivered': 'bg-green-200 text-green-900'
};

const AdminManagerTask = () => {
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

  // Helper function to find tasks for roles and items
  const findTaskForRoleAndItem = (role, itemId = null) => {
    if (!selectedOrder) return null;
    
    // For main order tasks - only tasks without itemId
    if (!itemId) {
      return selectedOrder.mainOrder.tasks?.find(t => 
        t.stage === role && !t.itemId
      );
    }
    
    // For item tasks - check both main order's item tasks and item's own tasks
    const item = selectedOrder.items.find(i => i._id === itemId);
    
    // First check if the item has its own tasks array
    if (item?.tasks) {
      const itemTask = item.tasks.find(t => t.stage === role);
      if (itemTask) return itemTask;
    }
    
    // Then check main order tasks that reference this item
    const mainOrderTaskWithItem = selectedOrder.mainOrder.tasks?.find(
      t => t.stage === role && t.itemId && t.itemId.toString() === itemId.toString()
    );
    
    return mainOrderTaskWithItem || null;
  };

  // Calculate task statistics
  const calculateTaskStats = () => {
    let pendingTasks = 0;
    let inProgressTasks = 0;
    let completedTasks = 0;
    let totalTasks = 0;

    ordersWithItems.forEach(orderGroup => {
      // Count tasks from main order
      const mainTasks = orderGroup.mainOrder.tasks || [];
      mainTasks.forEach(task => {
        totalTasks++;
        if (task.status === 'pending') pendingTasks++;
        else if (task.status === 'in-progress') inProgressTasks++;
        else if (task.status === 'done') completedTasks++;
      });

      // Count tasks from items
      orderGroup.items.forEach(item => {
        const itemTasks = item.tasks || [];
        itemTasks.forEach(task => {
          totalTasks++;
          if (task.status === 'pending') pendingTasks++;
          else if (task.status === 'in-progress') inProgressTasks++;
          else if (task.status === 'done') completedTasks++;
        });
      });
    });

    return { pendingTasks, inProgressTasks, completedTasks, totalTasks };
  };

  const { pendingTasks, inProgressTasks, completedTasks, totalTasks } = calculateTaskStats();

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

    // FIXED: Use the correct order ID based on whether it's for an item or main order
    let targetOrderId;
    if (itemId) {
      // For item tasks, find the item's order ID
      const item = selectedOrder.items.find(i => i._id === itemId);
      targetOrderId = item?._id; // Use the item's order ID
    } else {
      // For main order tasks, use main order ID
      targetOrderId = selectedOrder?.mainOrder?._id;
    }

    if (!targetOrderId) {
      showMessage("error", "No order selected.");
      return;
    }

    try {
      const taskData = {
        orderId: targetOrderId, // FIXED: Use the correct order ID
        stage: role,
        staffId: workerData.staffId,
        deadline: workerData.deadline || null,
        remarks: `Assigned for ${itemId ? 'Item' : 'Main Order'}`,
        itemId: itemId || null
      };

      const result = await assignTask(taskData);

      if (result.success) {
        showMessage("success", "Task assigned successfully!");

        // Force refresh the data
        const ordersData = await getOrdersWithItems();
        setOrdersWithItems(ordersData.data || ordersData);

        // Find and update the selected order
        const updatedOrder = (ordersData.data || ordersData).find(
          o => o.mainOrder._id === selectedOrder.mainOrder._id
        );
        
        if (updatedOrder) {
          setSelectedOrder(updatedOrder);
        }

        // Clear selection for this role
        setSelectedWorkers(prev => ({ 
          ...prev, 
          [role]: {} 
        }));
      } else {
        showMessage("error", result.message || "Failed to assign task");
      }
    } catch (err) {
      console.error(err);
      showMessage("error", err.response?.data?.message || "Failed to assign task");
    }
  };

const StatCard = ({ icon: Icon, title, value, subtitle, color }) => (
  <div className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow flex items-center justify-between">
    <div className="flex items-center gap-4">
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
        <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      </div>
    </div>
  </div>
);

  const RoleAssignmentCard = ({ role, itemId = null, itemName = null, availableStaff = [] }) => {
    const currentTask = findTaskForRoleAndItem(role, itemId);
    const taskStatus = currentTask?.status || "Not Assigned";

    const getRoleIcon = (role) => {
      switch(role) {
        case 'Admin': return '👑';
        case 'Cutter': return '✂️';
        case 'Handworker': return '🛠️';
        case 'Manager': return '📊';
        default: return '👤';
      }
    };

    const getRoleColor = (role) => {
      switch(role) {
        case 'Admin': return 'bg-purple-500';
        case 'Cutter': return 'bg-blue-500';
        case 'Handworker': return 'bg-orange-500';
        case 'Manager': return 'bg-green-500';
        default: return 'bg-gray-500';
      }
    };

    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-md hover:shadow-lg transition-shadow">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${getRoleColor(role)}`}>
              <span className="text-white text-sm">{getRoleIcon(role)}</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 text-lg">{role}</h4>
              {itemName && <p className="text-sm text-gray-600">{itemName}</p>}
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[taskStatus] || STATUS_COLORS["Not Assigned"]}`}>
            {taskStatus === "Not Assigned" ? "Not Assigned" : taskStatus}
          </span>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Worker</label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Deadline
            </label>
            <input
              type="date"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
              value={selectedWorkers[role]?.deadline || (currentTask?.deadline ? new Date(currentTask.deadline).toISOString().split('T')[0] : "")}
              onChange={(e) => setSelectedWorkers(prev => ({
                ...prev,
                [role]: { ...prev[role], deadline: e.target.value }
              }))}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          {currentTask && (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h5 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Current Assignment
              </h5>
              <div className="space-y-2 text-sm">
                <p><strong className="text-gray-700">Worker:</strong> {currentTask.assignedTo?.name}</p>
                {currentTask.deadline && (
                  <p><strong className="text-gray-700">Deadline:</strong> {new Date(currentTask.deadline).toLocaleDateString()}</p>
                )}
                {currentTask.remarks && (
                  <p><strong className="text-gray-700">Remarks:</strong> {currentTask.remarks}</p>
                )}
              </div>
            </div>
          )}

          <button
            onClick={() => handleAssignTask(role, itemId)}
            className={`w-full py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
              currentTask 
                ? "bg-orange-500 hover:bg-orange-600 text-white" 
                : "bg-purple-500 hover:bg-purple-600 text-white"
            }`}
            disabled={!selectedWorkers[role]?.staffId}
          >
            <Briefcase className="w-4 h-4" />
            {currentTask ? "Reassign Task" : "Assign Task"}
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">👔 Task Assignment System</h1>
          <p className="text-gray-600">Assign or reassign work to staff members efficiently</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Users}
            title="Total Orders"
            value={filteredOrders.length}
            subtitle={`${totalTasks} total tasks`}
            color="bg-blue-500"
          />
          <StatCard
            icon={Briefcase}
            title="Pending Tasks"
            value={pendingTasks}
            color="bg-orange-500"
          />
          <StatCard
            icon={CheckCircle}
            title="In Progress Tasks"
            value={inProgressTasks}
            color="bg-purple-500"
          />
          <StatCard
            icon={Award}
            title="Completed Tasks"
            value={completedTasks}
            color="bg-green-500"
          />
        </div>

        {/* Message Alert */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-xl ${
            message.type === 'error' 
              ? 'bg-red-100 text-red-700 border border-red-200' 
              : 'bg-green-100 text-green-700 border border-green-200'
          }`}>
            <div className="flex items-center gap-2">
              {message.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
              {message.text}
            </div>
          </div>
        )}

        {!selectedOrder ? (
          <>
            {/* Search and Filter Section */}
            <div className="bg-white p-6 rounded-xl shadow-md mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by customer name, category, or service..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-4">
                  <div className="relative">
                    <Filter className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <select
                      className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 appearance-none bg-white"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="">All Status</option>
                      <option value="Placed">Placed</option>
                      <option value="Cutting">Cutting</option>
                      <option value="Handworking">Handworking</option>
                      <option value="Stitching">Stitching</option>
                      <option value="Quality Check">Quality Check</option>
                      <option value="Ready to Deliver">Ready to Deliver</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Orders Grid */}
            <div className="grid gap-6">
              {filteredOrders.length > 0 ? filteredOrders.map((orderGroup, idx) => (
                <div key={orderGroup.mainOrder._id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <h3 className="text-xl font-bold text-gray-800">#ORD{String(idx + 1).padStart(3, '0')}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${STATUS_STYLES[orderGroup.mainOrder.status] || STATUS_STYLES['Placed']}`}>
                          {orderGroup.mainOrder.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Customer</p>
                          <p className="font-semibold text-gray-800">{orderGroup.mainOrder.customer?.name || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Category</p>
                          <p className="font-semibold text-gray-800">{orderGroup.mainOrder.service?.category || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Service</p>
                          <p className="font-semibold text-gray-800">{orderGroup.mainOrder.service?.name || 'N/A'}</p>
                        </div>
                      </div>
                      {orderGroup.items.length > 0 && (
                        <div className="mt-3">
                          <p className="text-gray-600 text-sm">
                            Includes {orderGroup.items.length} additional item{orderGroup.items.length > 1 ? 's' : ''}
                          </p>
                        </div>
                      )}
                    </div>
                    <button 
                      onClick={() => setSelectedOrder(orderGroup)}
                      className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2 font-medium"
                    >
                      <Briefcase className="w-4 h-4" />
                      Assign Tasks
                    </button>
                  </div>
                </div>
              )) : (
                <div className="text-center py-12 bg-white rounded-xl shadow-md">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No orders found</h3>
                  <p className="text-gray-500">No orders match your search criteria</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Order Details Header */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <button
                      onClick={() => { setSelectedOrder(null); setSelectedItem(null); setSelectedWorkers({}); setShowMeasurementsFor(null); }}
                      className="flex items-center gap-2 text-gray-600 hover:text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back to Orders
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <p className="text-gray-600 text-sm">Customer</p>
                      <p className="font-semibold text-lg text-gray-800">{selectedOrder.mainOrder.customer?.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Category</p>
                      <p className="font-semibold text-gray-800">{selectedOrder.mainOrder.service?.category}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Service</p>
                      <p className="font-semibold text-gray-800">{selectedOrder.mainOrder.service?.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Current Status</p>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${STATUS_STYLES[selectedOrder.mainOrder.status] || STATUS_STYLES['Placed']}`}>
                        {selectedOrder.mainOrder.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Item Selection */}
            <div className="bg-white p-6 rounded-xl shadow-md mb-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-500" />
                Select Item to Assign
              </h3>
              <div className="flex flex-wrap gap-3 items-center">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedItem(null)}
                    className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                      !selectedItem 
                        ? "bg-purple-500 text-white" 
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <Briefcase className="w-4 h-4" />
                    Main Order
                  </button>
                  <button
                    onClick={() => setShowMeasurementsFor(showMeasurementsFor === null ? "main" : null)}
                    className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                    title="View Measurements"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>

                {selectedOrder.items.map(item => (
                  <div key={item._id} className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedItem(item)}
                      className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                        selectedItem?._id === item._id 
                          ? "bg-purple-500 text-white" 
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      <Briefcase className="w-4 h-4" />
                      Item {getItemIndex(selectedOrder, item)} ({item.service?.name})
                    </button>
                    <button
                      onClick={() => setShowMeasurementsFor(showMeasurementsFor === item._id ? null : item._id)}
                      className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                      title="View Measurements"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {showMeasurementsFor !== null && (
                <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <h4 className="font-semibold mb-3 text-gray-800 flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Measurements Details
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {showMeasurementsFor === "main" ? (
                      selectedOrder.mainOrder.measurements.map((m, idx) => (
                        <div key={idx} className="bg-white p-3 rounded-lg border">
                          <p className="text-sm text-gray-600">{m.fieldName}</p>
                          <p className="font-semibold text-gray-800">{m.value}</p>
                        </div>
                      ))
                    ) : (
                      selectedOrder.items.find(i => i._id === showMeasurementsFor)?.measurements.map((m, idx) => (
                        <div key={idx} className="bg-white p-3 rounded-lg border">
                          <p className="text-sm text-gray-600">{m.fieldName}</p>
                          <p className="font-semibold text-gray-800">{m.value}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Role Assignment Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
    </div>
  );
};

export default AdminManagerTask;