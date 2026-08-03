import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema({
  _id: { type: String, required: true },
  product: { type: String, ref: 'Product' },
  productName: { type: String, required: true },
  emoji: { type: String, default: '' },
  gradient: [{ type: String }],
  category: { type: String },
  sku: { type: String, default: '' },
  barcode: { type: String, default: '' },
  currentStock: { type: Number, default: 0 },
  minStock: { type: Number, default: 10 },
  reservedStock: { type: Number, default: 0 },
  incomingStock: { type: Number, default: 0 },
  unit: { type: String, default: 'kg' },
  costPrice: { type: Number, default: 0 },
  sellingPrice: { type: Number, default: 0 },
  lastRestocked: { type: Date },
  expiry: { type: Date },
  status: { type: String, enum: ['in_stock', 'low', 'out_of_stock'], default: 'in_stock' },
}, { timestamps: true });

const stockHistorySchema = new mongoose.Schema({
  _id: { type: String, required: true },
  productId: { type: String },
  type: { type: String, enum: ['restock', 'sale', 'return', 'damaged', 'manual'] },
  quantity: { type: Number },
  reason: { type: String, default: '' },
  performedBy: { type: String, default: 'System' },
  timestamp: { type: Date, default: Date.now },
});

export const Inventory = mongoose.model('Inventory', inventorySchema);
export const StockHistory = mongoose.model('StockHistory', stockHistorySchema);
