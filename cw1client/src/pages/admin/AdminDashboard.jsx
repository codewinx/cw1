

import React, { useEffect, useState } from "react";
import { getOrders } from "../../api/order";
import { getCustomers } from "../../api/customer";
import { getAllTasks } from "../../api/task";
import { getOrderStats } from "../../api/admin";
import {
  ShoppingCart,
  Users,
  Clock,
  DollarSign,
  Plus,
  UserPlus,
  Package,
  Eye,
  X,
  TrendingUp,
  Activity,
} from "lucide-react";

import AdminAddCustomer from "./AdminAddCustomer";
import AdminAddOrder from "./AdminAddOrder";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    activeCustomers: 0,
    pendingTasks: 0,
    revenue: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [taskSummary, setTaskSummary] = useState({
    cutting: 0,
    tailoring: 0,
    handwork: 0,
    qualityCheck: 0,
  });

  const [workflow, setWorkflow] = useState({
    placed: 0,
    cutting: 0,
    tailoring: 0,
    handwork: 0,
    finishing: 0,
    qualityCheck: 0,
    completed: 0,
  });

  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [showAddOrder, setShowAddOrder] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [orders, customers, tasks, statsRes] = await Promise.all([
          getOrders(),
          getCustomers(),
          getAllTasks(),
          getOrderStats(),
        ]);

        setStats({
          totalOrders: orders.length,
          activeCustomers: customers.length,
          pendingTasks: tasks.filter((t) => t.status === "Pending").length,
          revenue: orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0),
        });

        setRecentOrders(orders.slice(0, 5));

        setTaskSummary({
          cutting: tasks.filter((t) => t.type === "Cutting").length,
          tailoring: tasks.filter((t) => t.type === "Tailoring").length,
          handwork: tasks.filter((t) => t.type === "Handwork").length,
          qualityCheck: tasks.filter((t) => t.type === "Quality Check").length,
        });

        setWorkflow({
          placed: statsRes.data.placed || 0,
          cutting: statsRes.data.cutting || 0,
          tailoring: statsRes.data.tailoring || 0,
          handwork: statsRes.data.handworking || 0,
          finishing: statsRes.data.finishing || 0,
          qualityCheck: statsRes.data["quality-check"] || 0,
          completed: statsRes.data.completed || 0,
        });
      } catch (err) {
        console.error("Error loading dashboard", err);
      }
    };

    fetchData();
  }, []);

  const StatCard = ({ title, value, icon: Icon, trend, bgColor, iconColor, textColor }) => (
    <div className="group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-pink-200/30 p-6 hover:shadow-xl hover:border-pink-300/50 transition-all duration-500 transform hover:scale-[1.02] overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50/40 via-white/20 to-purple-50/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Floating decoration */}
      <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-pink-200/20 to-purple-200/20 rounded-full blur-xl opacity-60"></div>
      
      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center mb-3">
              <div className={`${bgColor} p-3 rounded-xl shadow-md border border-white/50 mr-4`}>
                <Icon className={`w-6 h-6 ${iconColor}`} />
              </div>
              <p className="text-gray-600 text-sm font-medium uppercase tracking-wide">{title}</p>
            </div>
            <p className="text-3xl font-bold text-gray-800 mb-2 group-hover:text-gray-900 transition-colors">
              {value}
            </p>
            {trend && (
              <div className="flex items-center">
                <TrendingUp className={`w-4 h-4 mr-1 ${
                  trend.startsWith("+") ? "text-emerald-500" : "text-rose-500"
                }`} />
                <p className={`text-sm font-semibold ${
                    trend.startsWith("+") ? "text-emerald-600" : "text-rose-600"
                  }`}
                >
                  {trend}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const WorkflowStep = ({ step, count, stepNumber }) => {
    const stepColors = [
      "from-pink-400 to-rose-500 border-pink-300",
      "from-purple-400 to-pink-500 border-purple-300", 
      "from-indigo-400 to-purple-500 border-indigo-300",
      "from-blue-400 to-indigo-500 border-blue-300",
      "from-teal-400 to-cyan-500 border-teal-300",
      "from-emerald-400 to-teal-500 border-emerald-300",
      "from-green-500 to-emerald-600 border-green-400",
    ];

    return (
      <div className="flex flex-col items-center group">
        <div className={`bg-gradient-to-br ${stepColors[stepNumber - 1]} rounded-2xl w-16 h-16 flex items-center justify-center text-white font-bold text-lg mb-3 shadow-lg border-2 group-hover:scale-110 transition-all duration-300 relative overflow-hidden`}>
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <span className="relative z-10">{count || 0}</span>
        </div>
        <p className="text-sm font-semibold text-gray-700 text-center group-hover:text-gray-800 transition-colors">
          {step}
        </p>
        <div className="w-8 h-0.5 bg-gradient-to-r from-pink-300 to-purple-300 mt-2 opacity-60"></div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-pink-50 p-6 relative overflow-hidden">
      {/* Enhanced background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-br from-pink-200/30 to-purple-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-br from-purple-200/30 to-pink-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-gradient-to-br from-pink-300/20 to-rose-200/30 rounded-full blur-2xl"></div>
      </div>

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        
        {/* Modal for Add Customer */}
        {showAddCustomer && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6   relative shadow-2xl border border-pink-200/50">
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2 rounded-xl hover:bg-pink-50 transition-all duration-200 border border-transparent hover:border-pink-200"
                onClick={() => setShowAddCustomer(false)}
              >
                <X className="w-5 h-5" />
              </button>
              <AdminAddCustomer onClose={() => setShowAddCustomer(false)} />
            </div>
          </div>
        )}

        {/* Modal for Add Order */}
        {showAddOrder && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 w-full max-w-md relative shadow-2xl border border-pink-200/50">
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2 rounded-xl hover:bg-pink-50 transition-all duration-200 border border-transparent hover:border-pink-200"
                onClick={() => setShowAddOrder(false)}
              >
                <X className="w-5 h-5" />
              </button>
              <AdminAddOrder onClose={() => setShowAddOrder(false)} />
            </div>
          </div>
        )}

        {/* Enhanced Header */}
        <div className="mb-10 text-center">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-pink-700 bg-clip-text text-transparent mb-4 drop-shadow-sm">
            Dashboard
          </h1>
          <p className="text-gray-600 text-xl font-medium">Overview of your boutique operations</p>
          <div className="w-24 h-1 bg-gradient-to-r from-pink-400 to-purple-400 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Orders"
            value={stats.totalOrders}
            icon={ShoppingCart}
            trend="+12% from last month"
            bgColor="bg-gradient-to-br from-pink-100 to-rose-200"
            iconColor="text-pink-700"
          />
          <StatCard
            title="Active Customers"
            value={stats.activeCustomers}
            icon={Users}
            trend="+5% from last month"
            bgColor="bg-gradient-to-br from-purple-100 to-indigo-200"
            iconColor="text-purple-700"
          />
          <StatCard
            title="Pending Tasks"
            value={stats.pendingTasks}
            icon={Clock}
            trend="-3% from last week"
            bgColor="bg-gradient-to-br from-amber-100 to-orange-200"
            iconColor="text-orange-700"
          />
          <StatCard
            title="Monthly Revenue"
            value={`₹${stats.revenue.toLocaleString()}`}
            icon={DollarSign}
            trend="+18% from last month"
            bgColor="bg-gradient-to-br from-emerald-100 to-teal-200"
            iconColor="text-emerald-700"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Enhanced Recent Orders */}
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-pink-200/30 p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-50/30 via-white/20 to-purple-50/30"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center">
                  <div className="bg-gradient-to-br from-pink-100 to-purple-100 p-3 rounded-xl mr-4 border border-pink-200/50">
                    <Activity className="w-6 h-6 text-pink-700" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Recent Orders</h2>
                </div>
                <button className="flex items-center text-pink-700 hover:text-pink-800 text-sm font-semibold bg-gradient-to-r from-pink-50 to-purple-50 hover:from-pink-100 hover:to-purple-100 px-4 py-2 rounded-xl transition-all duration-300 border border-pink-200/50 hover:border-pink-300/70 shadow-sm hover:shadow-md">
                  <Eye className="w-4 h-4 mr-2" />
                  View All
                </button>
              </div>
              
              {recentOrders.length === 0 ? (
                <div className="text-center py-16">
                  <div className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-2xl w-24 h-24 mx-auto mb-6 flex items-center justify-center border border-pink-200/50 shadow-lg">
                    <ShoppingCart className="w-10 h-10 text-pink-600" />
                  </div>
                  <p className="text-gray-700 font-semibold text-xl mb-2">No recent orders</p>
                  <p className="text-gray-500 text-base">Orders will appear here once created</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-pink-200/50">
                        <th className="text-left text-sm font-bold text-gray-700 pb-4 uppercase tracking-wider">Order No</th>
                        <th className="text-left text-sm font-bold text-gray-700 pb-4 uppercase tracking-wider">Customer</th>
                        <th className="text-left text-sm font-bold text-gray-700 pb-4 uppercase tracking-wider">Status</th>
                        <th className="text-left text-sm font-bold text-gray-700 pb-4 uppercase tracking-wider">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order, index) => (
                        <tr key={order._id} className="border-b border-pink-100/50 hover:bg-gradient-to-r hover:from-pink-50/30 hover:to-purple-50/30 transition-all duration-300 group">
                          <td className="py-4 text-sm font-semibold text-gray-800 group-hover:text-gray-900">{order.orderNo}</td>
                          <td className="py-4 text-sm text-gray-600 font-medium group-hover:text-gray-700">{order.customer?.name}</td>
                          <td className="py-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-pink-100 to-purple-100 text-pink-800 border border-pink-200/50 shadow-sm">
                              {order.status}
                            </span>
                          </td>
                          <td className="py-4 text-sm font-bold text-gray-800 group-hover:text-gray-900">₹{order.totalAmount?.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Quick Actions */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-pink-200/30 p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-50/30 via-white/20 to-purple-50/30"></div>
            <div className="relative z-10">
              <div className="flex items-center mb-8">
                <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-3 rounded-xl mr-4 border border-purple-200/50">
                  <Plus className="w-6 h-6 text-purple-700" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Quick Actions</h2>
              </div>
              <div className="space-y-4">
                <button
                  onClick={() => setShowAddOrder(true)}
                  className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-xl font-bold text-base transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border border-pink-400/50 group"
                >
                  <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                  New Order
                </button>
                <button
                  onClick={() => setShowAddCustomer(true)}
                  className="w-full flex items-center justify-center px-6 py-4 bg-white/90 hover:bg-white text-gray-700 hover:text-gray-800 rounded-xl font-bold text-base transition-all duration-300 border-2 border-pink-300/50 hover:border-pink-400 shadow-md hover:shadow-lg transform hover:scale-105 group"
                >
                  <UserPlus className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  Add Customer
                </button>
                <button className="w-full flex items-center justify-center px-6 py-4 bg-white/90 hover:bg-white text-gray-700 hover:text-gray-800 rounded-xl font-bold text-base transition-all duration-300 border-2 border-purple-300/50 hover:border-purple-400 shadow-md hover:shadow-lg transform hover:scale-105 group">
                  <Package className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  Update Inventory
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Order Workflow */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-pink-200/30 p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-50/30 via-white/20 to-purple-50/30"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-center mb-10">
              <div className="bg-gradient-to-br from-pink-100 to-purple-100 p-3 rounded-xl mr-4 border border-pink-200/50">
                <Activity className="w-6 h-6 text-pink-700" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Order Workflow Status</h2>
            </div>
            
            {/* Top row */}
            <div className="grid grid-cols-4 gap-6 mb-12">
              <WorkflowStep step="Placed" count={workflow.placed} stepNumber={1} />
              <WorkflowStep step="Cutting" count={workflow.cutting} stepNumber={2} />
              <WorkflowStep step="Tailoring" count={workflow.tailoring} stepNumber={3} />
              <WorkflowStep step="Handwork" count={workflow.handwork} stepNumber={4} />
            </div>
            
            {/* Bottom row */}
            <div className="grid grid-cols-3 gap-8 max-w-4xl mx-auto">
              <WorkflowStep step="Finishing" count={workflow.finishing} stepNumber={5} />
              <WorkflowStep step="Quality Check" count={workflow.qualityCheck} stepNumber={6} />
              <WorkflowStep step="Completed" count={workflow.completed} stepNumber={7} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;