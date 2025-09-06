const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');
const cors = require("cors");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware to parse JSON
app.use(express.json());
// ✅ Allow requests from frontend
// ✅ Allow requests from frontend
app.use(cors({
  origin: process.env.CLIENT_URL,  // read from .env
  credentials: true,               // if using cookies/auth
}));
;
// =========================
// Routes
// =========================
const authRoutes = require('./routes/authRoutes');
const customerRoutes = require('./routes/customerRoutes');
const orderRoutes = require('./routes/orderRoutes');
const measurementRoutes = require('./routes/measurementRoutes');
// Admin or Manager can add customer
app.use('/api/customer', customerRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/measurement', measurementRoutes);
// =========================
// Static folder for profile images
// =========================
app.use('/uploads/profile', express.static(path.join(__dirname, '/uploads/profile')));

// Test Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// =========================
// Server Start
// =========================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
