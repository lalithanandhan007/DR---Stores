import DeliveryPartner from '../models/DeliveryPartner.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getPartners = asyncHandler(async (req, res) => {
  const partners = await DeliveryPartner.find().sort({ rating: -1 });
  res.json(ApiResponse.success(partners));
});

export const getPartner = asyncHandler(async (req, res) => {
  const partner = await DeliveryPartner.findById(req.params.id);
  if (!partner) throw new ApiError(404, 'Partner not found');
  res.json(ApiResponse.success(partner));
});

export const createPartner = asyncHandler(async (req, res) => {
  const id = req.body._id || `dp_${Date.now().toString(36)}`;
  const partner = await DeliveryPartner.create({ ...req.body, _id: id });
  res.status(201).json(ApiResponse.created(partner, 'Partner added'));
});

export const updatePartner = asyncHandler(async (req, res) => {
  const partner = await DeliveryPartner.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!partner) throw new ApiError(404, 'Partner not found');
  res.json(ApiResponse.success(partner, 'Partner updated'));
});

export const toggleOnline = asyncHandler(async (req, res) => {
  const partner = await DeliveryPartner.findById(req.params.id);
  if (!partner) throw new ApiError(404, 'Partner not found');
  partner.status = partner.status === 'online' ? 'offline' : 'online';
  await partner.save();
  res.json(ApiResponse.success(partner));
});

export const deletePartners = asyncHandler(async (req, res) => {
  const { ids } = req.body;
  if (!ids?.length) throw new ApiError(400, 'IDs required');
  await DeliveryPartner.deleteMany({ _id: { $in: ids } });
  res.json(ApiResponse.success(null, 'Partners removed'));
});
