import { useEffect, useState } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, Package, Truck, MapPin, Clock, Home, ShoppingBag, Copy } from 'lucide-react'
import { useToast } from '../context/CartContext'
import PaymentStatusBadge from '../components/ui/PaymentStatusBadge'
import { orderApi } from '../api'
import Footer from '../components/Footer'

/* ---------- Confetti particle ---------- */
function Confetti() {
  const colors = ['#2E7D32', '#4CAF50', '#FF9800', '#FFB74D', '#81C784', '#A5D6A7']
  return (
    <div className="fixed inset-0 pointer-events-none z-[100]">
      {[...Array(40)].map((_, i) => (
        <motion.div
          key={i}
          initial={{
            opacity: 1,
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
            y: -20,
            rotate: 0,
            scale: 0.5 + Math.random() * 0.8,
          }}
          animate={{
            opacity: 0,
            y: (typeof window !== 'undefined' ? window.innerHeight : 800) + 20,
            rotate: 360 + Math.random() * 720,
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000) + (Math.random() - 0.5) * 200,
          }}
          transition={{ duration: 2.5 + Math.random() * 1.5, delay: Math.random() * 0.8, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            width: 6 + Math.random() * 8,
            height: 6 + Math.random() * 8,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            background: colors[Math.floor(Math.random() * colors.length)],
          }}
        />
      ))}
    </div>
  )
}

