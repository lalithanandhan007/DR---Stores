/* ====================================================================
   D.R.STORES — Activity Logs mock data
   Audit trail of every admin action. MongoDB-ready.
   ==================================================================== */

const d = (n) => new Date(Date.now() - n * 864e5).toISOString()
const h = (n) => new Date(Date.now() - n * 36e5).toISOString()
const mins = (m) => new Date(Date.now() - m * 6e4).toISOString()

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

export const activityLogs = [
  /* Recent (last few hours) */
  { _id: 'log_001', type: 'order', actor: 'System', action: 'New order received', detail: 'ORD-8473 from Priya Sharma · ₹687', timestamp: mins(2), severity: 'info' },
  { _id: 'log_002', type: 'order', actor: 'Ramesh Anandhan', action: 'Order accepted', detail: 'ORD-8472 accepted and sent to kitchen', timestamp: mins(8), severity: 'success' },
  { _id: 'log_003', type: 'inventory', actor: 'System', action: 'Low stock alert', detail: 'Baby Spinach dropped to 6 units (min: 15)', timestamp: mins(15), severity: 'warning' },
  { _id: 'log_004', type: 'login', actor: 'Ramesh Anandhan', action: 'Admin logged in', detail: 'From 103.21.58.12 · Chrome on Windows', timestamp: mins(25), severity: 'info' },
  { _id: 'log_005', type: 'delivery', actor: 'System', action: 'Delivery partner assigned', detail: 'Ravi Kumar assigned to ORD-8471', timestamp: mins(32), severity: 'info' },
  { _id: 'log_006', type: 'coupon', actor: 'Ramesh Anandhan', action: 'Coupon enabled', detail: 'HARVEST30 coupon activated (30% off, max ₹200)', timestamp: mins(45), severity: 'success' },

  /* Today */
  { _id: 'log_007', type: 'product', actor: 'Ramesh Anandhan', action: 'Product updated', detail: 'Sweet Carrot price changed ₹38 → ₹40', timestamp: h(2), severity: 'info' },
  { _id: 'log_008', type: 'customer', actor: 'System', action: 'New customer registered', detail: 'Vignesh Raja (vignesh.r@gmail.com)', timestamp: h(3), severity: 'info' },
  { _id: 'log_009', type: 'order', actor: 'System', action: 'Order delivered', detail: 'ORD-8473 delivered by Ravi Kumar', timestamp: h(3), severity: 'success' },
  { _id: 'log_010', type: 'inventory', actor: 'Ramesh Anandhan', action: 'Stock restocked', detail: 'Fresh Coriander +30 units', timestamp: h(4), severity: 'success' },
  { _id: 'log_011', type: 'delivery', actor: 'Sathish Babu', action: 'Delivery completed', detail: 'ORD-8469 delivered to Divya Krishnan · Rating: 5★', timestamp: h(4), severity: 'success' },
  { _id: 'log_012', type: 'order', actor: 'System', action: 'Order cancelled', detail: 'ORD-8468 cancelled by customer · Refund ₹893', timestamp: h(5), severity: 'warning' },
  { _id: 'log_013', type: 'system', actor: 'System', action: 'Automatic backup completed', detail: 'Daily backup saved · Size: 12.4 MB', timestamp: h(6), severity: 'info' },
  { _id: 'log_014', type: 'coupon', actor: 'System', action: 'Coupon expiring soon', detail: 'WELCOME50 expires in 3 days · 312 redemptions used', timestamp: h(8), severity: 'warning' },
  { _id: 'log_015', type: 'customer', actor: 'Ramesh Anandhan', action: 'Customer blocked', detail: 'Suresh Kumar blocked — repeated returns', timestamp: h(10), severity: 'warning' },
  { _id: 'log_016', type: 'product', actor: 'Ramesh Anandhan', action: 'Product created', detail: 'New product "Purple Cabbage" added to Leafy & Green', timestamp: h(12), severity: 'success' },

  /* Yesterday */
  { _id: 'log_017', type: 'login', actor: 'Ramesh Anandhan', action: 'Admin logged in', detail: 'From 103.21.58.12 · Chrome on Windows', timestamp: d(1), severity: 'info' },
  { _id: 'log_018', type: 'order', actor: 'System', action: 'Bulk orders received', detail: '42 orders received during evening rush', timestamp: d(1), severity: 'info' },
  { _id: 'log_019', type: 'inventory', actor: 'System', action: 'Out of stock alert', detail: 'Fresh Coriander reached 0 units — auto-reorder triggered', timestamp: d(1), severity: 'error' },
  { _id: 'log_020', type: 'settings', actor: 'Ramesh Anandhan', action: 'Settings updated', detail: 'Delivery radius changed 12km → 15km', timestamp: d(1), severity: 'info' },
  { _id: 'log_021', type: 'delivery', actor: 'System', action: 'Partner went offline', detail: 'Arun Prakash marked offline — shift ended', timestamp: d(1), severity: 'info' },
  { _id: 'log_022', type: 'customer', actor: 'System', action: 'Customer feedback received', detail: 'Anita Verma rated delivery 5★ with comment "Excellent freshness!"', timestamp: d(1), severity: 'success' },
  { _id: 'log_023', type: 'coupon', actor: 'Ramesh Anandhan', action: 'Coupon created', detail: 'MONSOON15 — 15% off up to ₹75', timestamp: d(2), severity: 'success' },
  { _id: 'log_024', type: 'product', actor: 'Ramesh Anandhan', action: 'Product archived', detail: 'Fresh Celery archived — low demand', timestamp: d(2), severity: 'info' },
  { _id: 'log_025', type: 'system', actor: 'System', action: 'System health check', detail: 'All services operational · Uptime: 99.98%', timestamp: d(3), severity: 'info' },
]

export const severityColors = {
  info: 'bg-blue-50 text-blue-600 border-blue-200',
  success: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  warning: 'bg-amber-50 text-amber-600 border-amber-200',
  error: 'bg-red-50 text-red-500 border-red-200',
}
