const { verifyToken } = require('../config/jwt');
const { getDbStatus } = require('../config/db');
const User = require('../models/User');
const { mockUsers } = require('../utils/mockStore');

const authenticate = async (req, res, next) => {
  try {
    let token = null;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. No bearer token provided.',
      });
    }

    const decoded = verifyToken(token);

    if (getDbStatus()) {
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({ success: false, message: 'User not found in system.' });
      }
      req.user = user;
    } else {
      // Memory store fallback
      const user = mockUsers.find((u) => u._id === decoded.id) || mockUsers[2]; // default to retail user
      req.user = user;
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authorization token.',
      error: error.message,
    });
  }
};

// Role-based access control middleware
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Access requires one of the following roles: [${roles.join(', ')}]. Current role: '${req.user.role}'.`,
      });
    }
    next();
  };
};

module.exports = {
  authenticate,
  requireRole,
};
