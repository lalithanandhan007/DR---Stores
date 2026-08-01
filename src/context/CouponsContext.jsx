import { createContext, useContext, useState, useCallback, useMemo } from 'react'
import { coupons as seedCoupons } from '../data/couponsData'
import { useToast } from './CartContext'

const CouponsCtx = createContext(null)

export function CouponsProvider({ children }) {
  const [coupons, setCoupons] = useState(seedCoupons)
  const { addToast } = useToast()

  const getCoupon = useCallback((id) => coupons.find((c) => c._id === id), [coupons])

  const addCoupon = useCallback((coupon) => {
    const newCoupon = {
      ...coupon,
      _id: `cpn_${Date.now()}`,
      usedCount: 0,
      createdBy: 'adm_001',
      createdAt: new Date().toISOString(),
    }
    setCoupons((prev) => [newCoupon, ...prev])
    addToast('Coupon created successfully', 'success', 2800)
    return newCoupon
  }, [addToast])

  const updateCoupon = useCallback((id, updates) => {
    setCoupons((prev) => prev.map((c) => c._id === id ? { ...c, ...updates } : c))
    addToast('Coupon updated', 'success', 2400)
  }, [addToast])

  const toggleActive = useCallback((id) => {
    setCoupons((prev) => prev.map((c) => c._id === id ? { ...c, active: !c.active } : c))
    addToast('Coupon status toggled', 'success', 2200)
  }, [addToast])

  const deleteCoupon = useCallback((id) => {
    setCoupons((prev) => prev.filter((c) => c._id !== id))
    addToast('Coupon deleted', 'info', 2400)
  }, [addToast])

  const deleteCoupons = useCallback((ids) => {
    setCoupons((prev) => prev.filter((c) => !ids.includes(c._id)))
    addToast('Coupons deleted', 'info', 2400)
  }, [addToast])

  const value = useMemo(() => ({
    coupons, getCoupon, addCoupon, updateCoupon, toggleActive, deleteCoupon, deleteCoupons,
  }), [coupons, getCoupon, addCoupon, updateCoupon, toggleActive, deleteCoupon, deleteCoupons])

  return <CouponsCtx.Provider value={value}>{children}</CouponsCtx.Provider>
}

export function useCoupons() {
  const ctx = useContext(CouponsCtx)
  if (!ctx) throw new Error('useCoupons must be used within CouponsProvider')
  return ctx
}
