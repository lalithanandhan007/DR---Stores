/* ====================================================================
   D.R.STORES — Coupons module mock data
   Each coupon is a full document ready for MongoDB swap.
   ==================================================================== */

const d = (n) => new Date(Date.now() - n * 864e5).toISOString()
const daysFuture = (n) => new Date(Date.now() + n * 864e5).toISOString()

export const COUPON_TYPES = [
  { value: 'flat', label: 'Flat Discount' },
  { value: 'percent', label: 'Percentage Discount' },
]

export const coupons = [
  {
    _id: 'cpn_001', code: 'WELCOME50', type: 'flat', value: 50, maxDiscount: null,
    minOrder: 150, usageLimit: 500, usedCount: 312,
    expiry: daysFuture(30), active: true,
    description: 'Flat ₹50 off on orders above ₹150',
    target: 'all', // all | new | vip | specific
    createdBy: 'adm_001',
    createdAt: d(60),
  },
  {
    _id: 'cpn_002', code: 'FIRSTORDER', type: 'percent', value: 15, maxDiscount: 75,
    minOrder: 200, usageLimit: 1000, usedCount: 428,
    expiry: daysFuture(90), active: true,
    description: '15% off up to ₹75 on first order',
    target: 'new',
    createdBy: 'adm_001',
    createdAt: d(90),
  },
  {
    _id: 'cpn_003', code: 'FRESH100', type: 'flat', value: 100, maxDiscount: null,
    minOrder: 500, usageLimit: 200, usedCount: 178,
    expiry: daysFuture(7), active: true,
    description: '₹100 off on orders above ₹500',
    target: 'all',
    createdBy: 'adm_001',
    createdAt: d(14),
  },
  {
    _id: 'cpn_004', code: 'SAVE20', type: 'percent', value: 20, maxDiscount: 100,
    minOrder: 300, usageLimit: 300, usedCount: 145,
    expiry: daysFuture(45), active: true,
    description: '20% off up to ₹100',
    target: 'vip',
    createdBy: 'adm_001',
    createdAt: d(30),
  },
  {
    _id: 'cpn_005', code: 'DR10', type: 'flat', value: 10, maxDiscount: null,
    minOrder: 0, usageLimit: 10000, usedCount: 8734,
    expiry: daysFuture(180), active: true,
    description: '₹10 off — no minimum order',
    target: 'all',
    createdBy: 'adm_001',
    createdAt: d(120),
  },
  {
    _id: 'cpn_006', code: 'SUMMER25', type: 'percent', value: 25, maxDiscount: 150,
    minOrder: 400, usageLimit: 150, usedCount: 150,
    expiry: d(5), active: false,
    description: '25% off up to ₹150 — Summer special',
    target: 'all',
    createdBy: 'adm_001',
    createdAt: d(30),
  },
  {
    _id: 'cpn_007', code: 'VIP200', type: 'flat', value: 200, maxDiscount: null,
    minOrder: 1000, usageLimit: 50, usedCount: 18,
    expiry: daysFuture(60), active: true,
    description: 'Flat ₹200 off for VIP members on orders above ₹1000',
    target: 'vip',
    createdBy: 'adm_001',
    createdAt: d(20),
  },
  {
    _id: 'cpn_008', code: 'MONSOON15', type: 'percent', value: 15, maxDiscount: 75,
    minOrder: 250, usageLimit: 500, usedCount: 0,
    expiry: daysFuture(30), active: false,
    description: '15% off up to ₹75 — Monsoon season offer',
    target: 'all',
    createdBy: 'adm_001',
    createdAt: d(2),
  },
  {
    _id: 'cpn_009', code: 'FREESHIP', type: 'flat', value: 30, maxDiscount: null,
    minOrder: 100, usageLimit: 2000, usedCount: 1204,
    expiry: daysFuture(120), active: true,
    description: 'Free delivery (₹30 off) on orders above ₹100',
    target: 'all',
    createdBy: 'adm_001',
    createdAt: d(90),
  },
  {
    _id: 'cpn_010', code: 'HARVEST30', type: 'percent', value: 30, maxDiscount: 200,
    minOrder: 800, usageLimit: 100, usedCount: 67,
    expiry: daysFuture(14), active: true,
    description: '30% off up to ₹200 — Harvest festival special',
    target: 'premium',
    createdBy: 'adm_001',
    createdAt: d(7),
  },
]

export const couponTargets = [
  { value: 'all', label: 'All Customers' },
  { value: 'new', label: 'New Customers' },
  { value: 'regular', label: 'Regular Customers' },
  { value: 'premium', label: 'Premium Customers' },
  { value: 'vip', label: 'VIP Customers' },
]

/* Coupon usage analytics (daily for last 7 days) */
export const couponAnalytics = [
  { date: d(6), used: 18, revenue: 12400 },
  { date: d(5), used: 24, revenue: 16800 },
  { date: d(4), used: 21, revenue: 14200 },
  { date: d(3), used: 31, revenue: 22100 },
  { date: d(2), used: 28, revenue: 19500 },
  { date: d(1), used: 35, revenue: 25800 },
  { date: d(0), used: 42, revenue: 31200 },
]
