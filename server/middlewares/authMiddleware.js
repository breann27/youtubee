// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // Extract token from header
      token = req.headers.authorization.split(" ")[1];
      
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Attach user data to request (excluding password)
      req.user = await User.findById(decoded.id).select("-password");
      
      next();
    } catch (error) {
      console.error("Authorization error:", error);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }
  
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token provided" });
  }
};
