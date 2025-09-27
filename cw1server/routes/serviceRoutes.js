// routes/serviceRoutes.js
const express = require("express");
const { getCategories, getServicesByCategory, createService } = require("../controllers/serviceController");

const router = express.Router();

// ✅ Make sure this route is present and correct
router.get("/categories", getCategories); 

router.get("/categories/:category/services", getServicesByCategory);
router.post("/services", createService);

module.exports = router;