export default function PaymentSuccess() {
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const { addToast } = useToast()
  const [copied, setCopied] = useState(false)
  const [order, setOrder] = useState(location.state?.order || null)
  const [loading, setLoading] = useState(!location.state?.order)
  const [error, setError] = useState(null)

  // If no order in state, try to fetch from server using orderId from URL params
  useEffect(() => {
    if (order) return

    const orderId = searchParams.get('orderId')
    if (!orderId) {
      setError('No order found')
      setLoading(false)
      return
    }

    const fetchOrder = async () => {
      try {
        const fetched = await orderApi.get(orderId)
        const normalized = {
          ...fetched,
          id: fetched._id || fetched.id,
          date: fetched.createdAt || fetched.date,
          slot: fetched.delivery?.slot || fetched.slot,
        }
        setOrder(normalized)
      } catch (err) {
        setError('Could not load order details')
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [searchParams, order])

  // Only show success toast when order is first loaded (not on refresh)
  useEffect(() => {
    if (order && !location.state?.order) {
      // Only show toast if we fetched from server (not from router state)
      addToast('Order placed successfully! 🎉', 'success', 4000)
    } else if (order && location.state?.order) {
      // Order came from router state - toast already shown by CheckoutPage (removed now)
      // We don't add toast here to avoid duplicates
    }
  }, [order, addToast, location.state?.order])

  const copyId = () => {
    if (!order) return
    navigator.clipboard?.writeText(order.id)
    setCopied(true)
    addToast('Order ID copied!', 'success')
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream pt-28 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-5"
          />
          <p className="text-dark/65">Loading order details...</p>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-cream pt-28 flex items-center justify-center">
        <div className="text-center">
          <span className="text-7xl mb-5 block">📦</span>
          <h1 className="text-2xl font-bold text-dark/65">No order found</h1>
          <p className="text-dark/40 mt-2">{error || 'Unable to load order details'}</p>
          <Link to="/vegetables" className="mt-5 inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-primary to-primary-dark text-white font-bold text-sm">
            Browse Vegetables
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream pt-28">
      <Confetti />
      <div className="max-w-lg mx-auto px-5 sm:px-8 text-center">
        {/* Success animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
          className="w-28 h-28 mx-auto rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-2xl shadow-primary/30 mb-8"
        >
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.6, type: 'spring', stiffness: 300 }}
          >
            <Check className="w-14 h-14 text-white" strokeWidth={3} />
          </motion.div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="font-serif-display text-3xl sm:text-4xl font-bold text-dark tracking-tight"
        >
          Order Placed! 🎉
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="mt-3 text-dark/50 text-[15px] font-light"
        >
          Thank you for your order. We're preparing it with care.
        </motion.p>

        {/* Order ID */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8 p-5 rounded-2xl bg-white border border-black/5 shadow-soft"
        >
          <span className="text-[11px] font-bold uppercase tracking-wider text-dark/40">Order ID</span>
          <div className="flex items-center justify-center gap-2 mt-1.5">
            <span className="text-xl font-black text-dark tracking-wider">{order.id}</span>
            <button onClick={copyId} className="w-8 h-8 rounded-lg flex items-center justify-center text-dark/30 hover:text-primary hover:bg-primary/10 transition-colors">
              {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </motion.div>

        {/* Order details */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85 }}
          className="mt-4 p-5 rounded-2xl bg-white border border-black/5 shadow-soft space-y-3"
        >
          <div className="flex items-center gap-3 text-sm">
            <Package className="w-5 h-5 text-primary shrink-0" />
            <span className="text-dark/60">{order.items.length} item{order.items.length > 1 ? 's' : ''}</span>
            <span className="ml-auto font-bold text-dark">₹{order.grandTotal}</span>
          </div>
          {order.slot && (
            <div className="flex items-center gap-3 text-sm">
              <Clock className="w-5 h-5 text-accent shrink-0" />
              <span className="text-dark/60">{order.slot.label}</span>
              <span className="ml-auto text-dark/45 text-[11px]">{order.slot.time}</span>
            </div>
          )}
          {order.address && (
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="w-5 h-5 text-secondary shrink-0" />
              <span className="text-dark/60 truncate">{order.address.house}, {order.address.city}</span>
            </div>
          )}
        </motion.div>

        {/* Payment info */}
        {order.payment?.gateway && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.95 }}
            className="mt-4 p-5 rounded-2xl bg-white border border-black/5 shadow-soft space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-dark/40">Payment</span>
              <PaymentStatusBadge status={order.payment.status} />
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="text-dark/60">{order.payment.method}</span>
              {order.payment.gateway === 'razorpay' && <span className="text-[10px] text-dark/35">via Razorpay</span>}
            </div>
            {(order.payment.transactionId || order.payment.razorpayPaymentId) && (
              <div className="flex items-center gap-3 text-sm">
                <span className="text-dark/40 text-xs">Transaction ID</span>
                <span className="ml-auto text-dark/60 text-xs font-semibold break-all">{order.payment.transactionId || order.payment.razorpayPaymentId}</span>
              </div>
            )}
            {order.payment.paidAt && (
              <div className="flex items-center gap-3 text-sm">
                <span className="text-dark/40 text-xs">Paid at</span>
                <span className="ml-auto text-dark/60 text-xs">
                  {new Date(order.payment.paidAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                </span>
              </div>
            )}
          </motion.div>
        )}

        {/* Estimated arrival */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-4 p-5 rounded-2xl bg-gradient-to-r from-primary/8 to-secondary/8 border border-primary/15"
        >
          <div className="flex items-center justify-center gap-3">
            <Truck className="w-6 h-6 text-primary" />
            <div className="text-left">
              <p className="text-sm font-bold text-dark">Estimated Arrival</p>
              <p className="text-xs text-dark/50">{order.slot?.time || '40 minutes'}</p>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.15 }}
          className="mt-8 flex flex-col sm:flex-row gap-3"
        >
          <Link to="/" className="flex-1 h-13 rounded-2xl border-2 border-black/10 text-sm font-bold text-dark/70 flex items-center justify-center gap-2 hover:border-dark/25 transition-all">
            <Home className="w-4 h-4" /> Continue Shopping
          </Link>
          <Link to="/orders" className="flex-1 h-13 rounded-2xl bg-gradient-to-r from-primary to-primary-dark text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/15 hover:shadow-xl hover:-translate-y-0.5 transition-all">
  <ShoppingBag className="w-4 h-4" /> Track Order
</Link>
        </motion.div>
      </div>
      <div className="mt-16"><Footer /></div>
    </div>
  )
}
