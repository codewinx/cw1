const express = require("express");
const router = express.Router();
const {getCutterTasks} = require("../controllers/managerController");

const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/getcuttertasks",protect,authorize("manager"), getCutterTasks);

module.exports = router;