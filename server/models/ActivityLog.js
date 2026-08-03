import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  type: { type: String, enum: ['login', 'product', 'inventory', 'customer', 'order', 'coupon', 'delivery', 'settings', 'system'], required: true },
  actor: { type: String, default: 'System' },
  action: { type: String, required: true },
  detail: { type: String, default: '' },
  severity: { type: String, enum: ['info', 'success', 'warning', 'error'], default: 'info' },
  timestamp: { type: Date, default: Date.now },
});

activityLogSchema.index({ timestamp: -1 });

export default mongoose.model('ActivityLog', activityLogSchema);
