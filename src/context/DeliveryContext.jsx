import { createContext, useContext, useState, useCallback, useMemo } from 'react'
import { deliveryPartners as seedPartners } from '../data/deliveryData'
import { useToast } from './CartContext'

const DeliveryCtx = createContext(null)

export function DeliveryProvider({ children }) {
  const [partners, setPartners] = useState(seedPartners)
  const { addToast } = useToast()

  const getPartner = useCallback((id) => partners.find((p) => p._id === id), [partners])

  const toggleOnline = useCallback((id) => {
    setPartners((prev) => prev.map((p) => {
      if (p._id !== id) return p
      const next = p.status === 'online' ? 'offline' : 'online'
      return { ...p, status: next }
    }))
    addToast('Partner availability updated', 'success', 2200)
  }, [addToast])

  const updateStatus = useCallback((id, status) => {
    setPartners((prev) => prev.map((p) => p._id === id ? { ...p, status } : p))
    addToast('Partner status updated', 'success', 2200)
  }, [addToast])

  const deletePartners = useCallback((ids) => {
    setPartners((prev) => prev.filter((p) => !ids.includes(p._id)))
    addToast('Partners removed', 'info', 2400)
  }, [addToast])

  const value = useMemo(() => ({
    partners, getPartner, toggleOnline, updateStatus, deletePartners,
  }), [partners, getPartner, toggleOnline, updateStatus, deletePartners])

  return <DeliveryCtx.Provider value={value}>{children}</DeliveryCtx.Provider>
}

export function useDelivery() {
  const ctx = useContext(DeliveryCtx)
  if (!ctx) throw new Error('useDelivery must be used within DeliveryProvider')
  return ctx
}
