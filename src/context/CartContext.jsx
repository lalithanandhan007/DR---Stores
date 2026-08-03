import { createContext, useContext, useReducer, useCallback, useState, useEffect, useMemo } from 'react'
import products from '../data/products'
import { cartApi, orderApi, addressApi, couponApi } from '../api'
import { getErrorMessage } from '../api/client'
import { useAuth } from './AuthContext'

const CartCtx = createContext(null)
const ToastCtx = createContext(null)
const RecentCtx = createContext(null)

/* ========== LOCAL COUPONS (guest fallback) ========== */
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

/* ========== CART REDUCER (guest / offline fallback) ========== */
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
    case 'SET': {
      // Replace entire cart state (from backend)
      const next = {}
      action.items.forEach((item) => {
        next[item.key] = { product: item.product, weight: item.weight, qty: item.qty }
      })
      return next
    }
    default:
      return state
  }
}

/* Map a backend Cart item to the frontend shape used by every page */
function toFrontendItem(item) {
  const p = item.product && typeof item.product === 'object'
    ? item.product
    : products.find((pp) => pp.id === (item.product || item.productId))
  const product = p
    ? {
        id: p._id || p.id,
        name: p.name || item.productName,
        emoji: p.emoji,
        gradient: p.gradient,
        price: p.price ?? item.price ?? 0,
        originalPrice: p.originalPrice ?? item.originalPrice ?? 0,
        unit: p.unit,
        weightOptions: p.weightOptions,
        stock: p.stock,
        badges: p.badges,
      }
    : {
        id: item.product || item.productId,
        name: item.productName || 'Item',
        emoji: item.emoji || '🛒',
        gradient: item.gradient || ['#2E7D32', '#4CAF50'],
        price: item.price ?? 0,
        originalPrice: item.originalPrice ?? 0,
      }
  const weight = item.weight || product.weightOptions?.[0] || ''
  return {
    key: `${product.id}-${weight}`,
    product,
    weight,
    qty: item.qty || 1,
  }
}

