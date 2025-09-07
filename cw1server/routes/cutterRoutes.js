const express = require("express");
const router = express.Router();

const {getCurrentStaff,getCutterTasks,updateTaskStatus,updateProfile} = require("../controllers/cutterController");

const { protect, authorize } = require("../middleware/authMiddleware");
const { uploadProfileImage } = require("../middleware/upload");



router.get("/getcutterdetails",protect,authorize("Cutter"), getCurrentStaff);

router.get("/getcuttertasks",protect,authorize("Cutter"), getCutterTasks);
router.put("/:taskId", protect,authorize("Cutter"),updateTaskStatus);

router.put("/:staffId",protect,authorize("Cutter"), uploadProfileImage,updateProfile);


module.exports = router;