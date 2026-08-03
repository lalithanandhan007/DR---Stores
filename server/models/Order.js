import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  customer: {
    _id: { type: String },
    name: { type: String },
    phone: { type: String },
    email: { type: String },
    avatar: { type: String },
  },
  items: [{
    productId: { type: String },
    name: { type: String },
    emoji: { type: String },
    gradient: [{ type: String }],
    weight: { type: String },
    qty: { type: Number },
    price: { type: Number },
    mrp: { type: Number },
  }],
  subtotal: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  coupon: { type: String, default: null },
  deliveryFee: { type: Number, default: 0 },
  packagingFee: { type: Number, default: 5 },
  tax: { type: Number, default: 0 },
  grandTotal: { type: Number, default: 0 },
  payment: {
    method: { type: String, enum: ['UPI', 'Card', 'NetBanking', 'Wallet', 'Cash on Delivery'], default: 'UPI' },
    status: { type: String, enum: ['pending', 'paid', 'failed', 'refunded', 'cod', 'expired'], default: 'pending' },
    ref: { type: String, default: null },
    gateway: { type: String, default: null },
    razorpayOrderId: { type: String, default: null },
    razorpayPaymentId: { type: String, default: null },
    razorpaySignature: { type: String, default: null },
    transactionId: { type: String, default: null },
    paidAt: { type: Date, default: null },
    failedReason: { type: String, default: null },
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'preparing', 'packed', 'out_for_delivery', 'delivered', 'cancelled', 'refunded', 'confirmed'],
    default: 'pending',
  },
  source: { type: String, enum: ['Mobile App', 'Website', 'Phone'], default: 'Website' },
  partner: {
    _id: { type: String },
    name: { type: String },
    phone: { type: String },
    vehicle: { type: String },
    rating: { type: Number },
  },
  delivery: {
    slot: { id: String, label: String, time: String, price: Number },
    expectedAt: { type: Date },
    deliveredAt: { type: Date },
  },
  name: { type: String },
  phone: { type: String },
  address: {
    name: { type: String },
    house: { type: String },
    street: { type: String },
    locality: { type: String },
    city: { type: String },
    pincode: { type: String },
    landmark: { type: String },
    instructions: { type: String },
  },
  notes: {
    admin: [{ type: String }],
    customer: { type: String, default: '' },
    special: { type: String, default: '' },
  },
  timeline: [{
    status: { type: String },
    label: { type: String },
    note: { type: String },
    time: { type: Date },
    actor: { type: String },
  }],
  priority: { type: String, enum: ['normal', 'high', 'urgent'], default: 'normal' },
}, { timestamps: true });

orderSchema.index({ status: 1 });
orderSchema.index({ 'customer._id': 1 });
orderSchema.index({ createdAt: -1 });

export default mongoose.model('Order', orderSchema);
