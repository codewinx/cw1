const express = require("express");
const router = express.Router();

const {gettailorinfo,gettailorTasks,updateTaskStatus,updateProfile,uploadProfileImage } = require("../controllers/tailorController");
const { getTaskStatusCounts } = require("../controllers/tailorController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/gettailorinfo",protect,authorize("tailor"), gettailorinfo);
// router.get("/:staffId/tasks", protect, authorize("tailor"), getTasksByStaff);
router.get("/gettailortasks",protect,authorize("tailor"), gettailorTasks);
router.put("/:taskId", protect,authorize("tailor"),updateTaskStatus);


// GET /api/tasks/status-count
router.get("/status-count", protect, authorize("tailor"), getTaskStatusCounts);


module.exports = router;