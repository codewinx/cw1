const express = require("express");
const router = express.Router();

const {gettailorinfo,gettailorTasks,updateTaskStatus,updateProfile,uploadProfileImage } = require("../controllers/tailorController");

const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/gettailorinfo",protect,authorize("tailor"), gettailorinfo);
// router.get("/:staffId/tasks", protect, authorize("tailor"), getTasksByStaff);
router.get("/gettailortasks",protect,authorize("tailor"), gettailorTasks);
router.put("/:taskId", protect,authorize("tailor"),updateTaskStatus);


module.exports = router;