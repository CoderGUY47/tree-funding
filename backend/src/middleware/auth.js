const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // 1. Try validating standard local JWT token first
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tree_funding_jwt_secret_key_2026_super_secure');
      // Ensure req.user has string id property
      req.user = {
        id: decoded.id || decoded._id,
        email: decoded.email,
        role: decoded.role
      };
      return next();
    } catch (jwtErr) {
      // 2. Fallback: Validate token against Better Auth session in MongoDB
      const session = await mongoose.connection.db.collection('sessions').findOne({ token });
      if (!session || new Date(session.expiresAt) < new Date()) {
        return res.status(401).json({ message: 'Invalid or expired session.' });
      }

      // Find user associated with the session
      // Better Auth stores userId as string or ObjectId
      const user = await User.findById(session.userId);
      if (!user) {
        return res.status(401).json({ message: 'User associated with session not found.' });
      }

      req.user = {
        id: user._id.toString(),
        email: user.email,
        role: user.role
      };
      return next();
    }
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

const verifyRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Unauthorized access. Insufficient permissions.' });
    }
    next();
  };
};

module.exports = {
  verifyToken,
  verifyRole
};
