import User from '../models/User.js';
import Order from '../models/Order.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getCustomers = asyncHandler(async (req, res) => {
  const { search, tag, status, page = 1, limit = 50 } = req.query;
  const filter = { role: 'customer' };
  if (search) filter.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }, { phone: { $regex: search, $options: 'i' } }];
  if (tag) filter.tag = tag;
  if (status === 'blocked') filter.blocked = true;
  if (status === 'active') filter.blocked = false;

  const skip = (Number(page) - 1) * Number(limit);
  const [users, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    User.countDocuments(filter),
  ]);

  // Enrich with order stats
  const customers = await Promise.all(users.map(async (u) => {
    const [totalOrders, deliveredOrders, lifetimeSpend] = await Promise.all([
      Order.countDocuments({ 'customer._id': u._id }),
      Order.countDocuments({ 'customer._id': u._id, status: 'delivered' }),
      Order.aggregate([
        { $match: { 'customer._id': u._id, status: 'delivered' } },
        { $group: { _id: null, total: { $sum: '$grandTotal' } } },
      ]),
    ]);
    return {
      _id: u._id, name: u.name, phone: u.phone, email: u.email, avatar: (u.name || '').split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2),
      tag: u.tag, blocked: u.blocked, joinedAt: u.joinedAt, lastActiveAt: u.lastActiveAt, notes: u.notes,
      wishlist: [], totalOrders, lifetimeSpend: lifetimeSpend[0]?.total || 0,
      avgOrderValue: totalOrders ? Math.round((lifetimeSpend[0]?.total || 0) / totalOrders) : 0,
    };
  }));

  res.json(ApiResponse.paginated(customers, total, Number(page), Number(limit)));
});

export const getCustomer = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'Customer not found');

  const orders = await Order.find({ 'customer._id': user._id }).sort({ createdAt: -1 });
  const totalOrders = orders.length;
  const lifetimeSpend = orders.filter((o) => o.status === 'delivered').reduce((s, o) => s + o.grandTotal, 0);

  res.json(ApiResponse.success({
    _id: user._id, name: user.name, phone: user.phone, email: user.email,
    avatar: (user.name || '').split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2),
    tag: user.tag, blocked: user.blocked, joinedAt: user.joinedAt, lastActiveAt: user.lastActiveAt,
    notes: user.notes, wishlist: [],
    totalOrders, lifetimeSpend, avgOrderValue: totalOrders ? Math.round(lifetimeSpend / totalOrders) : 0,
    orders,
  }));
});

export const updateCustomer = asyncHandler(async (req, res) => {
  const { tag, blocked, notes } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'Customer not found');

  if (tag !== undefined) user.tag = tag;
  if (blocked !== undefined) user.blocked = blocked;
  if (notes !== undefined) user.notes = notes;
  await user.save();

  res.json(ApiResponse.success({ user }, 'Customer updated'));
});

export const addCustomerNote = asyncHandler(async (req, res) => {
  const { text } = req.body;
  if (!text?.trim()) throw new ApiError(400, 'Note text required');
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'Customer not found');
  user.notes = [...(user.notes || []), text.trim()];
  await user.save();
  res.json(ApiResponse.success({ notes: user.notes }, 'Note added'));
});

export const deleteCustomers = asyncHandler(async (req, res) => {
  const { ids } = req.body;
  if (!ids?.length) throw new ApiError(400, 'IDs required');
  await User.deleteMany({ _id: { $in: ids } });
  res.json(ApiResponse.success(null, 'Customers deleted'));
});
