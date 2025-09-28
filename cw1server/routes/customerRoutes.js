import express from "express";
import {
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} from "../controllers/customerController.js";

const router = express.Router();

router.get("/", getAllCustomers);
router.get("/:id", getCustomerById);  // ✅ new route
router.put("/:id", updateCustomer);
router.delete("/:id", deleteCustomer);

export default router;
