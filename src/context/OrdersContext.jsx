import { createContext, useContext, useState, useCallback, useMemo } from 'react'
import { orders as seedOrders } from '../data/ordersData'
import { useToast } from './CartContext'

/* ====================================================================
   Orders context — single source of truth for the admin Orders module.
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
  const [orders, setOrders] = useState(seedOrders)
  const { addToast } = useToast()

  const getOrder = useCallback((id) => orders.find((o) => o._id === id), [orders])

  /* Advance (or move sideways to) a status, appending a timeline entry */
  const updateStatus = useCallback((orderId, status, note) => {
    const step = LIVE_STEPS[status]
    if (!step) return
    setOrders((prev) => prev.map((o) => {
      if (o._id !== orderId) return o
      const entry = {
        status,
        label: step.label,
        note: note || undefined,
        time: new Date().toISOString(),
        actor: 'Store',
      }
      const next = {
        ...o,
        status,
        timeline: [...o.timeline, entry],
      }
      if (status === 'delivered') next.delivery = { ...next.delivery, deliveredAt: new Date().toISOString() }
      return next
    }))
    addToast(step.toast, 'success', 3200)
  }, [addToast])

  /* Assign a delivery partner. `dispatch` also advances to out_for_delivery.
     Partner lives at the order root (order.partner) like a Mongo ref. */
  const assignPartner = useCallback((orderId, partner, etaMinutes, dispatch = false) => {
    setOrders((prev) => prev.map((o) => {
      if (o._id !== orderId) return o
      const expectedAt = new Date(Date.now() + etaMinutes * 6e4).toISOString()
      const base = { ...o, partner, delivery: { ...o.delivery, expectedAt } }
      if (dispatch) {
        const entry = {
          status: 'out_for_delivery',
          label: 'Out for Delivery',
          note: `Handed over to ${partner.name}`,
          time: new Date().toISOString(),
          actor: 'Store',
        }
        base.status = 'out_for_delivery'
        base.timeline = [...o.timeline, entry]
      }
      return base
    }))
    addToast(dispatch ? `Order dispatched with ${partner.name}` : `${partner.name} assigned to this order`, 'success', 3200)
  }, [addToast])

  /* Append an admin note */
  const addNote = useCallback((orderId, text) => {
    if (!text.trim()) return
    setOrders((prev) => prev.map((o) => (
      o._id === orderId
        ? { ...o, notes: { ...o.notes, admin: [...(o.notes?.admin || []), text.trim()] } }
        : o
    )))
    addToast('Note added', 'success', 2200)
  }, [addToast])

  /* Bulk status change — one timeline entry per order, single toast */
  const bulkStatus = useCallback((ids, status) => {
    const step = LIVE_STEPS[status]
    if (!step) return
    setOrders((prev) => prev.map((o) => {
      if (!ids.includes(o._id)) return o
      const entry = {
        status,
        label: step.label,
        time: new Date().toISOString(),
        actor: 'Store',
      }
      return { ...o, status, timeline: [...o.timeline, entry] }
    }))
    addToast(`${ids.length} order${ids.length > 1 ? 's' : ''} ${step.label.toLowerCase()}`, 'success', 3200)
  }, [addToast])

  const deleteOrders = useCallback((ids) => {
    setOrders((prev) => prev.filter((o) => !ids.includes(o._id)))
  }, [])

  const value = useMemo(() => ({
    orders,
    getOrder,
    updateStatus,
    assignPartner,
    addNote,
    deleteOrders,
    bulkStatus,
  }), [orders, getOrder, updateStatus, assignPartner, addNote, deleteOrders, bulkStatus])

  return <OrdersCtx.Provider value={value}>{children}</OrdersCtx.Provider>
}

export function useOrders() {
  const ctx = useContext(OrdersCtx)
  if (!ctx) throw new Error('useOrders must be used within OrdersProvider')
  return ctx
}
