import Review from '../models/Review.js';
import Product from '../models/Product.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getReviews = asyncHandler(async (req, res) => {
  const { product } = req.query;
  const filter = {};
  if (product) filter.product = product;
  const reviews = await Review.find(filter).sort({ createdAt: -1 });
  res.json(ApiResponse.success(reviews));
});

export const createReview = asyncHandler(async (req, res) => {
  const { productId, rating, comment } = req.body;
  if (!productId || !rating) throw new ApiError(400, 'Product and rating required');

  const id = `rev_${Date.now().toString(36)}`;
  const review = await Review.create({ _id: id, user: req.user._id, product: productId, rating, comment: comment || '' });

  // Update product rating
  const reviews = await Review.find({ product: productId });
  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  await Product.findByIdAndUpdate(productId, { rating: Math.round(avgRating * 10) / 10, reviewCount: reviews.length });

  res.status(201).json(ApiResponse.created(review, 'Review submitted'));
});

export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findByIdAndDelete(req.params.id);
  if (!review) throw new ApiError(404, 'Review not found');
  res.json(ApiResponse.success(null, 'Review deleted'));
});
