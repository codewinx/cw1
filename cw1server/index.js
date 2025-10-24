import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import staffRoutes from "./routes/staffRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import cutterRoutes from "./routes/cutterRoutes.js";
import handworkerRoutes from "./routes/handworkerRoutes.js";
import tailorRoutes from "./routes/tailorRoutes.js";
import adminManagerRoutes from "./routes/adminManagerRoutes.js";
import reportRoutes  from "./routes/reportRoutes.js";

dotenv.config();
connectDB();

const app = express();

// Get current directory path (for ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// ✅ CORS setup
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// ✅ Serve uploaded images & files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/order", orderRoutes);
app.use("/api", serviceRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/task", taskRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/cutter", cutterRoutes);
app.use("/api/handworker", handworkerRoutes);
app.use("/api/tailor", tailorRoutes);
app.use("/api/admin-manager", adminManagerRoutes);
app.use("/api/reports", reportRoutes);
// ✅ Default route
app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
