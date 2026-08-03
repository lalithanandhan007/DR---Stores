import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  type: { type: String, enum: ['order', 'lowstock', 'coupon', 'customer', 'delivery', 'system', 'review'], default: 'order' },
  title: { type: String, required: true },
  message: { type: String, default: '' },
  time: { type: String, default: 'Just now' },
  read: { type: Boolean, default: false },
  user: { type: String, ref: 'User' },
  adminOnly: { type: Boolean, default: true },
}, { timestamps: true });

notificationSchema.index({ user: 1 });
notificationSchema.index({ read: 1 });

export default mongoose.model('Notification', notificationSchema);
