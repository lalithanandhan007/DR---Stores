import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema({
  _id: { type: String },
  user: { type: String, ref: 'User', required: true, unique: true },
  items: [{
    product: { type: String, ref: 'Product' },
    addedAt: { type: Date, default: Date.now },
  }],
}, { timestamps: true });

export default mongoose.model('Wishlist', wishlistSchema);
