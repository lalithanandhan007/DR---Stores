/* ====================================================================
   D.R.STORES — Admin Order configuration
   Status definitions, payment statuses, and meta helpers.
   Real order data comes from /api/orders (MongoDB).
   ==================================================================== */

/* ====================================================================
   Status configuration — drives every badge & filter across the app.
   ==================================================================== */
export const ORDER_STATUSES = [
  { value: 'pending', label: 'Pending', badge: 'bg-amber-50 text-amber-600 border-amber-200', dot: 'bg-amber-500', order: 0 },
  { value: 'accepted', label: 'Accepted', badge: 'bg-blue-50 text-blue-600 border-blue-200', dot: 'bg-blue-500', order: 1 },
  { value: 'preparing', label: 'Preparing', badge: 'bg-violet-50 text-violet-600 border-violet-200', dot: 'bg-violet-500', order: 2 },
  { value: 'packed', label: 'Packed', badge: 'bg-indigo-50 text-indigo-600 border-indigo-200', dot: 'bg-indigo-500', order: 3 },
  { value: 'out_for_delivery', label: 'Out For Delivery', badge: 'bg-primary/8 text-primary border-primary/15', dot: 'bg-primary', order: 4 },
  { value: 'delivered', label: 'Delivered', badge: 'bg-emerald-50 text-emerald-600 border-emerald-200', dot: 'bg-emerald-500', order: 5 },
  { value: 'cancelled', label: 'Cancelled', badge: 'bg-red-50 text-red-500 border-red-200', dot: 'bg-red-500', order: 6 },
  { value: 'refunded', label: 'Refunded', badge: 'bg-gray-100 text-gray-500 border-gray-200', dot: 'bg-gray-400', order: 7 },
]

export const PAYMENT_STATUSES = [
  { value: 'paid', label: 'Paid', badge: 'bg-emerald-50 text-emerald-600 border-emerald-200', dot: 'bg-emerald-500' },
  { value: 'pending', label: 'Pending', badge: 'bg-amber-50 text-amber-600 border-amber-200', dot: 'bg-amber-500' },
  { value: 'failed', label: 'Failed', badge: 'bg-red-50 text-red-500 border-red-200', dot: 'bg-red-500' },
  { value: 'refunded', label: 'Refunded', badge: 'bg-gray-100 text-gray-500 border-gray-200', dot: 'bg-gray-400' },
  { value: 'cod', label: 'Cash On Delivery', badge: 'bg-blue-50 text-blue-600 border-blue-200', dot: 'bg-blue-500' },
]

export const PAYMENT_METHODS = ['UPI', 'Card', 'NetBanking', 'Cash on Delivery']

export function getOrderStatusMeta(value) {
  return ORDER_STATUSES.find((s) => s.value === value) || ORDER_STATUSES[0]
}
export function getPaymentStatusMeta(value) {
  return PAYMENT_STATUSES.find((s) => s.value === value) || PAYMENT_STATUSES[0]
}