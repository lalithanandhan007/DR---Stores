import { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react'
import { orderApi } from '../api'
import { getErrorMessage } from '../api/client'
import { useToast } from './CartContext'

/* ====================================================================
   Orders context — MongoDB-backed admin Orders module.
   The list page and the detail page share this state so status changes
   made on one page are instantly reflected on the other.
   ==================================================================== */

const OrdersCtx = createContext(null)

/* Label + toast copy for live status transitions (appended to timeline) */
const LIVE_STEPS = {
  accepted: { label: 'Order Accepted', toast: 'Order accepted — kitchen notified' },
  preparing: { label: 'Preparing Items', toast: 'Order is being prepared' },
  packed: { label: 'Order Packed', toast: 'Order packed & ready for dispatch' },
  out_for_delivery: { label: 'Out for Delivery', toast: 'Order handed to delivery partner' },
  delivered: { label: 'Delivered', toast: 'Order marked as delivered 🎉' },
  cancelled: { label: 'Order Cancelled', toast: 'Order cancelled' },
  refunded: { label: 'Payment Refunded', toast: 'Refund processed successfully' },
}

export function OrdersProvider({ children }) {
  const [orders, setOrders] = useState([])
  const { addToast } = useToast()

  useEffect(() => {
    orderApi.adminAll({ limit: 300 })
      .then((res) => setOrders(res.items || []))
      .catch((err) => addToast(getErrorMessage(err, 'Could not load orders'), 'error', 3000))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getOrder = useCallback((id) => orders.find((o) => o._id === id), [orders])

  const updateStatus = useCallback((orderId, status, note) => {
    const step = LIVE_STEPS[status]
    if (!step) return
    orderApi.updateStatus(orderId, status, note)
      .then((updated) => {
        setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, ...updated } : o)))
        addToast(step.toast, 'success', 2600)
      })
      .catch((err) => addToast(getErrorMessage(err, 'Update failed'), 'error', 3000))
  }, [addToast])

  const assignPartner = useCallback((orderId, partner, etaMinutes, dispatch) => {
    orderApi.assignPartner(orderId, { partner, etaMinutes, dispatch })
      .then((updated) => {
        setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, ...updated } : o)))
        addToast(dispatch ? 'Order dispatched to delivery partner' : 'Delivery partner assigned', 'success', 2600)
      })
      .catch((err) => addToast(getErrorMessage(err, 'Assignment failed'), 'error', 3000))
  }, [addToast])

  const addNote = useCallback((orderId, text) => {
    if (!text.trim()) return
    orderApi.addNote(orderId, text.trim())
      .then((updated) => {
        setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, ...updated } : o)))
        addToast('Note added', 'success', 2200)
      })
      .catch((err) => addToast(getErrorMessage(err, 'Could not add note'), 'error', 3000))
  }, [addToast])

  const bulkStatus = useCallback((ids, status) => {
    orderApi.bulkStatus(ids, status)
      .then(() => {
        setOrders((prev) => prev.map((o) => ids.includes(o._id) ? { ...o, status } : o))
        addToast(`${ids.length} orders updated to ${status}`, 'success', 2600)
      })
      .catch((err) => addToast(getErrorMessage(err, 'Bulk update failed'), 'error', 3000))
  }, [addToast])

  const deleteOrders = useCallback((ids) => {
    orderApi.deleteMany(ids)
      .then(() => {
        setOrders((prev) => prev.filter((o) => !ids.includes(o._id)))
        addToast('Orders deleted', 'info', 2400)
      })
      .catch((err) => addToast(getErrorMessage(err, 'Delete failed'), 'error', 3000))
  }, [addToast])

  const value = useMemo(() => ({
    orders, getOrder, updateStatus, assignPartner, addNote, bulkStatus, deleteOrders,
  }), [orders, getOrder, updateStatus, assignPartner, addNote, bulkStatus, deleteOrders])

  return <OrdersCtx.Provider value={value}>{children}</OrdersCtx.Provider>
}

export function useOrders() {
  const ctx = useContext(OrdersCtx)
  if (!ctx) throw new Error('useOrders must be used within OrdersProvider')
  return ctx
}
