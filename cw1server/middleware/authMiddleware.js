// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const Staff = require("../models/Staff");

// Protect routes (verify JWT)
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 👇 attach as req.user (not req.staff)
      req.user = await Staff.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "Staff not found" });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token invalid" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

// Role-based access control
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};

module.exports = { protect, authorize };
