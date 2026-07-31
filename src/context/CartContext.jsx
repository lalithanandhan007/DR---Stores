import { createContext, useContext, useReducer, useCallback, useState } from 'react'

const CartCtx = createContext(null)
const ToastCtx = createContext(null)
const RecentCtx = createContext(null)

/* ========== COUPONS ========== */
export const coupons = {
  WELCOME50: { type: 'flat', value: 50, minOrder: 150, label: '₹50 off on orders above ₹150', color: '#2E7D32' },
  FIRSTORDER: { type: 'percent', value: 15, maxDiscount: 75, minOrder: 200, label: '15% off up to ₹75 on first order', color: '#FF9800' },
  FRESH100: { type: 'flat', value: 100, minOrder: 500, label: '₹100 off on orders above ₹500', color: '#4CAF50' },
  SAVE20: { type: 'percent', value: 20, maxDiscount: 100, minOrder: 300, label: '20% off up to ₹100', color: '#FF5722' },
  DR10: { type: 'flat', value: 10, minOrder: 0, label: '₹10 off — no minimum order', color: '#2E7D32' },
}

/* ========== DELIVERY SLOTS ========== */
export const deliverySlots = [
  { id: 'express', label: 'Express Delivery', time: '40 minutes', price: 30, icon: '⚡', description: 'Get it delivered in 40 minutes', available: true },
  { id: 'morning', label: 'Tomorrow Morning', time: '8:00 AM - 11:00 AM', price: 0, icon: '🌅', description: 'Free delivery', available: true },
  { id: 'afternoon', label: 'Tomorrow Afternoon', time: '12:00 PM - 3:00 PM', price: 0, icon: '☀️', description: 'Free delivery', available: true },
  { id: 'evening', label: 'Tomorrow Evening', time: '5:00 PM - 8:00 PM', price: 0, icon: '🌆', description: 'Free delivery', available: true },
]

/* ========== CART REDUCER ========== */
function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const key = `${action.product.id}-${action.weight || 'default'}`
      const existing = state[key]
      if (existing) {
        return { ...state, [key]: { ...existing, qty: existing.qty + (action.qty || 1) } }
      }
      return {
        ...state,
        [key]: {
          product: action.product,
          weight: action.weight || action.product.weightOptions?.[0] || '',
          qty: action.qty || 1,
        },
      }
    }
    case 'UPDATE': {
      const { key, qty } = action
      if (qty <= 0) {
        const { [key]: _, ...rest } = state
        return rest
      }
      return { ...state, [key]: { ...state[key], qty } }
    }
    case 'REMOVE': {
      const { [action.key]: _, ...rest } = state
      return rest
    }
    case 'CLEAR':
      return {}
    default:
      return state
  }
}

