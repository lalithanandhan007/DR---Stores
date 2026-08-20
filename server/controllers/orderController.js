import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import { Inventory, StockHistory } from '../models/Inventory.js';
import Notification from '../models/Notification.js';
import ActivityLog from '../models/ActivityLog.js';
import Coupon from '../models/Coupon.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

export const placeOrder = asyncHandler(async (req, res) => {
  const { items, coupon, deliveryFee, packagingFee, address, slot, paymentMethod, special } = req.body;
  if (!items || items.length === 0) throw new ApiError(400, 'Order must contain at least one item');
  if (!address) throw new ApiError(400, 'Delivery address is required');

  let subtotal = 0;
  let discount = 0;
  const orderItems = [];

  for (const item of items) {
    const product = await (await import('../models/Product.js')).default.findById(item.productId || item.product);
    const inventory = await Inventory.findOne({
      product: item.productId || item.product
    });

    if (!inventory || inventory.currentStock < (item.qty || 1)) {
      throw new ApiError(
        400,
        `${product?.name || 'Product'} does not have enough stock`
      );
    }
    
    if (!product) continue;
    const selectedWeight = item.weight || product.weightOptions?.[0] || '';

    const selectedVariant = product.variants?.find(
      (variant) => variant.weight === selectedWeight
);

    const price = selectedVariant?.price ?? product.price;
    const mrp = selectedVariant?.originalPrice ?? product.originalPrice;
    const qty = item.qty || 1;
    subtotal += price * qty;
    orderItems.push({
      productId: product._id,
      name: product.name,
      emoji: product.emoji,
      gradient: product.gradient,
      weight: selectedWeight,
      qty,
      price,
      mrp,
    });
  }

  // Coupon validation
  if (coupon) {
    const couponDoc = await Coupon.findOne({ code: coupon.toUpperCase() });
    if (couponDoc && couponDoc.active && (!couponDoc.expiry || new Date(couponDoc.expiry) > new Date())) {
      if (subtotal >= couponDoc.minOrder) {
        discount = couponDoc.type === 'flat' ? couponDoc.value : Math.min(Math.round(subtotal * couponDoc.value / 100), couponDoc.maxDiscount || Infinity);
        couponDoc.usedCount += 1;
        await couponDoc.save();
      }
    }
  }

  const finalDeliveryFee = Number(deliveryFee) || 0;
  const finalPackagingFee = Number(packagingFee) || 5;
  const grandTotal = Math.max(0, subtotal - discount + finalDeliveryFee + finalPackagingFee);

  const orderId = `ORD-${Date.now().toString(36).toUpperCase()}`;
  const order = await Order.create({
    _id: orderId,
    customer: { _id: req.user._id, name: req.user.name, phone: req.user.phone, email: req.user.email, avatar: req.user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) },
    items: orderItems,
    subtotal,
    discount,
    coupon: coupon?.toUpperCase() || null,
    deliveryFee: finalDeliveryFee,
    packagingFee: finalPackagingFee,
    grandTotal,
    payment: { method: paymentMethod || 'UPI', status: paymentMethod === 'Cash on Delivery' ? 'cod' : 'paid', ref: null },
    status: 'confirmed',
    address,
    name: address.name,
    phone: address.phone || req.user.phone,
    delivery: { slot: slot || { id: 'morning', label: 'Morning', time: '8:00 AM - 11:00 AM' } },
    notes: { special: special || '', customer: '', admin: [] },
    timeline: [{ status: 'confirmed', label: 'Order Placed', time: new Date(), actor: 'Customer' }],
    source: 'Mobile App',
    createdAt: new Date(),
  });

  // Decrement inventory + log stock history (COD: immediate deduction)
  for (const item of orderItems) {
    const inv = await Inventory.findOne({ product: item.productId });
    if (inv) {
      inv.currentStock = Math.max(0, inv.currentStock - item.qty);
      inv.status = inv.currentStock <= 0 ? 'out_of_stock' : inv.currentStock < inv.minStock ? 'low' : 'in_stock';
      await inv.save();
      await StockHistory.create({
        _id: `sh_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,6)}`,
        productId: item.productId, type: 'sale', quantity: -item.qty,
        reason: 'Customer order (COD)', performedBy: 'System', timestamp: new Date(),
      });
    }
  }

  // Clear cart
  const cart = await Cart.findOne({ user: req.user._id });
  if (cart) { cart.items = []; await cart.save(); }

  // Notify admin
  await Notification.create({
    _id: `nfn_${Date.now().toString(36)}`,
    type: 'order',
    title: 'New order placed',
    message: `${req.user.name} ordered ${orderItems.length} items · ₹${grandTotal}`,
    time: 'Just now',
    read: false,
    adminOnly: true,
  });

  res.status(201).json(ApiResponse.created(order, 'Order placed successfully'));
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ 'customer._id': req.user._id }).sort({ createdAt: -1 });
  res.json(ApiResponse.success(orders));
});

