import Address from '../models/Address.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getAddresses = asyncHandler(async (req, res) => {
  const addresses = await Address.find({ user: req.user._id });
  res.json(ApiResponse.success(addresses));
});

export const createAddress = asyncHandler(async (req, res) => {
  const id = `addr_${Date.now().toString(36)}`;
  if (req.body.isDefault) await Address.updateMany({ user: req.user._id }, { isDefault: false });
  const address = await Address.create({ ...req.body, _id: id, user: req.user._id });
  res.status(201).json(ApiResponse.created(address));
});

export const updateAddress = asyncHandler(async (req, res) => {
  const address = await Address.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, req.body, { new: true });
  if (!address) throw new ApiError(404, 'Address not found');
  res.json(ApiResponse.success(address));
});

export const deleteAddress = asyncHandler(async (req, res) => {
  const address = await Address.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!address) throw new ApiError(404, 'Address not found');
  res.json(ApiResponse.success(null, 'Address deleted'));
});

export const setDefaultAddress = asyncHandler(async (req, res) => {
  await Address.updateMany({ user: req.user._id }, { isDefault: false });
  const address = await Address.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, { isDefault: true }, { new: true });
  if (!address) throw new ApiError(404, 'Address not found');
  res.json(ApiResponse.success(address));
});
