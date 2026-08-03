import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  user: { type: String, ref: 'User', required: true },
  product: { type: String, ref: 'Product', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, default: '' },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'approved' },
  createdAt: { type: Date, default: Date.now },
});

reviewSchema.index({ product: 1 });
reviewSchema.index({ user: 1 });

export default mongoose.model('Review', reviewSchema);
