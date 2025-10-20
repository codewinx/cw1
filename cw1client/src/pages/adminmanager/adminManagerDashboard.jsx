import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getOrders,getAllTasks,fetchCustomers  } from "../../api/admin+manager.js";
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
} from "lucide-react";
import AdminManagerAddOrder from "./AdminManagerAddOrder.jsx";

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
      try {
        const [ordersRes, customers, tasks] = await Promise.all([
          getOrders(),
          fetchCustomers(),
          getAllTasks(),
        ]);

        setOrders(ordersRes);

        // Calculate workflow counts based on order status
        const newWorkflow = {
          placed: 0,
          cutting: 0,
          handworking: 0,
          tailoring: 0,
          qualityCheck: 0,
          readyToDeliver: 0,
        };

        ordersRes.forEach((order) => {
          const status = order.status?.toLowerCase() || "";
          if (status.includes("placed")) newWorkflow.placed++;
          else if (status.includes("cutting") || status.includes("cutter"))
            newWorkflow.cutting++;
          else if (status.includes("handwork")) newWorkflow.handworking++;
          else if (status.includes("tailor")) newWorkflow.tailoring++;
          else if (status.includes("quality")) newWorkflow.qualityCheck++;
          else if (status.includes("ready")) newWorkflow.readyToDeliver++;
        });

        setWorkflow(newWorkflow);

        const tasksArray = tasks.data || tasks;
        const pendingCount = Array.isArray(tasksArray)
          ? tasksArray.filter(
              (task) => task.status === "pending" || task.status === "Pending"
            ).length
          : 0;

        const revenue = ordersRes
          .filter((order) => order.status === "completed")
          .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

        setStats({
          totalOrders: ordersRes.length,
          activeCustomers: Array.isArray(customers) ? customers.length : 0,
          pendingTasks: pendingCount,
          revenue: revenue,
        });
      } catch (err) {
        console.error("Error fetching stats", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-screen bg-pink-50 p-4 flex items-center justify-center overflow-hidden">
        <p className="text-gray-600 text-lg">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-pink-50 p-4 overflow-hidden">
      <div className="max-w-7xl mx-auto h-full flex flex-col gap-4 overflow-hidden">
        {showAddOrder && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-white/95 rounded-2xl p-6 w-full max-w-md relative shadow-2xl border border-pink-200/50">
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2 rounded-xl hover:bg-pink-50 transition-all"
                onClick={() => setShowAddOrder(false)}
              >
                <X className="w-5 h-5" />
              </button>
              <AdminManagerAddOrder onClose={() => setShowAddOrder(false)} />
            </div>
          </div>
        )}

        <div className="text-center py-3">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-pink-700 bg-clip-text text-transparent mb-2">
            Dashboard
          </h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            onClick={() => navigate("/admin/orders")}
            className="bg-gradient-to-br from-white to-pink-50/30 shadow-lg rounded-2xl p-6 border-2 border-pink-200/40 cursor-pointer hover:shadow-2xl hover:border-pink-300/60 hover:scale-105 transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-2">Total Orders</p>
                <h2 className="text-5xl font-bold bg-gradient-to-r from-pink-600 to-pink-700 bg-clip-text text-transparent">
                  {stats.totalOrders}
                </h2>
              </div>
              <div className="bg-gradient-to-br from-pink-500 to-pink-600 p-3 rounded-xl shadow-md">
                <ShoppingCart className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          <div
            onClick={() => navigate("/admin/customers")}
            className="bg-gradient-to-br from-white to-blue-50/30 shadow-lg rounded-2xl p-6 border-2 border-blue-200/40 cursor-pointer hover:shadow-2xl hover:border-blue-300/60 hover:scale-105 transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-2">Total Customers</p>
                <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                  {stats.activeCustomers}
                </h2>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl shadow-md">
                <Users className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          <div
            onClick={() => navigate("/admin/payments")}
            className="bg-gradient-to-br from-white to-green-50/30 shadow-lg rounded-2xl p-6 border-2 border-green-200/40 cursor-pointer hover:shadow-2xl hover:border-green-300/60 hover:scale-105 transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-2">Total Revenue</p>
                <h2 className="text-5xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                  $
                  {stats.revenue.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </h2>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-xl shadow-md">
                <DollarSign className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Orders + Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 max-h-65 overflow-hidden">
          <div className="lg:col-span-2 bg-white/80 rounded-xl shadow-md border border-pink-200/30 p-3 flex flex-col overflow-hidden">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center">
                <div className="bg-gradient-to-br from-pink-100 to-purple-100 p-1.5 rounded-lg mr-2 border border-pink-200/50">
                  <Activity className="w-4 h-4 text-pink-700" />
                </div>
                <h2 className="text-sm font-bold text-gray-800">All Orders</h2>
              </div>
              <button
                onClick={() => navigate("/admin/orders")}
                className="flex items-center text-pink-700 hover:text-pink-800 text-xs font-semibold bg-gradient-to-r from-pink-50 to-purple-50 hover:from-pink-100 hover:to-purple-100 px-2 py-1 rounded-lg transition-all duration-300 border border-pink-200/50 hover:border-pink-300/70 shadow-sm"
              >
                <Eye className="w-3 h-3 mr-1" />
                View All
              </button>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-4 flex-1 flex flex-col items-center justify-center">
                <div className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg w-12 h-12 mx-auto mb-2 flex items-center justify-center border border-pink-200/50 shadow-md">
                  <ShoppingCart className="w-6 h-6 text-pink-600" />
                </div>
                <p className="text-gray-700 font-semibold text-sm mb-1">
                  No orders
                </p>
                <p className="text-gray-500 text-xs">
                  Orders will appear here once created
                </p>
              </div>
            ) : (
              <div className="flex-1 -mx-3 px-3 overflow-hidden">
                <table className="w-full">
                  <thead className="sticky top-0 bg-white/95 z-10">
                    <tr className="border-b border-pink-200/50">
                      <th className="text-left text-xs font-bold text-gray-700 pb-2">
                        Order No
                      </th>
                      <th className="text-left text-xs font-bold text-gray-700 pb-2">
                        Customer
                      </th>
                      <th className="text-left text-xs font-bold text-gray-700 pb-2">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order, index) => (
                      <tr
                        key={order._id}
                        className="border-b border-pink-100/50 hover:bg-pink-50/30 transition-all"
                      >
                        <td className="py-2 text-xs font-semibold text-gray-800">
                          {String(index + 1).padStart(3, "0")}
                        </td>
                        <td className="py-2 text-xs text-gray-600 font-medium">
                          {order.customer?.name}
                        </td>
                        <td className="py-2">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r from-pink-100 to-purple-100 text-pink-800 border border-pink-200/50 shadow-sm">
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

          <div className="relative bg-gradient-to-br from-purple-50 via-pink-50 to-white rounded-xl shadow-lg border border-purple-200/40 p-4 flex flex-col overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-pink-200/30 to-purple-200/30 rounded-full blur-2xl -mr-12 -mt-12"></div>
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-purple-200/20 to-pink-200/20 rounded-full blur-xl -ml-10 -mb-10"></div>
            <div className="relative z-10">
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-2 rounded-xl mr-2 shadow-md">
                  <Plus className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-sm font-bold bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent">
                  Quick Actions
                </h2>
              </div>
              <div className="space-y-2.5">
                <button
                  onClick={() => setShowAddOrder(true)}
                  className="relative w-full flex items-center justify-center px-3 py-2.5 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-600 hover:from-pink-600 hover:via-purple-600 hover:to-pink-700 text-white rounded-xl font-bold text-xs transition-all duration-500 shadow-lg hover:shadow-xl transform hover:scale-[1.03]"
                >
                  <Plus className="w-3.5 h-3.5 mr-1.5" />
                  New Order
                </button>
                <button className="relative w-full flex items-center justify-center px-3 py-2.5 bg-gradient-to-r from-white to-purple-50/50 hover:from-purple-50 hover:to-pink-50 text-gray-700 hover:text-purple-700 rounded-xl font-bold text-xs transition-all duration-500 border-2 border-purple-300/60 hover:border-purple-400 shadow-md hover:shadow-lg transform hover:scale-[1.03]">
                  <Package className="w-3.5 h-3.5 mr-1.5" />
                  Update Inventory
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Workflow Stats */}
        <div className="bg-white/80 rounded-xl shadow-md border border-pink-200/40 p-4">
          <h2 className="text-base font-bold text-gray-800 mb-4">
            Order Workflow Overview
          </h2>
          <div className="flex justify-between items-end gap-2">
            <WorkflowCard title="Placed" value={workflow.placed} color="bg-pink-500" />
            <WorkflowCard title="Cutting" value={workflow.cutting} color="bg-yellow-500" />
            <WorkflowCard title="Tailoring" value={workflow.tailoring} color="bg-blue-500" />
            <WorkflowCard title="Handworking" value={workflow.handworking} color="bg-purple-500" />
            <WorkflowCard title="Quality Check" value={workflow.qualityCheck} color="bg-orange-500" />
            <WorkflowCard title="Ready to Deliver" value={workflow.readyToDeliver} color="bg-green-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

const WorkflowCard = ({ title, value, color }) => (
  <div className="flex flex-col items-center">
    <div
      className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${color} shadow-md mb-2`}
    >
      {value}
    </div>
    <p className="text-xs text-gray-800 font-semibold mb-1 text-center">{title}</p>
  </div>
);

export default AdminManagerDashboard;