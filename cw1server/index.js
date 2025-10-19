import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import staffRoutes from "./routes/staffRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import cutterRoutes from "./routes/cutterRoutes.js";
import handworkerRoutes from "./routes/handworkerRoutes.js";
import tailorRoutes from "./routes/tailorRoutes.js";


dotenv.config();
connectDB();

const app = express();

// ✅ Allow bigger request payloads
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// ✅ CORS
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/order", orderRoutes);
app.use("/api", serviceRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/task", taskRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/cutter", cutterRoutes);
app.use("/api/handworker", handworkerRoutes);
app.use("/api/tailor",tailorRoutes);



app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
