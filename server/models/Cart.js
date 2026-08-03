import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  product: { type: String, ref: 'Product' },
  productName: { type: String },
  emoji: { type: String },
  weight: { type: String, default: '' },
  qty: { type: Number, default: 1, min: 1 },
  price: { type: Number, default: 0 },
  originalPrice: { type: Number, default: 0 },
  gradient: [{ type: String }],
}, { _id: false });

const cartSchema = new mongoose.Schema({
  _id: { type: String },
  user: { type: String, ref: 'User', required: true, unique: true },
  items: [cartItemSchema],
}, { timestamps: true });

export default mongoose.model('Cart', cartSchema);