/* ========== CART PROVIDER ========== */
export function CartProvider({ children }) {
  const { user, isAuthenticated } = useAuth()
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
  const [orderHistory, setOrderHistory] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(false)

  /* Load DB cart + addresses + orders whenever the session changes */
  useEffect(() => {
    if (!isAuthenticated || !user) {
      setOrderHistory([])
      return
    }
    setOrdersLoading(true)
    cartApi.get().then((cart) => {
      dispatch({ type: 'SET', items: (cart.items || []).map(toFrontendItem) })
    }).catch(() => {})
    addressApi.list().then((list) => {
      const mapped = (list || []).map((a) => ({ ...a, id: a._id }))
      setAddresses(mapped)
      const def = mapped.find((a) => a.isDefault)
      setDefaultAddressId(def?.id || mapped[0]?.id || null)
    }).catch(() => {})
    orderApi.my().then((orders) => {
      setOrderHistory((orders || []).map((o) => ({ ...o, id: o._id, date: o.createdAt || o.date })))
    }).catch(() => {}).finally(() => setOrdersLoading(false))
  }, [isAuthenticated, user])

  const addItem = useCallback((product, weight, qty = 1) => {
    if (isAuthenticated) {
      cartApi.add(product.id, weight || product.weightOptions?.[0], qty)
        .then((cart) => dispatch({ type: 'SET', items: (cart.items || []).map(toFrontendItem) }))
        .catch(() => dispatch({ type: 'ADD', product, weight, qty }))
    } else {
      dispatch({ type: 'ADD', product, weight, qty })
    }
  }, [isAuthenticated])

  const updateQty = useCallback((key, qty) => {
    if (isAuthenticated) {
      cartApi.update(key, qty)
        .then((cart) => dispatch({ type: 'SET', items: (cart.items || []).map(toFrontendItem) }))
        .catch(() => dispatch({ type: 'UPDATE', key, qty }))
    } else {
      dispatch({ type: 'UPDATE', key, qty })
    }
  }, [isAuthenticated])

  const removeItem = useCallback((key) => {
    const item = items[key]
    if (item) setRemovedItem({ key, ...item })
    if (isAuthenticated) {
      cartApi.remove(key)
        .then((cart) => dispatch({ type: 'SET', items: (cart.items || []).map(toFrontendItem) }))
        .catch(() => dispatch({ type: 'REMOVE', key }))
    } else {
      dispatch({ type: 'REMOVE', key })
    }
  }, [items, isAuthenticated])

  const undoRemove = useCallback(() => {
    if (removedItem) {
      dispatch({ type: 'ADD', product: removedItem.product, weight: removedItem.weight, qty: removedItem.qty })
      setRemovedItem(null)
    }
  }, [removedItem])

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR' })
    if (isAuthenticated) cartApi.clear().catch(() => {})
  }, [isAuthenticated])

  const cartItems = Object.entries(items).map(([key, val]) => ({ key, ...val }))
  const totalItems = cartItems.reduce((s, i) => s + i.qty, 0)
  const subtotal = cartItems.reduce((s, i) => s + i.product.price * i.qty, 0)
  const totalSaved = cartItems.reduce((s, i) => s + ((i.product.originalPrice || 0) - i.product.price) * i.qty, 0)

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
    if (!upper) return { success: false, message: 'Enter a coupon code' }
    if (isAuthenticated) {
      // validate against MongoDB-backed coupons
      return couponApi.validate(upper, subtotal)
        .then((c) => {
          const mapped = { ...c, code: c.code, label: c.description || `${c.value} off` }
          setAppliedCoupon(mapped)
          return { success: true, message: `"${upper}" applied successfully!` }
        })
        .catch((err) => ({ success: false, message: getErrorMessage(err, 'Invalid coupon code') }))
    }
    return new Promise((resolve) => {
      setTimeout(() => {
        const coupon = coupons[upper]
        if (!coupon) return resolve({ success: false, message: 'Invalid coupon code' })
        if (subtotal < coupon.minOrder) return resolve({ success: false, message: `Minimum order ₹${coupon.minOrder} required` })
        setAppliedCoupon({ ...coupon, code: upper })
        resolve({ success: true, message: `"${upper}" applied successfully!` })
      }, 400)
    })
  }, [isAuthenticated, subtotal])

  const removeCoupon = useCallback(() => setAppliedCoupon(null), [])

  /* ---------- Addresses (MongoDB-backed when logged in) ---------- */
  const saveAddress = useCallback((addr) => {
    if (isAuthenticated) {
      const payload = {
        label: addr.label, name: addr.name || user?.name, house: addr.house, street: addr.street,
        locality: addr.locality, city: addr.city, pincode: addr.pincode, landmark: addr.landmark,
        isDefault: addr.isDefault || addresses.length === 0,
      }
      return (addr.id ? addressApi.update(addr.id, payload) : addressApi.create(payload)).then((saved) => {
        const mapped = { ...saved, id: saved._id }
        setAddresses((prev) => {
          const updated = addr.id ? prev.map((a) => a.id === addr.id ? mapped : a) : [...prev, mapped]
          localStorage.setItem('dr-addresses', JSON.stringify(updated))
          return updated
        })
        if (mapped.isDefault) setDefaultAddressId(mapped.id)
        return saved
      })
    }
    return new Promise((resolve) => {
      setAddresses((prev) => {
        const updated = addr.id ? prev.map((a) => a.id === addr.id ? addr : a) : [...prev, { ...addr, id: Date.now().toString() }]
        localStorage.setItem('dr-addresses', JSON.stringify(updated))
        resolve(updated)
        return updated
      })
    })
  }, [isAuthenticated, addresses.length, user?.name])

  const deleteAddress = useCallback((id) => {
    setAddresses((prev) => {
      const updated = prev.filter((a) => a.id !== id)
      localStorage.setItem('dr-addresses', JSON.stringify(updated))
      return updated
    })
    if (defaultAddressId === id) setDefaultAddressId(null)
    if (isAuthenticated) addressApi.remove(id).catch(() => {})
  }, [defaultAddressId, isAuthenticated])

  const setDefaultAddress = useCallback((id) => {
    setDefaultAddressId(id)
    localStorage.setItem('dr-default-address', id)
    if (isAuthenticated) addressApi.setDefault(id).catch(() => {})
  }, [isAuthenticated])

  const defaultAddress = addresses.find((a) => a.id === defaultAddressId) || addresses[0] || null

  /* ---------- Place order (MongoDB) ---------- */
  const placeOrder = useCallback(async (overrides) => {
    if (isAuthenticated) {
      const payload = {
        items: cartItems.map((i) => ({ productId: i.product.id, weight: i.weight, qty: i.qty })),
        coupon: appliedCoupon?.code || null,
        deliveryFee,
        packagingFee,
        address: defaultAddress || overrides?.address,
        slot: selectedSlot,
        paymentMethod: overrides?.paymentMethod || 'UPI',
        special: overrides?.special || '',
      }
      try {
        const order = await orderApi.place(payload)
        const normalized = {
          ...order,
          id: order._id,
          date: order.createdAt || order.date,
          slot: order.delivery?.slot || order.slot,
        }
        dispatch({ type: 'CLEAR' })
        setAppliedCoupon(null)
        setOrderHistory((prev) => [normalized, ...prev])
        return { success: true, order: normalized }
      } catch (err) {
        return { success: false, message: getErrorMessage(err, 'Could not place order') }
      }
    }
    // Guest fallback (kept so the checkout demo still works offline)
    return new Promise((resolve) => {
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
      resolve({ success: true, order })
    })
  }, [isAuthenticated, cartItems, subtotal, couponDiscount, deliveryFee, packagingFee, tax, grandTotal, appliedCoupon, selectedSlot, defaultAddress])

  /* Sample orders shown on the Orders page when the account has none yet */
  const seedDemoOrders = useCallback(() => {
    setOrderHistory((prev) => {
      if (prev.length > 0) return prev
      const byId = (id) => products.find((p) => p.id === id)
      const mkItem = (id, weight, qty) => ({ product: byId(id), weight, qty })
      const day = (n) => new Date(Date.now() - n * 864e5).toISOString()
      const hour = (h) => new Date(Date.now() - h * 36e5).toISOString()
      const demo = [
        {
          id: 'DRDEMO1',
          items: [mkItem('tomato', '1kg', 2), mkItem('potato', '1kg', 3), mkItem('onion', '1kg', 2), mkItem('spinach', 'bunch', 1)],
          subtotal: 28 * 2 + 22 * 3 + 18 * 2 + 24 * 1, couponDiscount: 0, deliveryFee: 0, packagingFee: 5, tax: 0,
          grandTotal: 28 * 2 + 22 * 3 + 18 * 2 + 24 * 1 + 5, coupon: null,
          slot: { id: 'morning', label: 'Morning', time: '8:00 AM - 11:00 AM', price: 0 },
          address: { name: 'Priya Sharma', house: '12, Lake View Residency', street: 'MG Road', city: 'Chennai', pincode: '600017' },
          status: 'delivered', date: day(6),
        },
        {
          id: 'DRDEMO2',
          items: [mkItem('carrot', '500g', 2), mkItem('broccoli', '250g', 1), mkItem('capsicum-green', '250g', 3)],
          subtotal: 40 * 2 + 65 * 1 + 35 * 3, couponDiscount: 50, deliveryFee: 30, packagingFee: 5, tax: 0,
          grandTotal: 40 * 2 + 65 * 1 + 35 * 3 - 50 + 30 + 5, coupon: 'WELCOME50',
          slot: { id: 'express', label: 'Express Delivery', time: '40 minutes', price: 30 },
          address: { name: 'Priya Sharma', house: '12, Lake View Residency', street: 'MG Road', city: 'Chennai', pincode: '600017' },
          status: 'preparing', date: hour(2),
        },
        {
          id: 'DRDEMO3',
          items: [mkItem('corn', '500g', 1), mkItem('raw-banana', '1kg', 2)],
          subtotal: 30 * 1 + 24 * 2, couponDiscount: 0, deliveryFee: 0, packagingFee: 5, tax: 0,
          grandTotal: 30 * 1 + 24 * 2 + 5, coupon: null,
          slot: { id: 'evening', label: 'Evening', time: '5:00 PM - 8:00 PM', price: 0 },
          address: { name: 'Priya Sharma', house: '12, Lake View Residency', street: 'MG Road', city: 'Chennai', pincode: '600017' },
          status: 'cancelled', date: day(3),
        },
      ]
      localStorage.setItem('dr-orders', JSON.stringify(demo))
      return demo
    })
  }, [])

  const cartValue = useMemo(() => ({
    items, cartItems, totalItems, subtotal, totalSaved, grandTotal,
    couponDiscount, deliveryFee, packagingFee, tax,
    appliedCoupon, applyCoupon, removeCoupon,
    selectedSlot, setSelectedSlot,
    addresses, defaultAddress, defaultAddressId,
    saveAddress, deleteAddress, setDefaultAddress,
    addItem, updateQty, removeItem, undoRemove, clearCart,
    removedItem, setRemovedItem,
    previewOpen, setPreviewOpen,
    placeOrder, orderHistory, seedDemoOrders, ordersLoading,
  }), [
    items, cartItems, totalItems, subtotal, totalSaved, grandTotal,
    couponDiscount, deliveryFee, packagingFee, tax,
    appliedCoupon, applyCoupon, removeCoupon,
    selectedSlot, addresses, defaultAddress, defaultAddressId,
    saveAddress, deleteAddress, setDefaultAddress,
    addItem, updateQty, removeItem, undoRemove, clearCart,
    removedItem, previewOpen,
    placeOrder, orderHistory, seedDemoOrders, ordersLoading,
  ])

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

/* ========== RECENT PROVIDER (recently viewed — device-local history) ========== */
const RECENT_KEY = 'dr-stores-recent'

export function RecentProvider({ children }) {
  const [recent, setRecent] = useState(() => {
    try { return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]') } catch { return [] }
  })

  const addRecent = useCallback((id) => {
    setRecent((prev) => {
      const updated = [id, ...prev.filter((x) => x !== id)].slice(0, 12)
      try { localStorage.setItem(RECENT_KEY, JSON.stringify(updated)) } catch {}
      return updated
    })
  }, [])

  return <RecentCtx.Provider value={{ recent, addRecent }}>{children}</RecentCtx.Provider>
}

export function useRecent() {
  const ctx = useContext(RecentCtx)
  if (!ctx) throw new Error('useRecent must be used within RecentProvider')
  return ctx
}
