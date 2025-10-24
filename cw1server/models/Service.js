// models/Service.js
import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
  }, 
  category: [
    {
    type: String,
    enum: ["Stitching", "Handworking", "Saree", "Altering"],
    required: true,
  },
],
  measurements: [{ type: String }],
});

export default mongoose.model("Service", serviceSchema);