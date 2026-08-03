import { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react'
import { customerApi } from '../api'
import { getErrorMessage } from '../api/client'
import { useToast } from './CartContext'

const CustomersCtx = createContext(null)

export function CustomersProvider({ children }) {
  const [customers, setCustomers] = useState([])
  const { addToast } = useToast()

  useEffect(() => {
    customerApi.list({ limit: 200 })
      .then((res) => setCustomers(res.items || []))
      .catch((err) => addToast(getErrorMessage(err, 'Could not load customers'), 'error', 3000))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getCustomer = useCallback((id) => {
    const local = customers.find((c) => c._id === id)
    if (local) return local
    return { _id: id, name: '...', phone: '', email: '', avatar: '', tag: 'regular', blocked: false, notes: [], totalOrders: 0, lifetimeSpend: 0, avgOrderValue: 0 }
  }, [customers])

  const toggleBlock = useCallback((id) => {
    const c = customers.find((x) => x._id === id)
    if (!c) return
    customerApi.update(id, { blocked: !c.blocked })
      .then(() => {
        setCustomers((prev) => prev.map((x) => x._id === id ? { ...x, blocked: !c.blocked } : x))
        addToast('Customer status updated', 'success', 2600)
      })
      .catch((err) => addToast(getErrorMessage(err, 'Update failed'), 'error', 3000))
  }, [customers, addToast])

  const updateTag = useCallback((id, tag) => {
    customerApi.update(id, { tag })
      .then(() => {
        setCustomers((prev) => prev.map((c) => c._id === id ? { ...c, tag } : c))
        addToast('Customer tag updated', 'success', 2400)
      })
      .catch((err) => addToast(getErrorMessage(err, 'Update failed'), 'error', 3000))
  }, [addToast])

  const addNote = useCallback((id, text) => {
    if (!text.trim()) return
    customerApi.addNote(id, text.trim())
      .then(({ notes }) => {
        setCustomers((prev) => prev.map((c) => c._id === id ? { ...c, notes } : c))
        addToast('Note added', 'success', 2200)
      })
      .catch((err) => addToast(getErrorMessage(err, 'Could not add note'), 'error', 3000))
  }, [addToast])

  const removeNote = useCallback((id, idx) => {
    const c = customers.find((x) => x._id === id)
    const next = (c?.notes || []).filter((_, i) => i !== idx)
    customerApi.update(id, { notes: next })
      .then(() => setCustomers((prev) => prev.map((x) => x._id === id ? { ...x, notes: next } : x)))
      .catch((err) => addToast(getErrorMessage(err, 'Could not remove note'), 'error', 3000))
  }, [customers, addToast])

  const deleteCustomers = useCallback((ids) => {
    customerApi.deleteMany(ids)
      .then(() => {
        setCustomers((prev) => prev.filter((c) => !ids.includes(c._id)))
        addToast('Customers deleted', 'info', 2400)
      })
      .catch((err) => addToast(getErrorMessage(err, 'Delete failed'), 'error', 3000))
  }, [addToast])

  const value = useMemo(() => ({
    customers, getCustomer, toggleBlock, updateTag, addNote, removeNote, deleteCustomers,
  }), [customers, getCustomer, toggleBlock, updateTag, addNote, removeNote, deleteCustomers])

  return <CustomersCtx.Provider value={value}>{children}</CustomersCtx.Provider>
}

export function useCustomers() {
  const ctx = useContext(CustomersCtx)
  if (!ctx) throw new Error('useCustomers must be used within CustomersProvider')
  return ctx
}
