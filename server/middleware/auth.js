import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

export const protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.jwt || req.headers.authorization?.split(' ')[1];
  if (!token) throw new ApiError(401, 'Not authenticated. Please login.');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) throw new ApiError(401, 'User no longer exists');
    if (user.blocked) throw new ApiError(403, 'Your account has been blocked');
    req.user = user;
    next();
  } catch (err) {
    if (err.isOperational) throw err;
    throw new ApiError(401, 'Invalid or expired token');
  }
});

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      throw new ApiError(403, `Access denied. Required role: ${roles.join(' or ')}`);
    }
    next();
  };
};

export const adminOnly = authorize('admin');
