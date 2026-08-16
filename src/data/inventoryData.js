/* ====================================================================
   D.R.STORES — Inventory module configuration
   Status definitions and meta helpers for inventory display.
   Real inventory data comes from /api/inventory (MongoDB).
   ==================================================================== */

export const INVENTORY_STATUSES = [
  { value: 'in_stock', label: 'In Stock', badge: 'bg-emerald-50 text-emerald-600 border-emerald-200', dot: 'bg-emerald-500' },
  { value: 'low', label: 'Low Stock', badge: 'bg-amber-50 text-amber-600 border-amber-200', dot: 'bg-amber-500' },
  { value: 'out_of_stock', label: 'Out of Stock', badge: 'bg-red-50 text-red-500 border-red-200', dot: 'bg-red-500' },
]

export function getInventoryStatusMeta(value) {
  return INVENTORY_STATUSES.find((s) => s.value === value) || INVENTORY_STATUSES[0]
}