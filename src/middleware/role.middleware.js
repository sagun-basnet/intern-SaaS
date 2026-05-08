const { error } = require('../utils/apiResponse');

/**
 * Role-Based Access Control middleware factory.
 * Usage: authorize('ADMIN') or authorize('SEEKER', 'ADMIN')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return error(res, 'Authentication required.', 401);
    }
    if (!roles.includes(req.user.role)) {
      return error(
        res,
        `Access denied. Required role(s): ${roles.join(', ')}. Your role: ${req.user.role}`,
        403
      );
    }
    next();
  };
};

module.exports = { authorize };
