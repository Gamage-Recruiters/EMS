import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import AppError from '../utils/AppError.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      return next(new AppError('Not authorized, token failed', 401));
    }
  }

  if (!token) {
    return next(new AppError('Not authorized, no token', 401));
  }
};

// RBAC Middleware
export const authorize = (...roles) => {
  return (req, res, next) => {
    // CEO always has access
    if (req.user.role === 'CEO') return next();

    if (!roles.includes(req.user.role)) {
      return next(new AppError(`User role '${req.user.role}' is not authorized to access this route`, 403));
    }
    next();
  };
};