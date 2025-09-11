const express = require("express");
const router = express.Router();

const {gettailorinfo,gettailorTasks, } = require("../controllers/tailorController");
const { getTaskStatusCounts } = require("../controllers/tailorController");
// const { getMeasurementsByOrderId } = require("../controllers/measurementController");
const { protect, authorize } = require("../middleware/authMiddleware");
const { updateTaskStatus } = require("../controllers/tailorController");
router.get("/gettailorinfo",protect,authorize("tailor"), gettailorinfo);
// router.get("/:staffId/tasks", protect, authorize("tailor"), getTasksByStaff);
router.get("/gettailortasks",protect,authorize("tailor"), gettailorTasks);
// router.put("/:taskId", protect,authorize("tailor"),updateTaskStatus);


// ✅ Route to get measurements by order ID
// router.get("/by-order/:orderId", protect, authorize("tailor"), getMeasurementsByOrderId);

// GET /api/tasks/status-count
router.get("/status-count", protect, authorize("tailor"), getTaskStatusCounts);
router.put("/:taskId", protect,authorize("tailor"),updateTaskStatus);

module.exports = router;