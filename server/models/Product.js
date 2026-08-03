import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  slug: { type: String, required: true },
  emoji: { type: String, default: '' },
  gradient: [{ type: String }],
  category: { type: String, ref: 'Category' },
  categoryName: { type: String },
  description: { type: String, default: '' },
  longDescription: { type: String, default: '' },
  price: { type: Number, required: true },
  originalPrice: { type: Number, required: true },
  unit: { type: String, default: 'kg' },
  tax: { type: Number, default: 0 },
  stock: { type: Number, default: 0 },
  minStock: { type: Number, default: 10 },
  sku: { type: String, default: '' },
  barcode: { type: String, default: '' },
  status: { type: String, enum: ['published', 'draft', 'archived', 'hidden'], default: 'published' },
  organic: { type: Boolean, default: false },
  freshToday: { type: Boolean, default: false },
  bestSeller: { type: Boolean, default: false },
  todaysPick: { type: Boolean, default: false },
  featured: { type: Boolean, default: false },
  badges: [{ type: String }],
  weightOptions: [{ type: String }],
  tags: [{ type: String }],
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
  nutrition: {
    calories: { type: Number, default: 0 },
    protein: { type: String, default: '0g' },
    carbs: { type: String, default: '0g' },
    fiber: { type: String, default: '0g' },
    fat: { type: String, default: '0g' },
  },
  benefits: [{ type: String }],
  origin: { type: String, default: '' },
  storage: { type: String, default: '' },
  shelfLife: { type: String, default: '' },
  images: [{ type: String }],
}, { timestamps: true });

productSchema.index({ category: 1 });
productSchema.index({ status: 1 });
productSchema.index({ name: 'text', tags: 'text' });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });
productSchema.index({ createdAt: -1 });

productSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

export default mongoose.model('Product', productSchema);
