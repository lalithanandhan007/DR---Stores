import Coupon from '../models/Coupon.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

export const validateCoupon = asyncHandler(async (req, res) => {
  const { code, subtotal } = req.body;
  if (!code) throw new ApiError(400, 'Coupon code is required');

  const coupon = await Coupon.findOne({ code: code.toUpperCase() });
  if (!coupon) throw new ApiError(404, 'Invalid coupon code');
  if (!coupon.active) throw new ApiError(400, 'This coupon is no longer active');
  if (coupon.expiry && new Date(coupon.expiry) < new Date()) throw new ApiError(400, 'This coupon has expired');
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) throw new ApiError(400, 'This coupon has reached its usage limit');
  if (subtotal && subtotal < coupon.minOrder) throw new ApiError(400, `Minimum order ₹${coupon.minOrder} required`);

  res.json(ApiResponse.success(coupon, 'Coupon applied successfully'));
});

export const getCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 });
  res.json(ApiResponse.success(coupons));
});

export const createCoupon = asyncHandler(async (req, res) => {
  const id = req.body._id || `cpn_${Date.now().toString(36)}`;
  const coupon = await Coupon.create({ ...req.body, _id: id });
  res.status(201).json(ApiResponse.created(coupon, 'Coupon created'));
});

export const updateCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!coupon) throw new ApiError(404, 'Coupon not found');
  res.json(ApiResponse.success(coupon, 'Coupon updated'));
});

export const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id);
  if (!coupon) throw new ApiError(404, 'Coupon not found');
  res.json(ApiResponse.success(null, 'Coupon deleted'));
});
