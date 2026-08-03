import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = await Cart.create({ _id: `cart_${req.user._id}`, user: req.user._id, items: [] });
  res.json(ApiResponse.success(cart));
});

export const addToCart = asyncHandler(async (req, res) => {
  const { productId, weight, qty = 1 } = req.body;
  if (!productId) throw new ApiError(400, 'Product ID is required');

  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, 'Product not found');

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = await Cart.create({ _id: `cart_${req.user._id}`, user: req.user._id, items: [] });

  const key = `${productId}-${weight || ''}`;
  const existingIdx = cart.items.findIndex((i) => `${i.product}-${i.weight}` === key);

  if (existingIdx >= 0) {
    cart.items[existingIdx].qty += Number(qty);
  } else {
    cart.items.push({
      product: product._id,
      productName: product.name,
      emoji: product.emoji,
      weight: weight || product.weightOptions?.[0] || '',
      qty: Number(qty),
      price: product.price,
      originalPrice: product.originalPrice,
      gradient: product.gradient,
    });
  }

  await cart.save();
  res.json(ApiResponse.success(cart, 'Item added to cart'));
});

export const updateCartItem = asyncHandler(async (req, res) => {
  const { key, qty } = req.body;
  if (!key || qty === undefined) throw new ApiError(400, 'Key and qty are required');

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) throw new ApiError(404, 'Cart not found');

  const idx = cart.items.findIndex((i) => `${i.product}-${i.weight}` === key);
  if (idx === -1) throw new ApiError(404, 'Item not in cart');

  if (Number(qty) <= 0) {
    cart.items.splice(idx, 1);
  } else {
    cart.items[idx].qty = Number(qty);
  }

  await cart.save();
  res.json(ApiResponse.success(cart, 'Cart updated'));
});

export const removeFromCart = asyncHandler(async (req, res) => {
  const { key } = req.params;
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) throw new ApiError(404, 'Cart not found');

  const idx = cart.items.findIndex((i) => `${i.product}-${i.weight}` === key);
  if (idx === -1) throw new ApiError(404, 'Item not in cart');

  cart.items.splice(idx, 1);
  await cart.save();
  res.json(ApiResponse.success(cart, 'Item removed'));
});

export const clearCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (cart) {
    cart.items = [];
    await cart.save();
  }
  res.json(ApiResponse.success(null, 'Cart cleared'));
});
