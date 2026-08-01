/* ====================================================================
   D.R.STORES — Inventory module mock data
   Extends the product catalog with stock-management fields:
   reserved, incoming, lastRestocked, expiry. A stockHistory log
   captures every adjustment. MongoDB-ready.
   ==================================================================== */

import { adminProducts } from './productsData'

const d = (n) => new Date(Date.now() - n * 864e5).toISOString()
const h = (n) => new Date(Date.now() - n * 36e5).toISOString()

/* Build inventory records from the existing product catalog. */
export const inventory = adminProducts
  .filter((p) => p.status !== 'archived' && p.status !== 'hidden')
  .map((p, i) => ({
    _id: `INV-${String(i + 1).padStart(3, '0')}`,
    productId: p._id,
    productName: p.name,
    emoji: p.emoji,
    gradient: p.gradient,
    category: p.category,
    sku: p.sku,
    barcode: p.barcode,
    currentStock: p.stock,
    minStock: p.minStock,
    reservedStock: Math.min(Math.floor(p.stock * 0.08), 10),
    incomingStock: i % 3 === 0 ? 0 : (i % 3 === 1 ? 40 : 80),
    unit: p.weightOptions?.[0] || '1kg',
    costPrice: Math.round(p.sellingPrice * 0.65),
    sellingPrice: p.sellingPrice,
    lastRestocked: d(Math.floor(Math.random() * 14) + 1),
    expiry: i % 4 === 0 ? d(-3) : i % 5 === 0 ? h(-6) : h(-(24 + Math.floor(Math.random() * 72))),
    status: p.stock <= 0 ? 'out_of_stock' : p.stock < p.minStock ? 'low' : 'in_stock',
    updatedAt: p.updatedAt,
  }))

export const INVENTORY_STATUSES = [
  { value: 'in_stock', label: 'In Stock', badge: 'bg-emerald-50 text-emerald-600 border-emerald-200', dot: 'bg-emerald-500' },
  { value: 'low', label: 'Low Stock', badge: 'bg-amber-50 text-amber-600 border-amber-200', dot: 'bg-amber-500' },
  { value: 'out_of_stock', label: 'Out of Stock', badge: 'bg-red-50 text-red-500 border-red-200', dot: 'bg-red-500' },
]

export function getInventoryStatusMeta(value) {
  return INVENTORY_STATUSES.find((s) => s.value === value) || INVENTORY_STATUSES[0]
}

/* Stock adjustment history log */
const ADJUSTMENT_TYPES = ['restock', 'sale', 'return', 'damaged', 'manual']
const ADMIN_NAME = 'Ramesh Anandhan'

function mkHistory(emoji, productName, gradient) {
  const count = 2 + Math.floor(Math.random() * 4)
  return Array.from({ length: count }, (_, i) => {
    const type = ADJUSTMENT_TYPES[Math.floor(Math.random() * ADJUSTMENT_TYPES.length)]
    const qty = type === 'sale' ? -(1 + Math.floor(Math.random() * 5)) : (5 + Math.floor(Math.random() * 50))
    const minsAgo = Math.floor(Math.random() * 10000)
    return {
      _id: `SH-${Date.now()}-${i}`,
      productId: productName,
      type,
      quantity: qty,
      reason: type === 'restock' ? 'Routine restock from supplier' : type === 'sale' ? 'Customer order' : type === 'return' ? 'Customer return' : type === 'damaged' ? 'Damaged during handling' : 'Manual adjustment',
      performedBy: type === 'sale' ? 'System' : ADMIN_NAME,
      timestamp: h(Math.floor(minsAgo / 60)),
    }
  }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
}

export const stockHistory = inventory.slice(0, 15).flatMap((inv) =>
  mkHistory(inv.emoji, inv.productName, inv.gradient)
).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
