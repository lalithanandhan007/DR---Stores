import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true },
  icon: { type: String, default: '' },
  color: { type: String, default: '#2E7D32' },
  order: { type: Number, default: 0 },
  visible: { type: Boolean, default: true },
  productCount: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('Category', categorySchema);
