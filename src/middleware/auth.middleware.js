const jwt = require('jsonwebtoken');
const { error } = require('../utils/apiResponse');
const prisma = require('../config/db');

/**
 * Verifies JWT token from Authorization header.
 * Attaches decoded user to req.user.
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return error(res, 'Access denied. No token provided.', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch fresh user from DB (ensures deactivated accounts are blocked)
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, role: true, isActive: true },
    });

    if (!user || !user.isActive) {
      return error(res, 'User not found or account deactivated.', 401);
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return error(res, 'Token expired. Please login again.', 401);
    }
    if (err.name === 'JsonWebTokenError') {
      return error(res, 'Invalid token.', 401);
    }
    next(err);
  }
};

module.exports = { authenticate };
