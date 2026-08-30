import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useSettings } from '../context/AuthContext'
import { getTranslation } from '../i18n'
import {
  Trash2, Minus, Plus, ShoppingBag, Tag, Truck, Clock, ArrowRight, ArrowLeft,
  Heart, ChevronRight, Package, ShieldCheck, X, Check, Gift, Copy, AlertCircle,
} from 'lucide-react'
import { useCart, useToast } from '../context/CartContext'
import { coupons } from '../context/CartContext'
import Footer from '../components/Footer'

/* ========== EMPTY STATE ========== */
function EmptyCart() {
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center py-24 text-center">
      <motion.span animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity }} className="text-8xl mb-6 block">🛒</motion.span>
      <h2 className="text-2xl font-bold text-dark/70">Your cart is empty</h2>
      <p className="text-sm text-dark/40 mt-2 max-w-sm">Add some fresh vegetables to get started with your order!</p>
      <Link to="/vegetables" className="mt-6 inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-primary to-primary-dark text-white text-sm font-bold hover:shadow-cta transition-all">
        <ShoppingBag className="w-4 h-4" /> Browse Vegetables
      </Link>
    </motion.div>
  )
}

/* ========== COUPON PANEL ========== */
function CouponPanel({ t }) {
  const [code, setCode] = useState('')
  const [result, setResult] = useState(null)
  const { applyCoupon, removeCoupon, appliedCoupon, subtotal } = useCart()
  const { addToast } = useToast()

  const handleApply = async () => {
    if (!code.trim()) return
    const res = await applyCoupon(code)
    setResult(res)
    if (res.success) {
      addToast(res.message, 'success')
      setCode('')
    }
  }

  const popularCoupons = Object.entries(coupons).filter(([, c]) => subtotal >= c.minOrder).slice(0, 3)

  return (
    <div className="p-5 rounded-2xl bg-white border border-black/5">
      <h3 className="text-sm font-bold text-dark mb-3 flex items-center gap-2">
      <Gift className="w-4 h-4 text-accent" /> {t('cart.haveCoupon')}
      </h3>

      {appliedCoupon ? (
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200/60">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white"><Check className="w-4 h-4" /></span>
            <div>
              <span className="text-sm font-bold text-emerald-700">{appliedCoupon.code}</span>
              <span className="block text-[11px] text-emerald-600">{appliedCoupon.label}</span>
            </div>
          </div>
          <button onClick={() => { removeCoupon(); addToast('Coupon removed', 'info') }} className="text-emerald-600 hover:text-red-500 transition-colors"><X className="w-4 h-4" /></button>
        </motion.div>
      ) : (
        <>
          <div className="flex gap-2">
            <input
              type="text"
              value={code}
              onChange={(e) => { setCode(e.target.value); setResult(null) }}
              onKeyDown={(e) => e.key === 'Enter' && handleApply()}
              placeholder={t('cart.enterCouponCode')}
              className="flex-1 h-11 px-4 rounded-xl bg-cream border border-black/8 text-sm font-medium text-dark placeholder:text-dark/30 focus:outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10 transition-all"
            />
            <motion.button whileTap={{ scale: 0.95 }} onClick={handleApply} className="h-11 px-5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-colors">
            {t('cart.apply')}
            </motion.button>
          </div>

          {result && !result.success && (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-2 text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {result.message}
            </motion.p>
          )}

          {popularCoupons.length > 0 && (
            <div className="mt-3 space-y-2">
              {popularCoupons.map(([code, c]) => (
                <button key={code} onClick={() => { setCode(code) }} className="w-full flex items-center justify-between p-3 rounded-xl bg-cream border border-black/5 hover:border-primary/20 transition-colors text-left group">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ background: c.color }}>{code.slice(0, 2)}</span>
                    <div>
                      <span className="text-xs font-bold text-dark block">{code}</span>
                      <span className="text-[11px] text-dark/45">{c.label}</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">COPY</span>
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

/* ========== CART ITEM ========== */
function CartItem({ item, index }) {
  const { updateQty, removeItem } = useCart()
  const { settings } = useSettings()

  const language = settings.language || 'en'
  const t = (key) => getTranslation(language, key)

  const productName = (name) =>
    getTranslation(language, `shop.productNames.${name}`)
  const { addToast } = useToast()
  const [removing, setRemoving] = useState(false)
  const { key, product, weight, qty } = item

  const handleRemove = () => {
    setRemoving(true)
    setTimeout(() => {
      removeItem(key)
      addToast(`${productName(product.name)} ${t('cart.removedFromCart')}`, 'info')
    }, 200)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={removing ? { opacity: 0, x: -40, height: 0 } : { opacity: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, x: -40, height: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      className="flex gap-4 p-4 rounded-2xl bg-white border border-black/5 hover:shadow-soft transition-shadow duration-300"
    >
      {/* Product image */}
      <div
        className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center shrink-0"
        style={{ background: `linear-gradient(135deg, ${product.gradient[0]}25, ${product.gradient[1]}12)` }}
      >
        <span className="text-4xl sm:text-5xl">{product.emoji}</span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <Link to={`/vegetables/${product.id}`} className="text-[15px] font-bold text-dark hover:text-primary transition-colors leading-tight">
            {productName(product.name)} 
            </Link>
            <p className="text-[11px] text-dark/40 mt-0.5">{product.category} • {weight}</p>
          </div>
          <motion.button whileTap={{ scale: 0.85 }} onClick={handleRemove} className="w-8 h-8 rounded-full flex items-center justify-center text-dark/25 hover:text-red-500 hover:bg-red-50 transition-all shrink-0">
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </div>

        <div className="mt-2.5 flex items-end justify-between">
          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-extrabold text-dark">₹{product.price * qty}</span>
            {qty > 1 && <span className="text-[11px] text-dark/35">₹{product.price} × {qty}</span>}
          </div>

          {/* Quantity */}
          <div className="flex items-center border border-black/10 rounded-full overflow-hidden bg-cream">
            <button onClick={() => updateQty(key, qty - 1)} className="w-8 h-8 flex items-center justify-center text-dark/40 hover:text-dark transition-colors">
              <Minus className="w-3.5 h-3.5" />
            </button>
            <motion.span key={qty} initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="w-7 text-center text-xs font-bold text-dark">{qty}</motion.span>
            <button onClick={() => updateQty(key, qty + 1)} className="w-8 h-8 flex items-center justify-center text-dark/40 hover:text-dark transition-colors">
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* ========== DELIVERY OPTIONS ========== */
function DeliveryOptions({ t }) {
  const { selectedSlot, setSelectedSlot } = useCart()
  const slots = [
    { id: 'express', icon: '⚡', label: t('cart.express'), time: '40 min', price: 30 },
    { id: 'morning', icon: '🌅', label: t('cart.tomorrowAM'), time: '8-11 AM', price: 0 },
    { id: 'afternoon', icon: '☀️', label: t('cart.tomorrowPM'), time: '12-3 PM', price: 0 },
    { id: 'evening', icon: '🌆', label: t('cart.tomorrowEve'), time: '5-8 PM', price: 0 },
  ]

  return (
    <div className="p-5 rounded-2xl bg-white border border-black/5">
      <h3 className="text-sm font-bold text-dark mb-3 flex items-center gap-2">
      <Truck className="w-4 h-4 text-primary" /> {t('cart.deliveryOptions')}
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {slots.map((s) => (
          <button
            key={s.id}
            onClick={() => setSelectedSlot({ id: s.id, label: s.label, time: s.time, price: s.price, icon: s.icon })}
            className={`p-3 rounded-xl border-2 text-left transition-all duration-300 ${
              selectedSlot?.id === s.id
                ? 'border-primary bg-primary/5 shadow-soft'
                : 'border-black/8 bg-cream hover:border-primary/25'
            }`}
          >
            <span className="text-lg">{s.icon}</span>
            <span className="block text-xs font-bold text-dark mt-1">{s.label}</span>
            <span className="block text-[10px] text-dark/40">{s.time}</span>
            <span className={`block text-[11px] font-bold mt-1 ${s.price > 0 ? 'text-accent' : 'text-primary'}`}>
            {s.price > 0 ? `â‚¹${s.price}` : t('cart.free')}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

/* ========== ORDER SUMMARY ========== */
function OrderSummary() {
  const { subtotal, couponDiscount, deliveryFee, packagingFee, grandTotal, totalSaved, appliedCoupon, selectedSlot, cartItems } = useCart()
  const navigate = useNavigate()
  const { addToast } = useToast()

  const handleCheckout = () => {
    if (cartItems.length === 0) { addToast('Your cart is empty', 'info'); return }
    navigate('/checkout')
  }

  return (
    <div className="p-6 rounded-2xl bg-white border border-black/5 shadow-soft sticky top-28">
      <h3 className="text-base font-bold text-dark mb-5">Order Summary</h3>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-dark/55">Subtotal ({cartItems.reduce((s, i) => s + i.qty, 0)} items)</span>
          <span className="font-semibold text-dark">₹{subtotal}</span>
        </div>
        {totalSaved > 0 && (
          <div className="flex justify-between text-emerald-600">
            <span className="font-medium">You're saving</span>
            <span className="font-bold">-₹{totalSaved}</span>
          </div>
        )}
        {couponDiscount > 0 && (
          <div className="flex justify-between text-emerald-600">
            <span className="font-medium">Coupon ({appliedCoupon?.code})</span>
            <span className="font-bold">-₹{couponDiscount}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-dark/55">Delivery</span>
          <span className={`font-semibold ${deliveryFee === 0 ? 'text-primary' : 'text-dark'}`}>{deliveryFee === 0 ? 'Free' : `₹${deliveryFee}`}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-dark/55">Packaging</span>
          <span className="font-semibold text-dark">₹{packagingFee}</span>
        </div>

        <div className="h-px bg-black/8 my-2" />

        <div className="flex justify-between items-end">
          <span className="text-base font-bold text-dark">Grand Total</span>
          <span className="text-xl font-black text-dark">₹{grandTotal}</span>
        </div>
      </div>

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={handleCheckout}
        disabled={cartItems.length === 0}
        className="mt-5 w-full h-13 rounded-2xl bg-gradient-to-r from-primary via-secondary to-primary text-white text-base font-bold flex items-center justify-center gap-2 shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Proceed to Checkout <ArrowRight className="w-5 h-5" />
      </motion.button>

      <div className="mt-4 flex items-center justify-center gap-4 text-[11px] text-dark/35">
        <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> Secure</span>
        <span className="flex items-center gap-1"><Package className="w-3.5 h-3.5" /> Hygienic</span>
        <span className="flex items-center gap-1"><Truck className="w-3.5 h-3.5" /> Fast</span>
      </div>
    </div>
  )
}

/* ========== CART PAGE ========== */
export default function CartPage() {
  const { cartItems } = useCart()
  const { settings } = useSettings()

  const language = settings.language || 'en'
  const t = (key) => getTranslation(language, key)

  return (
    <div className="min-h-screen bg-cream pt-28">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        {/* Breadcrumb */}
        <motion.nav initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-sm text-dark/40 mb-6">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-dark/65 font-medium">Cart</span>
        </motion.nav>

        <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="font-serif-display text-3xl sm:text-4xl font-bold text-dark tracking-tight mb-8">
          Your <span className="text-gradient">Cart</span>
        </motion.h1>

        {cartItems.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart items */}
            <div className="lg:col-span-2 space-y-3">
              <AnimatePresence>
                {cartItems.map((item, i) => (
                  <CartItem key={item.key} item={item} index={i} />
                ))}
              </AnimatePresence>

              {/* Delivery Options */}
              <div className="mt-6">
              <DeliveryOptions t={t} />
              </div>

              {/* Coupon */}
              <div className="mt-4">
              <CouponPanel t={t} />
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <OrderSummary />
            </div>
          </div>
        )}
      </div>
      <div className="mt-16"><Footer /></div>
    </div>
  )
}
