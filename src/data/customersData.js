/* ====================================================================
   D.R.STORES — Customer module configuration
   Tag definitions and meta helpers for customer display.
   Real customer data comes from /api/users/customers (MongoDB).
   ==================================================================== */

export const CUSTOMER_TAGS = [
  { value: 'vip', label: 'VIP', badge: 'bg-amber-50 text-amber-600 border-amber-200', dot: 'bg-amber-500' },
  { value: 'premium', label: 'Premium', badge: 'bg-violet-50 text-violet-600 border-violet-200', dot: 'bg-violet-500' },
  { value: 'regular', label: 'Regular', badge: 'bg-emerald-50 text-emerald-600 border-emerald-200', dot: 'bg-emerald-500' },
  { value: 'new', label: 'New', badge: 'bg-blue-50 text-blue-600 border-blue-200', dot: 'bg-blue-500' },
]

export function getCustomerTagMeta(value) {
  return CUSTOMER_TAGS.find((t) => t.value === value) || CUSTOMER_TAGS[2]
}