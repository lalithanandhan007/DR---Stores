import { Inventory, StockHistory } from '../models/Inventory.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getInventory = asyncHandler(async (req, res) => {
  const { status, search } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (search) filter.$or = [{ productName: { $regex: search, $options: 'i' } }, { sku: { $regex: search, $options: 'i' } }];
  const items = await Inventory.find(filter).sort({ currentStock: 1 });
  res.json(ApiResponse.success(items));
});

export const restock = asyncHandler(async (req, res) => {
  const { qty } = req.body;
  if (!qty || qty <= 0) throw new ApiError(400, 'Quantity must be positive');

  const item = await Inventory.findById(req.params.id);
  if (!item) throw new ApiError(404, 'Inventory item not found');

  item.currentStock += Number(qty);
  item.status = item.currentStock <= 0 ? 'out_of_stock' : item.currentStock < item.minStock ? 'low' : 'in_stock';
  item.lastRestocked = new Date();
  await item.save();

  await StockHistory.create({
    _id: `sh_${Date.now().toString(36)}`,
    productId: item.productName,
    type: 'restock',
    quantity: Number(qty),
    reason: 'Manual restock',
    performedBy: req.user?.name || 'Admin',
    timestamp: new Date(),
  });

  res.json(ApiResponse.success(item, 'Stock restocked'));
});

export const bulkRestock = asyncHandler(async (req, res) => {
  const { ids, qty } = req.body;
  if (!ids?.length || !qty) throw new ApiError(400, 'IDs and quantity required');

  await Inventory.updateMany({ _id: { $in: ids } }, {
    $inc: { currentStock: Number(qty) },
    $set: { lastRestocked: new Date() },
  });

  // Update status
  const items = await Inventory.find({ _id: { $in: ids } });
  for (const item of items) {
    item.status = item.currentStock <= 0 ? 'out_of_stock' : item.currentStock < item.minStock ? 'low' : 'in_stock';
    await item.save();
  }

  res.json(ApiResponse.success(null, `${ids.length} items restocked by ${qty} units`));
});

export const adjustStock = asyncHandler(async (req, res) => {
  const { qty, reason } = req.body;
  const item = await Inventory.findById(req.params.id);
  if (!item) throw new ApiError(404, 'Inventory item not found');

  item.currentStock = Math.max(0, item.currentStock + Number(qty));
  item.status = item.currentStock <= 0 ? 'out_of_stock' : item.currentStock < item.minStock ? 'low' : 'in_stock';
  await item.save();

  await StockHistory.create({
    _id: `sh_${Date.now().toString(36)}`,
    productId: item.productName,
    type: Number(qty) > 0 ? 'manual' : 'damaged',
    quantity: Number(qty),
    reason: reason || 'Manual adjustment',
    performedBy: req.user?.name || 'Admin',
    timestamp: new Date(),
  });

  res.json(ApiResponse.success(item, 'Stock adjusted'));
});

export const getStockHistory = asyncHandler(async (req, res) => {
  const history = await StockHistory.find().sort({ timestamp: -1 }).limit(200);
  res.json(ApiResponse.success(history));
});
