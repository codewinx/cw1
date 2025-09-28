// route file
import express from "express";
import {
  getAllCustomers,
  updateCustomer,
  deleteCustomer,
} from "../controllers/customerController.js";

const router = express.Router();

// ✅ This will be /api/customer/
router.get("/", getAllCustomers);
router.put("/:id", updateCustomer);
router.delete("/:id", deleteCustomer);

export default router;
