import React, { useEffect, useState } from "react";
import { getOrders } from "../../api/order";
import { getCustomers } from "../../api/customer";
import { getAllTasks } from "../../api/task";
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
} from "lucide-react";

import AdminAddCustomer from "./AdminAddCustomer"; // ✅ Import popup form
import AdminAddOrder from "./AdminAddOrder"; // ✅ Import popup form

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

  // ✅ Modal state
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [showAddOrder, setShowAddOrder] = useState(false);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [orders, customers, tasks] = await Promise.all([
          getOrders(),
          getCustomers(),
          getAllTasks(),
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
          placed: orders.filter((o) => o.status === "Placed").length,
          cutting: orders.filter((o) => o.status === "Cutting").length,
          tailoring: orders.filter((o) => o.status === "Tailoring").length,
          handwork: orders.filter((o) => o.status === "Handwork").length,
          finishing: orders.filter((o) => o.status === "Finishing").length,
          qualityCheck: orders.filter((o) => o.status === "Quality Check").length,
          completed: orders.filter((o) => o.status === "Completed").length,
        });
      } catch (err) {
        console.error("Error loading dashboard", err);
      }
    };

    fetchData();
  }, []);

  const StatCard = ({ title, value, icon: Icon, trend, bgColor, iconColor }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {trend && (
            <p
              className={`text-sm mt-2 ${
                trend.startsWith("+") ? "text-green-600" : "text-red-500"
              }`}
            >
              {trend}
            </p>
          )}
        </div>
        <div className={`${bgColor} p-3 rounded-lg`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
      </div>
    </div>
  );

  const WorkflowStep = ({ step, count, stepNumber }) => {
    const colors = [
      "bg-pink-500",
      "bg-yellow-500",
      "bg-blue-500",
      "bg-purple-500",
      "bg-orange-500",
      "bg-indigo-500",
      "bg-green-500",
    ];

    return (
      <div className="flex flex-col items-center">
        <div
          className={`${colors[stepNumber - 1]} rounded-full w-12 h-12 flex items-center justify-center text-white font-bold text-lg mb-2`}
        >
          {stepNumber}
        </div>
        <p className="text-sm font-medium text-gray-700 mb-1">{step}</p>
        <p className="text-xs text-gray-500">{count} orders</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* ✅ Popup Modal for Add Customer */}
        {showAddCustomer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-lg relative shadow-lg">
              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                onClick={() => setShowAddCustomer(false)}
              >
                <X className="w-6 h-6" />
              </button>
              <AdminAddCustomer onClose={() => setShowAddCustomer(false)} />
            </div>
          </div>
        )}

        {/* ✅ Popup Modal for Add Order */}
        {showAddOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-lg relative shadow-lg">
              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                onClick={() => setShowAddOrder(false)}
              >
                <X className="w-6 h-6" />
              </button>
              <AdminAddOrder onClose={() => setShowAddOrder(false)} />
            </div>
          </div>
        )}

        {/* ✅ Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Orders"
            value={stats.totalOrders}
            icon={ShoppingCart}
            trend="+12% from last month"
            bgColor="bg-pink-100"
            iconColor="text-pink-600"
          />
          <StatCard
            title="Active Customers"
            value={stats.activeCustomers}
            icon={Users}
            trend="+5% from last month"
            bgColor="bg-blue-100"
            iconColor="text-blue-600"
          />
          <StatCard
            title="Pending Tasks"
            value={stats.pendingTasks}
            icon={Clock}
            trend="-3% from last week"
            bgColor="bg-yellow-100"
            iconColor="text-yellow-600"
          />
          <StatCard
            title="Monthly Revenue"
            value={`₹${stats.revenue}`}
            icon={DollarSign}
            trend="+18% from last month"
            bgColor="bg-green-100"
            iconColor="text-green-600"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Orders
              </h2>
              <button className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium">
                <Eye className="w-4 h-4 mr-1" />
                View All
              </button>
            </div>
            {recentOrders.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No recent orders found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left text-sm font-medium text-gray-600 pb-3">
                        Order No
                      </th>
                      <th className="text-left text-sm font-medium text-gray-600 pb-3">
                        Customer
                      </th>
                      <th className="text-left text-sm font-medium text-gray-600 pb-3">
                        Status
                      </th>
                      <th className="text-left text-sm font-medium text-gray-600 pb-3">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order._id} className="border-b border-gray-100">
                        <td className="py-4 text-sm text-gray-900">
                          {order.orderNo}
                        </td>
                        <td className="py-4 text-sm text-gray-900">
                          {order.customer?.name}
                        </td>
                        <td className="py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {order.status}
                          </span>
                        </td>
                        <td className="py-4 text-sm font-medium text-gray-900">
                          ₹{order.totalAmount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <button
                onClick={() => setShowAddOrder(true)}
                className="w-full flex items-center justify-center px-4 py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-lg font-medium transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                New Order
              </button>
              <button
                onClick={() => setShowAddCustomer(true)}
                className="w-full flex items-center justify-center px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Add Customer
              </button>
              <button className="w-full flex items-center justify-center px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors">
                <Package className="w-5 h-5 mr-2" />
                Update Inventory
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Task Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Task Summary
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Cutting Tasks</span>
                <span className="font-semibold text-gray-900">
                  {taskSummary.cutting}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Tailoring Tasks</span>
                <span className="font-semibold text-gray-900">
                  {taskSummary.tailoring}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Handwork Tasks</span>
                <span className="font-semibold text-gray-900">
                  {taskSummary.handwork}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Quality Check</span>
                <span className="font-semibold text-gray-900">
                  {taskSummary.qualityCheck}
                </span>
              </div>
            </div>
          </div>

          {/* Order Workflow Overview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Order Workflow Overview
            </h2>
            <div className="grid grid-cols-4 gap-4 mb-6">
              <WorkflowStep
                step="Order Placed"
                count={workflow.placed}
                stepNumber={1}
              />
              <WorkflowStep
                step="Cutting"
                count={workflow.cutting}
                stepNumber={2}
              />
              <WorkflowStep
                step="Tailoring"
                count={workflow.tailoring}
                stepNumber={3}
              />
              <WorkflowStep
                step="Handwork"
                count={workflow.handwork}
                stepNumber={4}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <WorkflowStep
                step="Finishing"
                count={workflow.finishing}
                stepNumber={5}
              />
              <WorkflowStep
                step="Quality Check"
                count={workflow.qualityCheck}
                stepNumber={6}
              />
              <WorkflowStep
                step="Completed"
                count={workflow.completed}
                stepNumber={7}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
