import { createContext, useContext, useState, useCallback, useMemo } from 'react'
import { inventory as seedInventory, stockHistory as seedHistory } from '../data/inventoryData'
import { useToast } from './CartContext'

const InventoryCtx = createContext(null)

export function InventoryProvider({ children }) {
  const [inventory, setInventory] = useState(seedInventory)
  const [history, setHistory] = useState(seedHistory)
  const { addToast } = useToast()

  const getItem = useCallback((id) => inventory.find((i) => i._id === id), [inventory])

  const restock = useCallback((itemId, qty) => {
    if (qty <= 0) return
    setInventory((prev) => prev.map((i) => {
      if (i._id !== itemId) return i
      const newStock = i.currentStock + qty
      return {
        ...i,
        currentStock: newStock,
        status: newStock <= 0 ? 'out_of_stock' : newStock < i.minStock ? 'low' : 'in_stock',
        lastRestocked: new Date().toISOString(),
      }
    }))
    setHistory((prev) => {
      const item = inventory.find((i) => i._id === itemId)
      const entry = {
        _id: `SH-${Date.now()}`,
        productId: item?.productName || '',
        type: 'restock',
        quantity: qty,
        reason: 'Manual restock',
        performedBy: 'Ramesh Anandhan',
        timestamp: new Date().toISOString(),
      }
      return [entry, ...prev]
    })
    addToast(`Stock increased by ${qty} units`, 'success', 2600)
  }, [inventory, addToast])

  const bulkRestock = useCallback((ids, qty) => {
    setInventory((prev) => prev.map((i) => {
      if (!ids.includes(i._id)) return i
      const newStock = i.currentStock + qty
      return {
        ...i,
        currentStock: newStock,
        status: newStock <= 0 ? 'out_of_stock' : newStock < i.minStock ? 'low' : 'in_stock',
        lastRestocked: new Date().toISOString(),
      }
    }))
    addToast(`${ids.length} items restocked by ${qty} units`, 'success', 2800)
  }, [addToast])

  const adjustStock = useCallback((itemId, qty, reason) => {
    setInventory((prev) => prev.map((i) => {
      if (i._id !== itemId) return i
      const newStock = Math.max(0, i.currentStock + qty)
      return {
        ...i,
        currentStock: newStock,
        status: newStock <= 0 ? 'out_of_stock' : newStock < i.minStock ? 'low' : 'in_stock',
      }
    }))
    setHistory((prev) => {
      const item = inventory.find((i) => i._id === itemId)
      const entry = {
        _id: `SH-${Date.now()}`,
        productId: item?.productName || '',
        type: qty > 0 ? 'manual' : 'damaged',
        quantity: qty,
        reason: reason || 'Manual adjustment',
        performedBy: 'Ramesh Anandhan',
        timestamp: new Date().toISOString(),
      }
      return [entry, ...prev]
    })
    addToast('Stock adjusted', 'success', 2400)
  }, [inventory, addToast])

  const value = useMemo(() => ({
    inventory, history, getItem, restock, bulkRestock, adjustStock,
  }), [inventory, history, getItem, restock, bulkRestock, adjustStock])

  return <InventoryCtx.Provider value={value}>{children}</InventoryCtx.Provider>
}

export function useInventory() {
  const ctx = useContext(InventoryCtx)
  if (!ctx) throw new Error('useInventory must be used within InventoryProvider')
  return ctx
}
