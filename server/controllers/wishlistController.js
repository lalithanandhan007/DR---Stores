import Wishlist from '../models/Wishlist.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getWishlist = asyncHandler(async (req, res) => {
  let wl = await Wishlist.findOne({ user: req.user._id }).populate('items.product');
  if (!wl) wl = await Wishlist.create({ _id: `wl_${req.user._id}`, user: req.user._id, items: [] });
  // Return items with product data flattened for frontend compatibility
  const items = wl.items.map((item) => {
    const p = item.product;
    if (!p) return null;
    return { ...p.toObject(), addedAt: item.addedAt, id: p._id, price: p.price, originalPrice: p.originalPrice };
  }).filter(Boolean);
  res.json(ApiResponse.success(items));
});

export const toggleWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  if (!productId) throw new ApiError(400, 'Product ID required');

  let wl = await Wishlist.findOne({ user: req.user._id });
  if (!wl) wl = await Wishlist.create({ _id: `wl_${req.user._id}`, user: req.user._id, items: [] });

  const idx = wl.items.findIndex((i) => i.product === productId);
  if (idx >= 0) {
    wl.items.splice(idx, 1);
  } else {
    wl.items.unshift({ product: productId, addedAt: new Date() });
  }
  await wl.save();

  // Return updated full items
  wl = await Wishlist.findOne({ user: req.user._id }).populate('items.product');
  const items = wl.items.map((item) => {
    const p = item.product;
    if (!p) return null;
    return { ...p.toObject(), addedAt: item.addedAt, id: p._id, price: p.price, originalPrice: p.originalPrice };
  }).filter(Boolean);
  res.json(ApiResponse.success(items));
});

export const removeFromWishlist = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const wl = await Wishlist.findOne({ user: req.user._id });
  if (wl) {
    wl.items = wl.items.filter((i) => i.product !== id);
    await wl.save();
  }
  res.json(ApiResponse.success(null, 'Removed from wishlist'));
});

export const clearWishlist = asyncHandler(async (req, res) => {
  const wl = await Wishlist.findOne({ user: req.user._id });
  if (wl) { wl.items = []; await wl.save(); }
  res.json(ApiResponse.success(null, 'Wishlist cleared'));
});
