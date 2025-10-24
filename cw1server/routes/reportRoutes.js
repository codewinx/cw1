
const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");

// 🛍️ Sales Overview
router.get("/sales-overview", reportController.getSalesOverview);

// 🧕 Customer Insights
router.get("/customer-insights", reportController.getCustomerInsights);

// 🪡 Inventory Report
router.get("/inventory-report", reportController.getInventoryReport);

// 👗 Staff Performance
router.get("/staff-performance", reportController.getStaffPerformance);

// 💸 Profit Summary
router.get("/profit-summary", reportController.getProfitSummary);

// 🧾 Order Status Report
router.get("/order-status", reportController.getOrderStatusReport);

// 📊 Dashboard Summary
router.get("/dashboard-summary", reportController.getDashboardSummary);

module.exports = router;