/* ========== CART PROVIDER ========== */
export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, {})
  const [previewOpen, setPreviewOpen] = useState(false)
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [selectedSlot, setSelectedSlot] = useState(deliverySlots[0])
  const [addresses, setAddresses] = useState(() => {
    try { return JSON.parse(localStorage.getItem('dr-addresses') || '[]') } catch { return [] }
  })
  const [defaultAddressId, setDefaultAddressId] = useState(() => {
    try { return localStorage.getItem('dr-default-address') || null } catch { return null }
  })
  const [removedItem, setRemovedItem] = useState(null)
  const [orderHistory, setOrderHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem('dr-orders') || '[]') } catch { return [] }
  })

  const addItem = useCallback((product, weight, qty = 1) => {
    dispatch({ type: 'ADD', product, weight, qty })
  }, [])

  const updateQty = useCallback((key, qty) => {
    dispatch({ type: 'UPDATE', key, qty })
  }, [])

  const removeItem = useCallback((key) => {
    const item = items[key]
    if (item) setRemovedItem({ key, ...item })
    dispatch({ type: 'REMOVE', key })
  }, [items])

  const undoRemove = useCallback(() => {
    if (removedItem) {
      dispatch({ type: 'ADD', product: removedItem.product, weight: removedItem.weight, qty: removedItem.qty })
      setRemovedItem(null)
    }
  }, [removedItem])

  const clearCart = useCallback(() => dispatch({ type: 'CLEAR' }), [])

  const cartItems = Object.entries(items).map(([key, val]) => ({ key, ...val }))
  const totalItems = cartItems.reduce((s, i) => s + i.qty, 0)
  const subtotal = cartItems.reduce((s, i) => s + i.product.price * i.qty, 0)
  const totalSaved = cartItems.reduce((s, i) => s + (i.product.originalPrice - i.product.price) * i.qty, 0)

  // Coupon discount
  const couponDiscount = appliedCoupon ? (() => {
    if (appliedCoupon.type === 'flat') return appliedCoupon.value
    const pct = Math.round(subtotal * appliedCoupon.value / 100)
    return appliedCoupon.maxDiscount ? Math.min(pct, appliedCoupon.maxDiscount) : pct
  })() : 0

  const deliveryFee = selectedSlot?.price || 0
  const packagingFee = subtotal > 0 ? 5 : 0
  const tax = 0
  const grandTotal = Math.max(0, subtotal - couponDiscount + deliveryFee + packagingFee + tax)

  const applyCoupon = useCallback((code) => {
    const upper = code.toUpperCase().trim()
    const coupon = coupons[upper]
    if (!coupon) return { success: false, message: 'Invalid coupon code' }
    if (subtotal < coupon.minOrder) return { success: false, message: `Minimum order ₹${coupon.minOrder} required` }
    setAppliedCoupon({ ...coupon, code: upper })
    return { success: true, message: `"${upper}" applied successfully!` }
  }, [subtotal])

  const removeCoupon = useCallback(() => setAppliedCoupon(null), [])

  // Address management
  const saveAddress = useCallback((addr) => {
    setAddresses((prev) => {
      const updated = addr.id ? prev.map((a) => a.id === addr.id ? addr : a) : [...prev, { ...addr, id: Date.now().toString() }]
      localStorage.setItem('dr-addresses', JSON.stringify(updated))
      return updated
    })
  }, [])

  const deleteAddress = useCallback((id) => {
    setAddresses((prev) => {
      const updated = prev.filter((a) => a.id !== id)
      localStorage.setItem('dr-addresses', JSON.stringify(updated))
      return updated
    })
    if (defaultAddressId === id) setDefaultAddressId(null)
  }, [defaultAddressId])

  const setDefaultAddress = useCallback((id) => {
    setDefaultAddressId(id)
    localStorage.setItem('dr-default-address', id)
  }, [])

  const defaultAddress = addresses.find((a) => a.id === defaultAddressId) || addresses[0] || null

  // Place order
  const placeOrder = useCallback(() => {
    const order = {
      id: `DR${Date.now().toString(36).toUpperCase()}`,
      items: cartItems,
      subtotal, couponDiscount, deliveryFee, packagingFee, tax, grandTotal,
      coupon: appliedCoupon?.code || null,
      slot: selectedSlot,
      address: defaultAddress,
      status: 'confirmed',
      date: new Date().toISOString(),
    }
    setOrderHistory((prev) => {
      const updated = [order, ...prev]
      localStorage.setItem('dr-orders', JSON.stringify(updated))
      return updated
    })
    dispatch({ type: 'CLEAR' })
    setAppliedCoupon(null)
    return order
  }, [cartItems, subtotal, couponDiscount, deliveryFee, packagingFee, tax, grandTotal, appliedCoupon, selectedSlot, defaultAddress])

  const cartValue = {
    items, cartItems, totalItems, subtotal, totalSaved, grandTotal,
    couponDiscount, deliveryFee, packagingFee, tax,
    appliedCoupon, applyCoupon, removeCoupon,
    selectedSlot, setSelectedSlot,
    addresses, defaultAddress, defaultAddressId,
    saveAddress, deleteAddress, setDefaultAddress,
    addItem, updateQty, removeItem, undoRemove, clearCart,
    removedItem, setRemovedItem,
    previewOpen, setPreviewOpen,
    placeOrder, orderHistory,
  }

  return (
    <CartCtx.Provider value={cartValue}>
      {children}
    </CartCtx.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartCtx)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

/* ========== TOAST PROVIDER ========== */
let toastId = 0
function toastReducer(state, action) {
  switch (action.type) {
    case 'ADD': return [...state, action.toast]
    case 'REMOVE': return state.filter((t) => t.id !== action.id)
    default: return state
  }
}

export function ToastProvider({ children }) {
  const [toasts, dispatch] = useReducer(toastReducer, [])

  const addToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = ++toastId
    dispatch({ type: 'ADD', toast: { id, message, type } })
    setTimeout(() => dispatch({ type: 'REMOVE', id }), duration)
  }, [])

  const removeToast = useCallback((id) => dispatch({ type: 'REMOVE', id }), [])

  return (
    <ToastCtx.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastCtx.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastCtx)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

/* ========== RECENTLY VIEWED ========== */
const RECENT_KEY = 'dr-stores-recent'
const MAX_RECENT = 12

export function RecentProvider({ children }) {
  const [recent, setRecent] = useState(() => {
    try { return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]') } catch { return [] }
  })

  const addRecent = useCallback((product) => {
    setRecent((prev) => {
      const filtered = prev.filter((p) => p.id !== product.id)
      const updated = [product, ...filtered].slice(0, MAX_RECENT)
      try { localStorage.setItem(RECENT_KEY, JSON.stringify(updated.map((p) => p.id))) } catch {}
      return updated
    })
  }, [])

  return (
    <RecentCtx.Provider value={{ recent, addRecent }}>
      {children}
    </RecentCtx.Provider>
  )
}

export function useRecent() {
  return useContext(RecentCtx) || { recent: [], addRecent: () => {} }
}
