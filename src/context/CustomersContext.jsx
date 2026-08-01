import { createContext, useContext, useState, useCallback, useMemo } from 'react'
import { customers as seedCustomers } from '../data/customersData'
import { useToast } from './CartContext'

const CustomersCtx = createContext(null)

export function CustomersProvider({ children }) {
  const [customers, setCustomers] = useState(seedCustomers)
  const { addToast } = useToast()

  const getCustomer = useCallback((id) => customers.find((c) => c._id === id), [customers])

  const toggleBlock = useCallback((id) => {
    setCustomers((prev) => prev.map((c) => {
      if (c._id !== id) return c
      const next = !c.blocked
      return { ...c, blocked: next }
    }))
    addToast('Customer status updated', 'success', 2600)
  }, [addToast])

  const updateTag = useCallback((id, tag) => {
    setCustomers((prev) => prev.map((c) => c._id === id ? { ...c, tag } : c))
    addToast('Customer tag updated', 'success', 2400)
  }, [addToast])

  const addNote = useCallback((id, text) => {
    if (!text.trim()) return
    setCustomers((prev) => prev.map((c) => c._id === id ? { ...c, notes: [...(c.notes || []), text.trim()] } : c))
    addToast('Note added', 'success', 2200)
  }, [addToast])

  const removeNote = useCallback((id, idx) => {
    setCustomers((prev) => prev.map((c) => c._id === id ? { ...c, notes: c.notes.filter((_, i) => i !== idx) } : c))
  }, [])

  const deleteCustomers = useCallback((ids) => {
    setCustomers((prev) => prev.filter((c) => !ids.includes(c._id)))
    addToast('Customers deleted', 'info', 2400)
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
