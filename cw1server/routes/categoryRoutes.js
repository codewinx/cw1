import express from "express";
import { getCategories, getServicesByCategory } from "../controllers/categoryController.js";

const router = express.Router();

// Get all categories
router.get("/", getCategories);

// Get services by category
router.get("/:category/services", getServicesByCategory);

export default router;
