import { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react'
import { couponApi } from '../api'
import { getErrorMessage } from '../api/client'
import { useToast } from './CartContext'

const CouponsCtx = createContext(null)

export function CouponsProvider({ children }) {
  const [coupons, setCoupons] = useState([])
  const { addToast } = useToast()

  useEffect(() => {
    couponApi.list().then((list) => setCoupons(list || [])).catch(() => {})
  }, [])

  const getCoupon = useCallback((id) => coupons.find((c) => c._id === id), [coupons])

  const addCoupon = useCallback((coupon) => {
    return couponApi.create(coupon)
      .then((newCoupon) => {
        setCoupons((prev) => [newCoupon, ...prev])
        addToast('Coupon created successfully', 'success', 2800)
        return newCoupon
      })
      .catch((err) => {
        addToast(getErrorMessage(err, 'Could not create coupon'), 'error', 3000)
        throw err
      })
  }, [addToast])

  const updateCoupon = useCallback((id, updates) => {
    couponApi.update(id, updates)
      .then((updated) => {
        setCoupons((prev) => prev.map((c) => c._id === id ? { ...c, ...updated } : c))
        addToast('Coupon updated', 'success', 2400)
      })
      .catch((err) => addToast(getErrorMessage(err, 'Update failed'), 'error', 3000))
  }, [addToast])

  const toggleActive = useCallback((id) => {
    const c = coupons.find((x) => x._id === id)
    if (!c) return
    couponApi.update(id, { active: !c.active })
      .then(() => {
        setCoupons((prev) => prev.map((x) => x._id === id ? { ...x, active: !c.active } : x))
        addToast('Coupon status toggled', 'success', 2200)
      })
      .catch((err) => addToast(getErrorMessage(err, 'Update failed'), 'error', 3000))
  }, [coupons, addToast])

  const deleteCoupon = useCallback((id) => {
    couponApi.remove(id)
      .then(() => {
        setCoupons((prev) => prev.filter((c) => c._id !== id))
        addToast('Coupon deleted', 'info', 2400)
      })
      .catch((err) => addToast(getErrorMessage(err, 'Delete failed'), 'error', 3000))
  }, [addToast])

  const deleteCoupons = useCallback((ids) => {
    Promise.all(ids.map((id) => couponApi.remove(id)))
      .then(() => {
        setCoupons((prev) => prev.filter((c) => !ids.includes(c._id)))
        addToast('Coupons deleted', 'info', 2400)
      })
      .catch((err) => addToast(getErrorMessage(err, 'Delete failed'), 'error', 3000))
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
