/* ====================================================================
   D.R.STORES — Coupons module configuration
   Type definitions, targets, and analytics helpers.
   Real coupon data comes from /api/coupons (MongoDB).
   ==================================================================== */

export const COUPON_TYPES = [
  { value: 'flat', label: 'Flat Discount' },
  { value: 'percent', label: 'Percentage Discount' },
]

export const couponTargets = [
  { value: 'all', label: 'All Customers' },
  { value: 'new', label: 'New Customers' },
  { value: 'regular', label: 'Regular Customers' },
  { value: 'premium', label: 'Premium Customers' },
  { value: 'vip', label: 'VIP Customers' },
]

/* Coupon usage analytics (daily for last 7 days) - placeholder structure */
export const couponAnalytics = [
  { date: '', used: 0, revenue: 0 },
]