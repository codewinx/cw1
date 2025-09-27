// models/Customer.js
import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, sparse: true },
  phone: { type: String, required: true, unique: true },
  address: { type: String },
  gender: { type: String, enum: ["Male", "Female", "Other"] },
});

export default mongoose.model("Customer", customerSchema);
