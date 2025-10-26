import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// Ensure these imports are correct based on the file you provided
import { getOrders, getAllTasks, fetchCustomers } from "../../api/admin+manager.js";
import {
  ShoppingCart,
  Users,
  DollarSign,
  Plus,
  Package,
  Eye,
  X,
  Activity,
  ClipboardList,
  Clock, // Added for pending tasks
} from "lucide-react";
import AdminManagerAddOrder from "./AdminManagerAddOrder.jsx";

// --- Brand Color Configuration ---
// Define a single primary color for consistency (e.g., a professional blue or deep purple)
const PRIMARY_COLOR = "purple-600";
const ACCENT_COLOR = "purple-100";
const HOVER_COLOR = "purple-700";
const BORDER_COLOR = "purple-200";

// Simplified Workflow Card Component
const WorkflowCard = ({ title, value, color }) => (
  <div className="flex flex-col items-center p-3 flex-1 min-w-[80px] border border-gray-100 rounded-lg bg-white shadow-sm">
    <div
      className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold bg-${color} shadow-md mb-2`}
    >
      <span className="text-lg">{value}</span>
    </div>
    <p className="text-xs text-gray-600 font-medium text-center">{title}</p>
  </div>
);


const AdminManagerDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    activeCustomers: 0,
    pendingTasks: 0,
    revenue: 0,
  });

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddOrder, setShowAddOrder] = useState(false);
  const [workflow, setWorkflow] = useState({
    placed: 0,
    cutting: 0,
    handworking: 0,
    tailoring: 0,
    qualityCheck: 0,
    readyToDeliver: 0,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      let ordersRes = [];
      let customers = [];
      let tasks = { data: [] };

      // 1. Fetch Orders (Most critical data)
      try {
        ordersRes = await getOrders();
      } catch (err) {
        console.error("Error fetching orders:", err);
        // ordersRes remains [] on failure
      }

      // 2. Fetch Customers
      try {
        customers = await fetchCustomers();
      } catch (err) {
        console.error("Error fetching customers:", err);
        // customers remains [] on failure
      }

      // 3. Fetch Tasks
      try {
        tasks = await getAllTasks();
      } catch (err) {
        console.error("Error fetching tasks:", err);
        // tasks remains { data: [] } on failure
      }

      // --- Post-Fetch Calculations ---

      // Orders and Workflow
      setOrders(ordersRes);
      const newWorkflow = { placed: 0, cutting: 0, handworking: 0, tailoring: 0, qualityCheck: 0, readyToDeliver: 0 };
      ordersRes.forEach((order) => {
        const status = order.status?.toLowerCase() || "";
        if (status.includes("placed")) newWorkflow.placed++;
        else if (status.includes("cutting") || status.includes("cutter")) newWorkflow.cutting++;
        else if (status.includes("handwork")) newWorkflow.handworking++;
        else if (status.includes("tailor")) newWorkflow.tailoring++;
        else if (status.includes("quality")) newWorkflow.qualityCheck++;
        else if (status.includes("ready")) newWorkflow.readyToDeliver++;
      });
      setWorkflow(newWorkflow);

      // Tasks
      const tasksArray = tasks.data || tasks;
      const pendingCount = Array.isArray(tasksArray)
        ? tasksArray.filter(
            (task) => task.status === "pending" || task.status === "Pending"
          ).length
        : 0;
      
      // Revenue (Assuming 'completed' status and 'totalAmount' field are correct)
      const revenue = ordersRes
        .filter((order) => (order.status?.toLowerCase() === "completed" || order.status?.toLowerCase() === "delivered"))
        .reduce((sum, o) => sum + (o.payment?.totalAmount || 0), 0);
        
      // Update Stats
      setStats({
        totalOrders: ordersRes.length,
        activeCustomers: Array.isArray(customers) ? customers.length : 0,
        pendingTasks: pendingCount,
        revenue: revenue,
      });

      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-screen bg-gray-50 p-6 flex items-center justify-center overflow-hidden">
        <p className="text-gray-600 text-lg">Loading dashboard...</p>
      </div>
    );
  }

  // Helper for Status Badge styling
  const getStatusStyle = (status) => {
    const lowerStatus = status?.toLowerCase() || "";
    if (lowerStatus.includes("ready") || lowerStatus.includes("completed")) return "bg-green-100 text-green-800";
    if (lowerStatus.includes("quality") || lowerStatus.includes("placed")) return "bg-yellow-100 text-yellow-800";
    return `bg-${ACCENT_COLOR} text-${PRIMARY_COLOR}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        {/* Modal for Add Order */}
        {showAddOrder && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-lg relative shadow-2xl border border-gray-200">
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2 rounded-lg transition-all"
                onClick={() => setShowAddOrder(false)}
              >
                <X className="w-5 h-5" />
              </button>
              <AdminManagerAddOrder onClose={() => setShowAddOrder(false)} />
            </div>
          </div>
        )}

        {/* --- Header --- */}
        <div className="py-2 border-b border-gray-200">
          <h1 className={`text-4xl font-extrabold text-${PRIMARY_COLOR}`}>
            Admin Dashboard
          </h1>
          <p className="text-gray-500 mt-1">Overview of your operations</p>
        </div>

        {/* --- Stats Cards (Standard & Professional) --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Total Orders */}
          <div
            onClick={() => navigate("/admin/orders")}
            className="bg-white shadow-lg rounded-xl p-5 border border-gray-100 cursor-pointer hover:shadow-xl transition-shadow duration-200"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Total Orders</p>
                <h2 className={`text-3xl font-bold text-${PRIMARY_COLOR}`}>
                  {stats.totalOrders}
                </h2>
              </div>
              <div className={`bg-${PRIMARY_COLOR} p-3 rounded-md shadow-md`}>
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
          
          {/* Active Customers */}
          <div
            onClick={() => navigate("/admin/customers")}
            className="bg-white shadow-lg rounded-xl p-5 border border-gray-100 cursor-pointer hover:shadow-xl transition-shadow duration-200"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Total Customers</p>
                <h2 className="text-3xl font-bold text-blue-600">
                  {stats.activeCustomers}
                </h2>
              </div>
              <div className="bg-blue-600 p-3 rounded-md shadow-md">
                <Users className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
          
          {/* Pending Tasks */}
          <div
            onClick={() => navigate("/admin/tasks")} // Assuming a tasks route exists
            className="bg-white shadow-lg rounded-xl p-5 border border-gray-100 cursor-pointer hover:shadow-xl transition-shadow duration-200"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Pending Tasks</p>
                <h2 className="text-3xl font-bold text-red-600">
                  {stats.pendingTasks}
                </h2>
              </div>
              <div className="bg-red-600 p-3 rounded-md shadow-md">
                <Clock className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>

          {/* Total Revenue */}
          <div
            onClick={() => navigate("/admin/payments")}
            className="bg-white shadow-lg rounded-xl p-5 border border-gray-100 cursor-pointer hover:shadow-xl transition-shadow duration-200"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Total Revenue</p>
                <h2 className="text-3xl font-bold text-green-600">
                  $
                  {stats.revenue.toLocaleString(undefined, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                </h2>
              </div>
              <div className="bg-green-600 p-3 rounded-md shadow-md">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* --- Orders & Quick Actions Section --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders Table */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg border border-gray-100 p-4 flex flex-col">
            <div className="flex justify-between items-center mb-4 border-b pb-3">
              <div className="flex items-center">
                <Activity className={`w-5 h-5 text-${PRIMARY_COLOR} mr-2`} />
                <h2 className="text-lg font-bold text-gray-800">Recent Orders</h2>
              </div>
              <button
                onClick={() => navigate("/admin/orders")}
                className={`flex items-center text-${PRIMARY_COLOR} hover:text-${HOVER_COLOR} text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors duration-200 border border-${BORDER_COLOR} hover:bg-${ACCENT_COLOR}/50`}
              >
                <Eye className="w-3.5 h-3.5 mr-1" />
                View All
              </button>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-10 flex-1 flex flex-col items-center justify-center">
                <ShoppingCart className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-gray-700 font-semibold text-sm mb-1">No recent orders</p>
                <p className="text-gray-500 text-xs">Create a new order to get started.</p>
              </div>
            ) : (
              <div className="flex-1 overflow-auto max-h-[350px]">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="border-b text-left text-gray-600">
                      <th className="py-2 text-xs font-semibold">Order No</th>
                      <th className="py-2 text-xs font-semibold">Customer</th>
                      <th className="py-2 text-xs font-semibold">Expected Date</th>
                      <th className="py-2 text-xs font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 8).map((order) => ( // Show only top 8 for "Recent"
                      <tr
                        key={order._id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => navigate(`/admin/orders/${order._id}`)} // Add navigation for detail view
                      >
                        <td className="py-3 text-sm font-medium text-gray-800">
                          {order.orderId || order._id.slice(-6).toUpperCase()} 
                        </td>
                        <td className="py-3 text-sm text-gray-600">
                          {order.customer?.name || "N/A"}
                        </td>
                        <td className="py-3 text-xs text-gray-500">
                            {order.expectedDate ? new Date(order.expectedDate).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusStyle(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4">
            <div className="mb-4 border-b pb-3">
              <div className="flex items-center">
                <Plus className={`w-5 h-5 text-${PRIMARY_COLOR} mr-2`} />
                <h2 className="text-lg font-bold text-gray-800">Quick Actions</h2>
              </div>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => setShowAddOrder(true)}
                className={`w-full flex items-center justify-center px-4 py-3 bg-${PRIMARY_COLOR} hover:bg-${HOVER_COLOR} text-white rounded-lg font-semibold text-sm transition-colors duration-300 shadow-md`}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create New Order
              </button>
              <button
                onClick={() => navigate("/admin/customers/new")} // Assuming customer creation route
                className={`w-full flex items-center justify-center px-4 py-3 bg-white hover:bg-gray-50 text-gray-700 rounded-lg font-semibold text-sm transition-colors duration-300 border border-${BORDER_COLOR}`}
              >
                <Users className="w-4 h-4 mr-2 text-blue-500" />
                Add New Customer
              </button>
              <button
                onClick={() => navigate("/admin/inventory")} // Assuming inventory route
                className={`w-full flex items-center justify-center px-4 py-3 bg-white hover:bg-gray-50 text-gray-700 rounded-lg font-semibold text-sm transition-colors duration-300 border border-${BORDER_COLOR}`}
              >
                <Package className="w-4 h-4 mr-2 text-green-500" />
                Manage Inventory
              </button>
            </div>
          </div>
        </div>

        {/* --- Workflow Stats --- */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4">
          <div className="flex items-center mb-4 border-b pb-3">
            <ClipboardList className={`w-5 h-5 text-${PRIMARY_COLOR} mr-2`} />
            <h2 className="text-lg font-bold text-gray-800">Order Processing Pipeline</h2>
          </div>
          <div className="flex justify-between items-start gap-3 flex-wrap">
            <WorkflowCard title="Placed" value={workflow.placed} color="purple-500" />
            <WorkflowCard title="Cutting" value={workflow.cutting} color="yellow-500" />
            <WorkflowCard title="Handwork" value={workflow.handworking} color="pink-500" />
            <WorkflowCard title="Tailoring" value={workflow.tailoring} color="blue-500" />
            <WorkflowCard title="Quality Check" value={workflow.qualityCheck} color="orange-500" />
            <WorkflowCard title="Ready" value={workflow.readyToDeliver} color="green-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminManagerDashboard;