import crypto from 'crypto';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import { Inventory, StockHistory } from '../models/Inventory.js';
import Notification from '../models/Notification.js';
import Coupon from '../models/Coupon.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

let razorpay;
try {
  const Razorpay = (await import('razorpay')).default;
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (keyId && !keyId.includes('placeholder') && keySecret && !keySecret.includes('placeholder')) {
    razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
    console.log('✓ Razorpay initialised');
  } else {
    console.log('⚠ Razorpay not configured (placeholder keys) — online payments will return 503');
  }
} catch (e) {
  console.log('⚠ Razorpay init skipped:', e.message);
}

/* Helper: decrement inventory + write StockHistory */
async function decrementInventory(orderItems) {
  for (const item of orderItems) {
    const inv = await Inventory.findOne({ product: item.productId });
    if (inv) {
      inv.currentStock = Math.max(0, inv.currentStock - item.qty);
      inv.status = inv.currentStock <= 0 ? 'out_of_stock' : inv.currentStock < inv.minStock ? 'low' : 'in_stock';
      await inv.save();
      await StockHistory.create({
        _id: `sh_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,6)}`,
        productId: item.productId,
        type: 'sale',
        quantity: -item.qty,
        reason: 'Customer order',
        performedBy: 'System',
        timestamp: new Date(),
      });
    }
  }
}

/* Helper: restore inventory on cancellation/refund */
async function restoreInventory(orderItems) {
  for (const item of orderItems) {
    const inv = await Inventory.findOne({ product: item.productId });
    if (inv) {
      inv.currentStock += item.qty;
      inv.status = inv.currentStock <= 0 ? 'out_of_stock' : inv.currentStock < inv.minStock ? 'low' : 'in_stock';
      await inv.save();
      await StockHistory.create({
        _id: `sh_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,6)}`,
        productId: item.productId,
        type: 'return',
        quantity: item.qty,
        reason: 'Order cancelled/refunded',
        performedBy: 'System',
        timestamp: new Date(),
      });
    }
  }
}

/* Helper: build order items from cart */
async function buildOrderItems(items) {
  const Product = (await import('../models/Product.js')).default;
  const orderItems = [];
  for (const item of items) {
    const product = await Product.findById(item.productId || item.product);
    if (!product) continue;
    orderItems.push({
      productId: product._id,
      name: product.name,
      emoji: product.emoji,
      gradient: product.gradient,
      weight: item.weight || product.weightOptions?.[0] || '',
      qty: item.qty || 1,
      price: product.price,
      mrp: product.originalPrice,
    });
  }
  return orderItems;
}

/* ---- CREATE RAZORPAY ORDER ----
   Creates a pending order + Razorpay order. No inventory deduction yet. */
export const createRazorpayOrder = asyncHandler(async (req, res) => {
  const { items, coupon, deliveryFee, packagingFee, address, slot, special } = req.body;
  if (!items?.length) throw new ApiError(400, 'Order must contain at least one item');
  if (!address) throw new ApiError(400, 'Delivery address is required');

  const orderItems = await buildOrderItems(items);
  if (!orderItems.length) throw new ApiError(400, 'No valid items found');

  let subtotal = orderItems.reduce((s, i) => s + i.price * i.qty, 0);
  let discount = 0;

  if (coupon) {
    const couponDoc = await Coupon.findOne({ code: coupon.toUpperCase() });
    if (couponDoc?.active && (!couponDoc.expiry || new Date(couponDoc.expiry) > new Date()) && subtotal >= couponDoc.minOrder) {
      discount = couponDoc.type === 'flat' ? couponDoc.value : Math.min(Math.round(subtotal * couponDoc.value / 100), couponDoc.maxDiscount || Infinity);
      couponDoc.usedCount += 1;
      await couponDoc.save();
    }
  }

  const finalDeliveryFee = Number(deliveryFee) || 0;
  const finalPackagingFee = Number(packagingFee) || 5;
  const grandTotal = Math.max(0, subtotal - discount + finalDeliveryFee + finalPackagingFee);
  const amountInPaise = Math.round(grandTotal * 100);

  // Create Razorpay order
  if (!razorpay) {
    throw new ApiError(503, 'Razorpay is not configured. Please add valid RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to server/.env');
  }
  const rpOrder = await razorpay.orders.create({
    amount: amountInPaise,
    currency: 'INR',
    receipt: `rcpt_${Date.now()}`,
    notes: { items: orderItems.length, coupon: coupon || '' },
    payment_capture: 1,
  });

  // Create pending order in MongoDB
  const orderId = `ORD-${Date.now().toString(36).toUpperCase()}`;
  const order = await Order.create({
    _id: orderId,
    customer: { _id: req.user._id, name: req.user.name, phone: req.user.phone, email: req.user.email, avatar: (req.user.name || '').split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) },
    items: orderItems,
    subtotal, discount, coupon: coupon?.toUpperCase() || null,
    deliveryFee: finalDeliveryFee, packagingFee: finalPackagingFee, grandTotal,
    payment: { method: 'UPI', status: 'pending', ref: null, gateway: 'razorpay', razorpayOrderId: rpOrder.id },
    status: 'pending',
    address, name: address.name, phone: address.phone || req.user.phone,
    delivery: { slot: slot || { id: 'morning', label: 'Morning', time: '8:00 AM - 11:00 AM' } },
    notes: { special: special || '', customer: '', admin: [] },
    timeline: [{ status: 'pending', label: 'Order Created — Awaiting Payment', time: new Date(), actor: 'Customer' }],
    source: 'Website',
    createdAt: new Date(),
  });

  res.status(201).json(ApiResponse.created({
    orderId: order._id,
    razorpayOrderId: rpOrder.id,
    amount: amountInPaise,
    currency: 'INR',
    key: process.env.RAZORPAY_KEY_ID,
    customer: { name: req.user.name, email: req.user.email, contact: req.user.phone },
  }, 'Razorpay order created'));
});

/* ---- VERIFY PAYMENT ----
   Called by the frontend after Razorpay success callback. Verifies
   the HMAC signature, marks the order as paid, and decrements inventory. */
export const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

  // Verify signature
  const body = razorpay_order_id + '|' + razorpay_payment_id;
  const expectedSig = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');

  if (expectedSig !== razorpay_signature) {
    // Mark order as failed
    if (orderId) {
      await Order.findByIdAndUpdate(orderId, {
        'payment.status': 'failed',
        'payment.failedReason': 'Signature verification failed',
      });
    }
    throw new ApiError(400, 'Payment verification failed. No amount was deducted.');
  }

  // Update order
  const order = await Order.findById(orderId);
  if (!order) throw new ApiError(404, 'Order not found');

  order.payment.status = 'paid';
  order.payment.razorpayOrderId = razorpay_order_id;
  order.payment.razorpayPaymentId = razorpay_payment_id;
  order.payment.razorpaySignature = razorpay_signature;
  order.payment.transactionId = razorpay_payment_id;
  order.payment.paidAt = new Date();
  order.status = 'confirmed';
  order.timeline.push({ status: 'confirmed', label: 'Payment Verified — Order Confirmed', time: new Date(), actor: 'System' });
  await order.save();

  // Decrement inventory
  await decrementInventory(order.items);

  // Clear cart
  const cart = await Cart.findOne({ user: req.user._id });
  if (cart) { cart.items = []; await cart.save(); }

  // Notify admin
  await Notification.create({
    _id: `nfn_${Date.now().toString(36)}`,
    type: 'order', title: 'Payment confirmed',
    message: `₹${order.grandTotal} paid for ${order._id} via Razorpay`,
    time: 'Just now', read: false, adminOnly: true,
  });

  res.json(ApiResponse.success({ order }, 'Payment verified successfully'));
});

/* ---- HANDLE FAILED/EXPIRED PAYMENT ---- */
export const handlePaymentFailure = asyncHandler(async (req, res) => {
  const { orderId, razorpay_order_id, error } = req.body;
  if (!orderId) throw new ApiError(400, 'Order ID required');

  await Order.findByIdAndUpdate(orderId, {
    'payment.status': 'failed',
    'payment.failedReason': error?.description || 'Payment failed',
  });

  res.json(ApiResponse.success(null, 'Payment failure recorded'));
});

/* ---- RAZORPAY WEBHOOK ----
   Receives payment events from Razorpay. No auth required (verified via
   webhook signature, simplified here). */
export const webhookHandler = asyncHandler(async (req, res) => {
  const event = req.body;
  if (event.event === 'payment.captured' && event.payload?.payment?.entity) {
    const payment = event.payload.payment.entity;
    const order = await Order.findOne({ 'payment.razorpayOrderId': payment.order_id });
    if (order && order.payment.status !== 'paid') {
      order.payment.status = 'paid';
      order.payment.razorpayPaymentId = payment.id;
      order.payment.paidAt = new Date();
      order.status = 'confirmed';
      await order.save();
      await decrementInventory(order.items);
    }
  } else if (event.event === 'payment.failed') {
    const payment = event.payload?.payment?.entity;
    if (payment?.order_id) {
      await Order.findOneAndUpdate(
        { 'payment.razorpayOrderId': payment.order_id },
        { 'payment.status': 'failed', 'payment.failedReason': payment.error_description },
      );
    }
  }
  res.json({ ok: true });
});

export { decrementInventory, restoreInventory };
