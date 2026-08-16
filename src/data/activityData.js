/* ====================================================================
   D.R.STORES — Activity Logs configuration
   Type definitions and meta helpers for activity log display.
   Real activity data comes from /api/admin/activity (MongoDB).
   ==================================================================== */

export const ACTIVITY_TYPES = [
  { value: 'login', label: 'Admin Login', icon: 'user', color: 'bg-blue-50 text-blue-600' },
  { value: 'product', label: 'Product Update', icon: 'shoppingBag', color: 'bg-emerald-50 text-emerald-600' },
  { value: 'inventory', label: 'Inventory Update', icon: 'box', color: 'bg-amber-50 text-amber-600' },
  { value: 'customer', label: 'Customer Action', icon: 'users', color: 'bg-violet-50 text-violet-600' },
  { value: 'order', label: 'Order Update', icon: 'clipboard', color: 'bg-primary/10 text-primary' },
  { value: 'coupon', label: 'Coupon Update', icon: 'ticket', color: 'bg-accent/10 text-accent' },
  { value: 'delivery', label: 'Delivery Update', icon: 'truck', color: 'bg-indigo-50 text-indigo-600' },
  { value: 'settings', label: 'Settings Change', icon: 'settings', color: 'bg-gray-100 text-gray-600' },
  { value: 'system', label: 'System Event', icon: 'alert', color: 'bg-red-50 text-red-500' },
]

export function getActivityTypeMeta(value) {
  return ACTIVITY_TYPES.find((t) => t.value === value) || ACTIVITY_TYPES[0]
}

export const severityColors = {
  info: 'bg-blue-50 text-blue-600 border-blue-100',
  success: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  warning: 'bg-amber-50 text-amber-600 border-amber-100',
  error: 'bg-red-50 text-red-600 border-red-100',
}