export const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new ApiError(404, 'Order not found');
  res.json(ApiResponse.success(order));
});

export const getAllOrders = asyncHandler(async (req, res) => {
  const { status, search, page = 1, limit = 50 } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (search) filter.$or = [{ _id: { $regex: search, $options: 'i' } }, { 'customer.name': { $regex: search, $options: 'i' } }];

  const skip = (Number(page) - 1) * Number(limit);
  const [orders, total] = await Promise.all([
    Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Order.countDocuments(filter),
  ]);

  res.json(ApiResponse.paginated(orders, total, Number(page), Number(limit)));
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, note } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) throw new ApiError(404, 'Order not found');

  const stepLabels = {
    accepted: 'Order Accepted', preparing: 'Preparing Items', packed: 'Order Packed',
    out_for_delivery: 'Out for Delivery', delivered: 'Delivered', cancelled: 'Order Cancelled',
    refunded: 'Payment Refunded',
  };

  order.status = status;
  order.timeline.push({
    status, label: stepLabels[status] || status, note: note || undefined,
    time: new Date(), actor: 'Store',
  });

  if (status === 'delivered') {
    order.delivery.deliveredAt = new Date();
  }

  // Restore inventory on cancellation or refund
  if (status === 'cancelled' || status === 'refunded') {
    for (const item of (order.items || [])) {
      const inv = await Inventory.findOne({ product: item.productId });
      if (inv) {
        inv.currentStock += item.qty;
        inv.status = inv.currentStock <= 0 ? 'out_of_stock' : inv.currentStock < inv.minStock ? 'low' : 'in_stock';
        await inv.save();
        await StockHistory.create({
          _id: `sh_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,6)}`,
          productId: item.productId, type: 'return', quantity: item.qty,
          reason: status === 'refunded' ? 'Order refunded' : 'Order cancelled',
          performedBy: req.user?.name || 'Store', timestamp: new Date(),
        });
      }
    }
    // Update payment status if it was paid
    if (order.payment?.status === 'paid' || order.payment?.status === 'cod') {
      order.payment.status = status === 'refunded' ? 'refunded' : 'failed';
    }
  }

  await order.save();
  res.json(ApiResponse.success(order, 'Order status updated'));
});

export const assignPartner = asyncHandler(async (req, res) => {
  const { partner, etaMinutes, dispatch } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) throw new ApiError(404, 'Order not found');

  order.partner = partner;
  order.delivery.expectedAt = new Date(Date.now() + (etaMinutes || 30) * 60000);
  if (dispatch) {
    order.status = 'out_for_delivery';
    order.timeline.push({ status: 'out_for_delivery', label: 'Out for Delivery', note: `Handed over to ${partner.name}`, time: new Date(), actor: 'Store' });
  }

  await order.save();
  res.json(ApiResponse.success(order, 'Partner assigned'));
});

export const addOrderNote = asyncHandler(async (req, res) => {
  const { text } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) throw new ApiError(404, 'Order not found');

  if (!order.notes) order.notes = { admin: [], customer: '', special: '' };
  order.notes.admin = [...(order.notes.admin || []), text];
  await order.save();

  res.json(ApiResponse.success(order, 'Note added'));
});

export const bulkStatus = asyncHandler(async (req, res) => {
  const { ids, status } = req.body;
  if (!ids?.length || !status) throw new ApiError(400, 'IDs and status required');

  const stepLabels = { accepted: 'Order Accepted', preparing: 'Preparing Items', delivered: 'Delivered', cancelled: 'Order Cancelled' };

  await Order.updateMany({ _id: { $in: ids } }, {
    $set: { status },
    $push: { timeline: { status, label: stepLabels[status] || status, time: new Date(), actor: 'Store' } },
  });

  res.json(ApiResponse.success(null, `${ids.length} orders updated`));
});

export const deleteOrders = asyncHandler(async (req, res) => {
  const { ids } = req.body;
  if (!ids?.length) throw new ApiError(400, 'IDs required');
  await Order.deleteMany({ _id: { $in: ids } });
  res.json(ApiResponse.success(null, 'Orders deleted'));
});
