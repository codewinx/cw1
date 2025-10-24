import Order from "../models/Order.js";
import Payment from "../models/Payment.js";
import Customer from "../models/Customer.js";
import Staff from "../models/Staff.js";
import Service from "../models/Service.js";
import Task from "../models/Task.js";
import mongoose from "mongoose";

// Helper function to safely parse date filters
const parseDateFilter = (startDate, endDate) => {
  const filter = {};
  if (startDate && endDate) {
    try {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    } catch (error) {
      console.error("Date parsing error:", error);
    }
  }
  return filter;
};

// 🛍️ 1. Sales Overview Report
export const getSalesOverview = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const dateFilter = parseDateFilter(startDate, endDate);

    const orders = await Order.find(dateFilter)
      .populate("payment")
      .populate("service")
      .lean();

    const totalSales = orders.reduce(
      (sum, order) => sum + (order.payment?.totalAmount || 0),
      0
    );

    const totalOrders = orders.length;
    const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

    const paymentIds = orders
      .map((o) => o.payment?._id || o.payment)
      .filter(Boolean);

    const paymentBreakdown = await Payment.aggregate([
      { $match: { _id: { $in: paymentIds } } },
      {
        $group: {
          _id: "$paymentMode",
          count: { $sum: 1 },
          totalAmount: { $sum: "$totalAmount" }
        }
      }
    ]);

    const categoryMap = {};
    for (const order of orders) {
      if (order.service?.category) {
        const categories = Array.isArray(order.service.category)
          ? order.service.category
          : [order.service.category];

        for (const cat of categories) {
          if (!categoryMap[cat]) {
            categoryMap[cat] = { category: cat, count: 0, totalAmount: 0 };
          }
          categoryMap[cat].count += 1;
          categoryMap[cat].totalAmount += order.payment?.totalAmount || 0;
        }
      }
    }

    const categoryData = Object.values(categoryMap);

    const salesTrendMap = {};
    for (const order of orders) {
      const dateKey = new Date(order.createdAt).toISOString().split("T")[0];
      if (!salesTrendMap[dateKey]) {
        salesTrendMap[dateKey] = { _id: dateKey, sales: 0, orders: 0 };
      }
      salesTrendMap[dateKey].sales += order.payment?.totalAmount || 0;
      salesTrendMap[dateKey].orders += 1;
    }

    const salesTrend = Object.values(salesTrendMap).sort(
      (a, b) => new Date(a._id) - new Date(b._id)
    );

    res.json({
      success: true,
      data: {
        totalSales: Math.round(totalSales),
        totalOrders,
        avgOrderValue: Math.round(avgOrderValue),
        paymentBreakdown,
        categoryData,
        salesTrend
      }
    });
  } catch (error) {
    console.error("Sales Overview Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🧕 2. Customer Insights Report
export const getCustomerInsights = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const dateFilter = parseDateFilter(startDate, endDate);

    const totalCustomers = await Customer.countDocuments();

    const orders = await Order.find(dateFilter)
      .populate("customer")
      .populate("payment")
      .lean();

    const customerMap = {};
    for (const order of orders) {
      const customerId = order.customer?._id?.toString() || order.customer;
      if (!customerId) continue;

      if (!customerMap[customerId]) {
        customerMap[customerId] = {
          name: order.customer?.name || "Unknown",
          phone: order.customer?.phone || "N/A",
          orderCount: 0,
          totalSpent: 0,
          firstOrder: order.createdAt
        };
      }
      customerMap[customerId].orderCount += 1;
      customerMap[customerId].totalSpent += order.payment?.totalAmount || 0;

      if (new Date(order.createdAt) < new Date(customerMap[customerId].firstOrder)) {
        customerMap[customerId].firstOrder = order.createdAt;
      }
    }

    const customerOrders = Object.values(customerMap);
    let newCustomers = 0;
    let returningCustomers = 0;

    for (const customer of customerOrders) {
      if (startDate && new Date(customer.firstOrder) >= new Date(startDate)) {
        newCustomers++;
      }
      if (customer.orderCount > 1) {
        returningCustomers++;
      }
    }

    const topCustomers = customerOrders
      .sort((a, b) => b.orderCount - a.orderCount)
      .slice(0, 10)
      .map((c) => ({
        name: c.name,
        phone: c.phone,
        orderCount: c.orderCount,
        totalSpent: Math.round(c.totalSpent)
      }));

    const pendingOrders = await Order.countDocuments({
      status: { $nin: ["Delivered"] }
    });

    res.json({
      success: true,
      data: {
        totalCustomers,
        newCustomers,
        returningCustomers,
        topCustomers,
        pendingOrders
      }
    });
  } catch (error) {
    console.error("Customer Insights Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🪡 3. Product & Inventory Report
export const getInventoryReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const dateFilter = parseDateFilter(startDate, endDate);

    const orders = await Order.find(dateFilter)
      .populate("service")
      .populate("payment")
      .lean();

    const serviceMap = {};
    for (const order of orders) {
      const serviceId = order.service?._id?.toString();
      if (!serviceId) continue;

      if (!serviceMap[serviceId]) {
        serviceMap[serviceId] = {
          serviceName: order.service?.name || "Unknown",
          category: order.service?.category || [],
          soldCount: 0,
          revenue: 0
        };
      }
      serviceMap[serviceId].soldCount += 1;
      serviceMap[serviceId].revenue += order.payment?.totalAmount || 0;
    }

    const bestSelling = Object.values(serviceMap)
      .sort((a, b) => b.soldCount - a.soldCount)
      .map((s) => ({ ...s, revenue: Math.round(s.revenue) }));

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const allServices = await Service.find().lean();
    const recentOrderServiceIds = await Order.find({
      createdAt: { $gte: thirtyDaysAgo }
    }).distinct("service");

    const recentServiceIdStrings = recentOrderServiceIds.map((id) => id.toString());

    const deadStock = allServices
      .filter((service) => !recentServiceIdStrings.includes(service._id.toString()))
      .map((service) => ({
        serviceName: service.name,
        category: service.category || [],
        lastSold: "Over 30 days ago"
      }));

    res.json({
      success: true,
      data: { bestSelling, deadStock }
    });
  } catch (error) {
    console.error("Inventory Report Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 👗 4. Staff Performance Report
export const getStaffPerformance = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const dateFilter = parseDateFilter(startDate, endDate);

    const staffList = await Staff.find({ isActive: true }).lean();

    const staffPerformance = await Promise.all(
      staffList.map(async (staff) => {
        const tasks = await Task.find({
          assignedTo: staff._id,
          ...dateFilter
        }).lean();

        const completedTasks = tasks.filter((t) => t.status === "done").length;
        const reassignedTasks = tasks.filter((t) => t.wasReassigned).length;

        const completedWithDuration = tasks.filter(
          (t) => t.status === "done" && t.startedAt && t.completedAt
        );

        let avgDuration = 0;
        if (completedWithDuration.length > 0) {
          const totalDuration = completedWithDuration.reduce((sum, t) => {
            return sum + (new Date(t.completedAt) - new Date(t.startedAt)) / (1000 * 60 * 60);
          }, 0);
          avgDuration = totalDuration / completedWithDuration.length;
        }

        const taskIds = tasks.map((t) => t._id);
        const ordersHandled = await Order.countDocuments({ tasks: { $in: taskIds } });

        return {
          name: staff.name,
          role: staff.role,
          totalTasks: tasks.length,
          completedTasks,
          reassignedTasks,
          avgTaskDuration: avgDuration.toFixed(2),
          ordersHandled,
          starRating: staff.starRating || 0,
          completionRate:
            tasks.length > 0 ? ((completedTasks / tasks.length) * 100).toFixed(2) : 0
        };
      })
    );

    res.json({ success: true, data: staffPerformance });
  } catch (error) {
    console.error("Staff Performance Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 💸 5. Expense & Profit Summary
export const getProfitSummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const dateFilter = parseDateFilter(startDate, endDate);

    const orders = await Order.find(dateFilter).populate("payment").lean();
    const totalRevenue = orders.reduce(
      (sum, order) => sum + (order.payment?.totalAmount || 0),
      0
    );

    const extraCharges = orders.reduce(
      (sum, order) => sum + (order.payment?.extraCharges?.amount || 0),
      0
    );

    const activeStaff = await Staff.find({ isActive: true }).lean();
    const laborCost = activeStaff.reduce((sum, staff) => sum + (staff.salary || 0), 0);

    const materialCost = orders.length * 500;
    const shopExpenses = 50000;

    const totalExpenses = laborCost + materialCost + shopExpenses;
    const netProfit = totalRevenue - totalExpenses;
    const profitMargin =
      totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(2) : 0;

    res.json({
      success: true,
      data: {
        totalRevenue: Math.round(totalRevenue),
        extraCharges: Math.round(extraCharges),
        laborCost: Math.round(laborCost),
        materialCost: Math.round(materialCost),
        shopExpenses: Math.round(shopExpenses),
        totalExpenses: Math.round(totalExpenses),
        netProfit: Math.round(netProfit),
        profitMargin: parseFloat(profitMargin)
      }
    });
  } catch (error) {
    console.error("Profit Summary Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🧾 6. Order Status Report
export const getOrderStatusReport = async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const dateFilter = parseDateFilter(startDate, endDate);
    Object.assign(filter, dateFilter);

    const orders = await Order.find(filter)
      .populate("customer", "name phone")
      .populate("service", "name category")
      .populate("payment")
      .sort({ createdAt: -1 })
      .lean();

    const ordersWithStaff = await Promise.all(
      orders.map(async (order) => {
        const tasks = await Task.find({ order: order._id })
          .populate("assignedTo", "name role")
          .sort({ createdAt: -1 })
          .lean();

        const currentTask = tasks.find((t) => t.status === "in-progress") || tasks[0];

        return {
          orderNo: order.orderNo,
          customerName: order.customer?.name || "N/A",
          customerPhone: order.customer?.phone || "N/A",
          service: order.service?.name || "N/A",
          category: order.service?.category || [],
          status: order.status,
          expectedDate: order.expectedDate,
          createdAt: order.createdAt,
          assignedStaff: currentTask?.assignedTo?.name || "Not Assigned",
          staffRole: currentTask?.assignedTo?.role || "-",
          totalAmount: order.payment?.totalAmount || 0,
          paymentStatus: order.payment?.status || "Pending"
        };
      })
    );

    const statusMap = {};
    orders.forEach((order) => {
      const key = order.status || "Unknown";
      statusMap[key] = (statusMap[key] || 0) + 1;
    });

    const statusSummary = Object.entries(statusMap).map(([key, count]) => ({
      _id: key,
      count
    }));

    res.json({
      success: true,
      data: { orders: ordersWithStaff, statusSummary }
    });
  } catch (error) {
    console.error("Order Status Report Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📊 7. Dashboard Summary
export const getDashboardSummary = async (req, res) => {
  try {
    const today = new Date();
    const todayStart = new Date(today.setHours(0, 0, 0, 0));
    const todayEnd = new Date(today.setHours(23, 59, 59, 999));
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);

    const todayOrders = await Order.find({
      createdAt: { $gte: todayStart, $lte: todayEnd }
    })
      .populate("payment")
      .lean();

    const todayRevenue = todayOrders.reduce(
      (sum, o) => sum + (o.payment?.totalAmount || 0),
      0
    );

    const monthlyOrders = await Order.find({
      createdAt: { $gte: startOfMonth }
    })
      .populate("payment")
      .lean();

    const monthlyRevenue = monthlyOrders.reduce(
      (sum, o) => sum + (o.payment?.totalAmount || 0),
      0
    );

    const yearlyOrders = await Order.find({
      createdAt: { $gte: startOfYear }
    })
      .populate("payment")
      .lean();

    const yearlyRevenue = yearlyOrders.reduce(
      (sum, o) => sum + (o.payment?.totalAmount || 0),
      0
    );

    const pendingOrders = await Order.countDocuments({
      status: { $nin: ["Delivered"] }
    });

    const activeStaff = await Staff.countDocuments({ isActive: true });
    const totalCustomers = await Customer.countDocuments();

    res.json({
      success: true,
      data: {
        today: { orders: todayOrders.length, revenue: Math.round(todayRevenue) },
        monthly: { orders: monthlyOrders.length, revenue: Math.round(monthlyRevenue) },
        yearly: { orders: yearlyOrders.length, revenue: Math.round(yearlyRevenue) },
        pendingOrders,
        activeStaff,
        totalCustomers
      }
    });
  } catch (error) {
    console.error("Dashboard Summary Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📊 8. Sales Overview