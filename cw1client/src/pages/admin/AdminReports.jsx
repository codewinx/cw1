import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, Package, DollarSign, ShoppingBag, AlertCircle, Download, Calendar, Filter, Briefcase, Award } from 'lucide-react';

const API_URL = 'http://localhost:5000/api/reports'; // Change to your backend URL

const AdminReports = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
  const [loading, setLoading] = useState(false);

  // State for different reports
  const [dashboardData, setDashboardData] = useState(null);
  const [salesData, setSalesData] = useState(null);
  const [customerData, setCustomerData] = useState(null);
  const [inventoryData, setInventoryData] = useState(null);
  const [staffData, setStaffData] = useState(null);
  const [profitData, setProfitData] = useState(null);
  const [orderData, setOrderData] = useState(null);

  const COLORS = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444'];

  // Fetch data based on active tab
  useEffect(() => {
    fetchData();
  }, [activeTab, dateRange]);

  const fetchData = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (dateRange.startDate) params.append('startDate', dateRange.startDate);
    if (dateRange.endDate) params.append('endDate', dateRange.endDate);

    try {
      let response, json;
      
      switch (activeTab) {
        case 'dashboard':
          response = await fetch(`${API_URL}/dashboard-summary?${params}`);
          json = await response.json();
          if (!response.ok) throw new Error(json.message || 'Failed to fetch dashboard data');
          setDashboardData(json.data);
          break;
        case 'sales':
          response = await fetch(`${API_URL}/sales-overview?${params}`);
          json = await response.json();
          if (!response.ok) throw new Error(json.message || 'Failed to fetch sales data');
          setSalesData(json.data);
          break;
        case 'customers':
          response = await fetch(`${API_URL}/customer-insights?${params}`);
          json = await response.json();
          if (!response.ok) throw new Error(json.message || 'Failed to fetch customer data');
          setCustomerData(json.data);
          break;
        case 'inventory':
          response = await fetch(`${API_URL}/inventory-report?${params}`);
          json = await response.json();
          if (!response.ok) throw new Error(json.message || 'Failed to fetch inventory data');
          setInventoryData(json.data);
          break;
        case 'staff':
          response = await fetch(`${API_URL}/staff-performance?${params}`);
          json = await response.json();
          if (!response.ok) throw new Error(json.message || 'Failed to fetch staff data');
          setStaffData(json.data);
          break;
        case 'profit':
          response = await fetch(`${API_URL}/profit-summary?${params}`);
          json = await response.json();
          if (!response.ok) throw new Error(json.message || 'Failed to fetch profit data');
          setProfitData(json.data);
          break;
        case 'orders':
          response = await fetch(`${API_URL}/order-status?${params}`);
          json = await response.json();
          if (!response.ok) throw new Error(json.message || 'Failed to fetch order data');
          setOrderData(json.data);
          break;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      alert(`Error: ${error.message}\n\nPlease check:\n1. Backend server is running\n2. MongoDB is connected\n3. Check browser console for details`);
    }
    setLoading(false);
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  // Dashboard View
  const renderDashboard = () => {
    if (!dashboardData) return <div className="text-center py-8">Loading...</div>;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={DollarSign}
            title="Today's Revenue"
            value={formatCurrency(dashboardData.today.revenue)}
            subtitle={`${dashboardData.today.orders} orders`}
            color="bg-green-500"
          />
          <StatCard
            icon={TrendingUp}
            title="Monthly Revenue"
            value={formatCurrency(dashboardData.monthly.revenue)}
            subtitle={`${dashboardData.monthly.orders} orders`}
            color="bg-blue-500"
          />
          <StatCard
            icon={ShoppingBag}
            title="Pending Orders"
            value={dashboardData.pendingOrders}
            subtitle="Need attention"
            color="bg-orange-500"
          />
          <StatCard
            icon={Users}
            title="Total Customers"
            value={dashboardData.totalCustomers}
            subtitle={`${dashboardData.activeStaff} active staff`}
            color="bg-purple-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold mb-4">Yearly Overview</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Total Orders</span>
                <span className="font-semibold text-xl">{dashboardData.yearly.orders}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Total Revenue</span>
                <span className="font-semibold text-xl text-green-600">{formatCurrency(dashboardData.yearly.revenue)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-gray-600">Active Staff</span>
                <span className="font-semibold text-xl text-blue-600">{dashboardData.activeStaff}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <span className="text-gray-600">Total Customers</span>
                <span className="font-semibold text-xl text-purple-600">{dashboardData.totalCustomers}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Sales Overview
  const renderSales = () => {
    if (!salesData) return <div className="text-center py-8">Loading...</div>;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            icon={DollarSign}
            title="Total Sales"
            value={formatCurrency(salesData.totalSales)}
            color="bg-green-500"
          />
          <StatCard
            icon={ShoppingBag}
            title="Total Orders"
            value={salesData.totalOrders}
            color="bg-blue-500"
          />
          <StatCard
            icon={TrendingUp}
            title="Avg Order Value"
            value={formatCurrency(salesData.avgOrderValue)}
            color="bg-purple-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold mb-4">Sales Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData.salesTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Line type="monotone" dataKey="sales" stroke="#8b5cf6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold mb-4">Category-wise Sales</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={salesData.categoryData}
                  dataKey="totalAmount"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {salesData.categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold mb-4">Payment Methods</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData.paymentBreakdown}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
              <Bar dataKey="totalAmount" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  // Customer Insights
  const renderCustomers = () => {
    if (!customerData) return <div className="text-center py-8">Loading...</div>;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard
            icon={Users}
            title="Total Customers"
            value={customerData.totalCustomers}
            color="bg-blue-500"
          />
          <StatCard
            icon={Users}
            title="New Customers"
            value={customerData.newCustomers}
            color="bg-green-500"
          />
          <StatCard
            icon={Users}
            title="Returning Customers"
            value={customerData.returningCustomers}
            color="bg-purple-500"
          />
          <StatCard
            icon={ShoppingBag}
            title="Pending Orders"
            value={customerData.pendingOrders}
            color="bg-orange-500"
          />
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold mb-4">Top Customers</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Customer Name</th>
                  <th className="text-left py-3 px-4">Phone</th>
                  <th className="text-center py-3 px-4">Orders</th>
                  <th className="text-right py-3 px-4">Total Spent</th>
                </tr>
              </thead>
              <tbody>
                {customerData.topCustomers.map((customer, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{customer.name}</td>
                    <td className="py-3 px-4">{customer.phone}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        {customer.orderCount}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-green-600">
                      {formatCurrency(customer.totalSpent)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // Inventory Report
  const renderInventory = () => {
    if (!inventoryData) return <div className="text-center py-8">Loading...</div>;

    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold mb-4">Best Selling Services</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Service Name</th>
                  <th className="text-left py-3 px-4">Category</th>
                  <th className="text-center py-3 px-4">Units Sold</th>
                  <th className="text-right py-3 px-4">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {inventoryData.bestSelling.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{item.serviceName}</td>
                    <td className="py-3 px-4">
                      {item.category.map((cat, i) => (
                        <span key={i} className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs mr-1">
                          {cat}
                        </span>
                      ))}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                        {item.soldCount}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-green-600">
                      {formatCurrency(item.revenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {inventoryData.deadStock.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-red-500">
            <div className="flex items-center mb-4">
              <AlertCircle className="w-6 h-6 text-red-500 mr-2" />
              <h3 className="text-lg font-semibold">Dead Stock Alert</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Service Name</th>
                    <th className="text-left py-3 px-4">Category</th>
                    <th className="text-left py-3 px-4">Last Sold</th>
                  </tr>
                </thead>
                <tbody>
                  {inventoryData.deadStock.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{item.serviceName}</td>
                      <td className="py-3 px-4">
                        {item.category.map((cat, i) => (
                          <span key={i} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs mr-1">
                            {cat}
                          </span>
                        ))}
                      </td>
                      <td className="py-3 px-4 text-red-600">{item.lastSold}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Staff Performance
  const renderStaff = () => {
    if (!staffData) return <div className="text-center py-8">Loading...</div>;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {staffData.slice(0, 4).map((staff, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center justify-between mb-3">
                <Briefcase className="w-8 h-8 text-purple-500" />
                <div className="flex items-center">
                  <Award className="w-4 h-4 text-yellow-500 mr-1" />
                  <span className="font-semibold">{staff.starRating}</span>
                </div>
              </div>
              <h4 className="font-semibold text-lg mb-1">{staff.name}</h4>
              <p className="text-sm text-gray-600 mb-3">{staff.role}</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Completion:</span>
                  <span className="font-semibold text-green-600">{staff.completionRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tasks:</span>
                  <span className="font-semibold">{staff.completedTasks}/{staff.totalTasks}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold mb-4">Staff Performance Details</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Name</th>
                  <th className="text-left py-3 px-4">Role</th>
                  <th className="text-center py-3 px-4">Total Tasks</th>
                  <th className="text-center py-3 px-4">Completed</th>
                  <th className="text-center py-3 px-4">Reassigned</th>
                  <th className="text-center py-3 px-4">Avg Duration</th>
                  <th className="text-center py-3 px-4">Rating</th>
                </tr>
              </thead>
              <tbody>
                {staffData.map((staff, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{staff.name}</td>
                    <td className="py-3 px-4">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                        {staff.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">{staff.totalTasks}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                        {staff.completedTasks}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {staff.reassignedTasks > 0 ? (
                        <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                          {staff.reassignedTasks}
                        </span>
                      ) : (
                        <span className="text-gray-400">0</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">{staff.avgTaskDuration}h</td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center">
                        <Award className="w-4 h-4 text-yellow-500 mr-1" />
                        <span className="font-semibold">{staff.starRating}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // Profit Summary
  const renderProfit = () => {
    if (!profitData) return <div className="text-center py-8">Loading...</div>;

    const expenseBreakdown = [
      { name: 'Labor Cost', value: profitData.laborCost },
      { name: 'Material Cost', value: profitData.materialCost },
      { name: 'Shop Expenses', value: profitData.shopExpenses }
    ];

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            icon={DollarSign}
            title="Total Revenue"
            value={formatCurrency(profitData.totalRevenue)}
            color="bg-green-500"
          />
          <StatCard
            icon={TrendingUp}
            title="Net Profit"
            value={formatCurrency(profitData.netProfit)}
            subtitle={`${profitData.profitMargin}% margin`}
            color="bg-blue-500"
          />
          <StatCard
            icon={AlertCircle}
            title="Total Expenses"
            value={formatCurrency(profitData.totalExpenses)}
            color="bg-red-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold mb-4">Expense Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expenseBreakdown}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {expenseBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold mb-4">Financial Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                <span className="text-gray-700 font-medium">Total Revenue</span>
                <span className="text-xl font-bold text-green-600">{formatCurrency(profitData.totalRevenue)}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                <span className="text-gray-700 font-medium">Extra Charges</span>
                <span className="text-xl font-bold text-blue-600">{formatCurrency(profitData.extraCharges)}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-orange-50 rounded-lg">
                <span className="text-gray-700 font-medium">Labor Cost</span>
                <span className="text-xl font-bold text-orange-600">{formatCurrency(profitData.laborCost)}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
                <span className="text-gray-700 font-medium">Material Cost</span>
                <span className="text-xl font-bold text-purple-600">{formatCurrency(profitData.materialCost)}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
                <span className="text-gray-700 font-medium">Shop Expenses</span>
                <span className="text-xl font-bold text-red-600">{formatCurrency(profitData.shopExpenses)}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-800 text-white rounded-lg">
                <span className="font-medium">Net Profit</span>
                <span className="text-2xl font-bold">{formatCurrency(profitData.netProfit)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Order Status Report
  const renderOrders = () => {
    if (!orderData) return <div className="text-center py-8">Loading...</div>;

    const getStatusColor = (status) => {
      const colors = {
        'Placed': 'bg-gray-100 text-gray-800',
        'Cutting': 'bg-blue-100 text-blue-800',
        'Handworking': 'bg-purple-100 text-purple-800',
        'Tailoring': 'bg-yellow-100 text-yellow-800',
        'Stitching': 'bg-orange-100 text-orange-800',
        'Quality Check': 'bg-indigo-100 text-indigo-800',
        'Ready to Deliver': 'bg-green-100 text-green-800',
        'Delivered': 'bg-green-200 text-green-900'
      };
      return colors[status] || 'bg-gray-100 text-gray-800';
    };

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {orderData.statusSummary.map((status, index) => (
            <div key={index} className="bg-white p-4 rounded-xl shadow-md">
              <p className="text-gray-600 text-sm mb-1">{status._id}</p>
              <p className="text-2xl font-bold">{status.count}</p>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Order List</h3>
            <button className="flex items-center px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Order No</th>
                  <th className="text-left py-3 px-4">Customer</th>
                  <th className="text-left py-3 px-4">Service</th>
                  <th className="text-center py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Assigned To</th>
                  <th className="text-center py-3 px-4">Expected Date</th>
                  <th className="text-right py-3 px-4">Amount</th>
                </tr>
              </thead>
              <tbody>
                {orderData.orders.map((order, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{order.orderNo}</td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">{order.customerName}</p>
                        <p className="text-sm text-gray-500">{order.customerPhone}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">{order.service}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">{order.assignedStaff}</p>
                        <p className="text-xs text-gray-500">{order.staffRole}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center text-sm">
                      {new Date(order.expectedDate).toLocaleDateString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-green-600">
                      {formatCurrency(order.totalAmount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">📊 Boutique Analytics</h1>
          <p className="text-gray-600">Comprehensive business reports and insights</p>
        </div>

        {/* Date Filter */}
        <div className="bg-white p-4 rounded-xl shadow-md mb-6 flex flex-wrap items-center gap-4">
          <div className="flex items-center">
            <Calendar className="w-5 h-5 text-gray-500 mr-2" />
            <span className="text-sm font-medium text-gray-700">Date Range:</span>
          </div>
          <input
            type="date"
            value={dateRange.startDate}
            onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
            className="px-4 py-2 border rounded-lg"
          />
          <span className="text-gray-500">to</span>
          <input
            type="date"
            value={dateRange.endDate}
            onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
            className="px-4 py-2 border rounded-lg"
          />
          <button
            onClick={fetchData}
            className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 flex items-center"
          >
            <Filter className="w-4 h-4 mr-2" />
            Apply Filter
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md mb-6 overflow-x-auto">
          <div className="flex">
            {[
              { id: 'dashboard', label: '🏠 Dashboard' },
              { id: 'sales', label: '💰 Sales' },
              { id: 'customers', label: '👥 Customers' },
              { id: 'inventory', label: '📦 Inventory' },
              { id: 'staff', label: '👔 Staff' },
              { id: 'profit', label: '📈 Profit' },
              { id: 'orders', label: '🛍️ Orders' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                    : 'text-gray-600 hover:text-purple-600 hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading data...</p>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'sales' && renderSales()}
            {activeTab === 'customers' && renderCustomers()}
            {activeTab === 'inventory' && renderInventory()}
            {activeTab === 'staff' && renderStaff()}
            {activeTab === 'profit' && renderProfit()}
            {activeTab === 'orders' && renderOrders()}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminReports;