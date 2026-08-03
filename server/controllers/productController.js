import Product from '../models/Product.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 50, search, category, sort, status, organic, freshToday, bestSeller, todaysPick, featured, minPrice, maxPrice } = req.query;
  const filter = {};

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { tags: { $regex: search, $options: 'i' } },
    ];
  }
  if (category) filter.category = category;
  if (status) filter.status = status;
  else filter.status = 'published'; // default: published only
  if (organic === 'true') filter.organic = true;
  if (freshToday === 'true') filter.freshToday = true;
  if (bestSeller === 'true') filter.bestSeller = true;
  if (todaysPick === 'true') filter.todaysPick = true;
  if (featured === 'true') filter.featured = true;
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  const sortObj = {};
  if (sort === 'price-low') sortObj.price = 1;
  else if (sort === 'price-high') sortObj.price = -1;
  else if (sort === 'rating') sortObj.rating = -1;
  else if (sort === 'name-asc') sortObj.name = 1;
  else if (sort === 'newest') sortObj.createdAt = -1;
  else if (sort === 'popularity') sortObj.reviewCount = -1;
  else sortObj.createdAt = -1;

  const skip = (Number(page) - 1) * Number(limit);
  const [products, total] = await Promise.all([
    Product.find(filter).sort(sortObj).skip(skip).limit(Number(limit)),
    Product.countDocuments(filter),
  ]);

  res.json(ApiResponse.paginated(products, total, Number(page), Number(limit)));
});

export const getProductsAll = asyncHandler(async (req, res) => {
  // Admin: get ALL products (all statuses)
  const { page = 1, limit = 50, search, category, sort, status } = req.query;
  const filter = {};
  if (search) filter.$or = [{ name: { $regex: search, $options: 'i' } }, { tags: { $regex: search, $options: 'i' } }];
  if (category) filter.category = category;
  if (status) filter.status = status;

  const sortObj = {};
  if (sort === 'price-low') sortObj.price = 1;
  else if (sort === 'price-high') sortObj.price = -1;
  else sortObj.createdAt = -1;

  const skip = (Number(page) - 1) * Number(limit);
  const [products, total] = await Promise.all([
    Product.find(filter).sort(sortObj).skip(skip).limit(Number(limit)),
    Product.countDocuments(filter),
  ]);

  res.json(ApiResponse.paginated(products, total, Number(page), Number(limit)));
});

export const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError(404, 'Product not found');
  res.json(ApiResponse.success(product));
});

export const createProduct = asyncHandler(async (req, res) => {
  const id = req.body._id || req.body.id || `prd_${Date.now().toString(36)}`;
  const product = await Product.create({ ...req.body, _id: id });
  res.status(201).json(ApiResponse.created(product, 'Product created'));
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!product) throw new ApiError(404, 'Product not found');
  res.json(ApiResponse.success(product, 'Product updated'));
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) throw new ApiError(404, 'Product not found');
  res.json(ApiResponse.success(null, 'Product deleted'));
});

export const getCategories = asyncHandler(async (req, res) => {
  const Category = (await import('../models/Category.js')).default;
  const categories = await Category.find({ visible: true }).sort({ order: 1 });
  res.json(ApiResponse.success(categories));
});

export const getAllCategories = asyncHandler(async (req, res) => {
  const Category = (await import('../models/Category.js')).default;
  const categories = await Category.find().sort({ order: 1 });
  res.json(ApiResponse.success(categories));
});

export const createCategory = asyncHandler(async (req, res) => {
  const Category = (await import('../models/Category.js')).default;
  const id = req.body._id || `cat_${Date.now().toString(36)}`;
  const category = await Category.create({ ...req.body, _id: id });
  res.status(201).json(ApiResponse.created(category, 'Category created'));
});

export const updateCategory = asyncHandler(async (req, res) => {
  const Category = (await import('../models/Category.js')).default;
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!category) throw new ApiError(404, 'Category not found');
  res.json(ApiResponse.success(category, 'Category updated'));
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const Category = (await import('../models/Category.js')).default;
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) throw new ApiError(404, 'Category not found');
  res.json(ApiResponse.success(null, 'Category deleted'));
});
