import Notification from '../models/Notification.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getNotifications = asyncHandler(async (req, res) => {
  const filter = { adminOnly: true };
  const notifications = await Notification.find(filter).sort({ createdAt: -1 }).limit(50);
  res.json(ApiResponse.success(notifications));
});

export const markRead = asyncHandler(async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, { read: true });
  res.json(ApiResponse.success(null, 'Marked as read'));
});

export const markAllRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ read: false }, { read: true });
  res.json(ApiResponse.success(null, 'All marked as read'));
});
