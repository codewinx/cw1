const express = require("express");
const router = express.Router();

const {getCurrentStaff} = require("../controllers/cutterController");

const { protect, authorize } = require("../middleware/authMiddleware");



router.get("/getcutterdetails",protect,authorize("Cutter"), getCurrentStaff);

module.exports = router;