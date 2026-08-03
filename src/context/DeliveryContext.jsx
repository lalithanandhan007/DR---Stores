import { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react'
import { deliveryApi } from '../api'
import { getErrorMessage } from '../api/client'
import { useToast } from './CartContext'

const DeliveryCtx = createContext(null)

export function DeliveryProvider({ children }) {
  const [partners, setPartners] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { addToast } = useToast()

  const load = useCallback(() => {
    setLoading(true)
    setError(null)
    deliveryApi.list()
      .then((list) => {
        setPartners(list || [])
        setError(null)
      })
      .catch((err) => setError(getErrorMessage(err, 'Could not load delivery partners')))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  const getPartner = useCallback((id) => partners.find((p) => p._id === id), [partners])

  const toggleOnline = useCallback((id) => {
    const p = partners.find((x) => x._id === id)
    if (!p) return
    const next = p.status === 'online' ? 'offline' : 'online'
    deliveryApi.toggle(id)
      .then(() => {
        setPartners((prev) => prev.map((x) => x._id === id ? { ...x, status: next } : x))
        addToast('Partner availability updated', 'success', 2200)
      })
      .catch((err) => addToast(getErrorMessage(err, 'Update failed'), 'error', 3000))
  }, [partners, addToast])

  const updateStatus = useCallback((id, status) => {
    deliveryApi.update(id, { status })
      .then(() => {
        setPartners((prev) => prev.map((p) => p._id === id ? { ...p, status } : p))
        addToast('Partner status updated', 'success', 2200)
      })
      .catch((err) => addToast(getErrorMessage(err, 'Update failed'), 'error', 3000))
  }, [addToast])

  const deletePartners = useCallback((ids) => {
    deliveryApi.removeMany(ids)
      .then(() => {
        setPartners((prev) => prev.filter((p) => !ids.includes(p._id)))
        addToast('Partners removed', 'info', 2400)
      })
      .catch((err) => addToast(getErrorMessage(err, 'Delete failed'), 'error', 3000))
  }, [addToast])

  const value = useMemo(() => ({
    partners, getPartner, toggleOnline, updateStatus, deletePartners,
    loading, error, refresh: load,
  }), [partners, getPartner, toggleOnline, updateStatus, deletePartners, loading, error, load])

  return <DeliveryCtx.Provider value={value}>{children}</DeliveryCtx.Provider>
}

export function useDelivery() {
  const ctx = useContext(DeliveryCtx)
  if (!ctx) throw new Error('useDelivery must be used within DeliveryProvider')
  return ctx
}
