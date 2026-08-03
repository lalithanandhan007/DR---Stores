import { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react'
import { inventoryApi } from '../api'
import { getErrorMessage } from '../api/client'
import { useToast } from './CartContext'

const InventoryCtx = createContext(null)

export function InventoryProvider({ children }) {
  const [inventory, setInventory] = useState([])
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { addToast } = useToast()

  const load = useCallback(() => {
    setLoading(true)
    setError(null)
    inventoryApi.list().then((items) => setInventory(items || [])).catch(() => setError('Could not load inventory'))
      .finally(() => setLoading(false))
    inventoryApi.history().then((h) => setHistory(h || [])).catch(() => setError('Could not load stock history'))
  }, [])

  useEffect(() => { load() }, [load])

  const getItem = useCallback((id) => inventory.find((i) => i._id === id), [inventory])

  const restock = useCallback((itemId, qty) => {
    if (qty <= 0) return
    inventoryApi.restock(itemId, qty)
      .then((item) => {
        setInventory((prev) => prev.map((i) => (i._id === itemId ? { ...i, ...item } : i)))
        load()
        addToast(`Stock increased by ${qty} units`, 'success', 2600)
      })
      .catch((err) => addToast(getErrorMessage(err, 'Restock failed'), 'error', 3000))
  }, [addToast, load])

  const adjustStock = useCallback((itemId, qty, reason) => {
    inventoryApi.adjust(itemId, qty, reason)
      .then((item) => {
        setInventory((prev) => prev.map((i) => (i._id === itemId ? { ...i, ...item } : i)))
        load()
        addToast('Stock adjusted', 'success', 2400)
      })
      .catch((err) => addToast(getErrorMessage(err, 'Adjustment failed'), 'error', 3000))
  }, [addToast, load])

  const bulkRestock = useCallback((ids, qty) => {
    inventoryApi.bulkRestock(ids, qty)
      .then(() => {
        setInventory((prev) => prev.map((i) => ids.includes(i._id) ? { ...i, currentStock: i.currentStock + Number(qty), lastRestocked: new Date().toISOString() } : i))
        load()
        addToast(`Stock increased by ${qty} units on ${ids.length} items`, 'success', 2600)
      })
      .catch((err) => addToast(getErrorMessage(err, 'Bulk restock failed'), 'error', 3000))
  }, [addToast, load])

  const value = useMemo(() => ({
    inventory, history, getItem, restock, adjustStock, bulkRestock,
    loading, error, refresh: load,
  }), [inventory, history, getItem, restock, adjustStock, bulkRestock, loading, error, load])

  return <InventoryCtx.Provider value={value}>{children}</InventoryCtx.Provider>
}

export function useInventory() {
  const ctx = useContext(InventoryCtx)
  if (!ctx) throw new Error('useInventory must be used within InventoryProvider')
  return ctx
}
