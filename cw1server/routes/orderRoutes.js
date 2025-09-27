import express from "express";
import { createOrder, getOrders, getOrderById } from "../controllers/orderController.js";
import uploadDesign from "../middleware/uploadDesign.js"; // ✅ default import
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, authorize("admin", "manager"), uploadDesign, createOrder);
router.get("/", protect, authorize("admin", "manager"), getOrders);
router.get("/:id", protect, authorize("admin", "manager"), getOrderById);

export default router;
