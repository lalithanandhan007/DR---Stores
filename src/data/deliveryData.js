/* ====================================================================
   D.R.STORES — Delivery Partners module configuration
   Status definitions and meta helpers for delivery display.
   Real delivery partner data comes from /api/delivery-partners (MongoDB).
   ==================================================================== */

export const DELIVERY_STATUSES = [
  { value: 'online', label: 'Online', badge: 'bg-emerald-50 text-emerald-600 border-emerald-200', dot: 'bg-emerald-500' },
  { value: 'offline', label: 'Offline', badge: 'bg-gray-100 text-gray-500 border-gray-200', dot: 'bg-gray-400' },
  { value: 'on_delivery', label: 'On Delivery', badge: 'bg-primary/8 text-primary border-primary/15', dot: 'bg-primary' },
]

export function getDeliveryStatusMeta(value) {
  return DELIVERY_STATUSES.find((s) => s.value === value) || DELIVERY_STATUSES[1]
}