const express = require("express");
const router = express.Router();
const {getManagerTasks,updateTaskStatus} = require("../controllers/managerController");

const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/getmanagertasks",protect,authorize("manager"), getManagerTasks);
router.put("/:taskId", protect,authorize("manager"),updateTaskStatus);

module.exports = router;