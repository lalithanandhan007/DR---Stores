import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  code: { type: String, required: true, unique: true, uppercase: true },
  type: { type: String, enum: ['flat', 'percent'], required: true },
  value: { type: Number, required: true },
  maxDiscount: { type: Number, default: null },
  minOrder: { type: Number, default: 0 },
  usageLimit: { type: Number, default: 1000 },
  usedCount: { type: Number, default: 0 },
  expiry: { type: Date },
  active: { type: Boolean, default: true },
  description: { type: String, default: '' },
  target: { type: String, enum: ['all', 'new', 'regular', 'premium', 'vip', 'specific'], default: 'all' },
  createdBy: { type: String, ref: 'User' },
}, { timestamps: true });

couponSchema.index({ code: 1 });

export default mongoose.model('Coupon', couponSchema);
