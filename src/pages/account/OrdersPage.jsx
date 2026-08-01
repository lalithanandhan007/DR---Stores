import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Package, ShoppingBag, X, Info } from 'lucide-react'
import AccountLayout from '../../components/account/AccountLayout'
import OrderCard from '../../components/account/OrderCard'
import { useCart, useToast } from '../../context/CartContext'

export default function OrdersPage() {
  const { orderHistory, seedDemoOrders } = useCart()
  const { addToast } = useToast()

  /* Seed sample orders (Delivered / Preparing / Cancelled) so the timeline
     states are visible before the user has placed any real order. */
  useEffect(() => { seedDemoOrders() }, [seedDemoOrders])

  const isDemo = orderHistory.some((o) => String(o.id).startsWith('DRDEMO'))

  const clearDemo = () => {
    const real = orderHistory.filter((o) => !String(o.id).startsWith('DRDEMO'))
    try { localStorage.setItem('dr-orders', JSON.stringify(real)) } catch {}
    addToast('Sample orders removed', 'info')
    window.location.reload()
  }

  return (
    <AccountLayout title="My Orders" subtitle="Track, repeat and download invoices for all your orders.">
      {isDemo && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-5 rounded-2xl border border-accent/25 bg-accent/5 px-4 py-3 flex items-center gap-3">
          <Info className="w-4.5 h-4.5 text-accent shrink-0" />
          <p className="text-xs text-dark/60 flex-1">Showing sample orders so you can explore the timeline states. They'll be replaced once you place a real order.</p>
          <button onClick={clearDemo} className="inline-flex items-center gap-1.5 text-[11px] font-bold text-accent hover:text-accent-light shrink-0">
            <X className="w-3.5 h-3.5" /> Clear samples
          </button>
        </motion.div>
      )}

      {orderHistory.length === 0 ? (
        <div className="bg-white rounded-3xl border border-black/5 shadow-soft py-16 px-6 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }} className="w-20 h-20 mx-auto rounded-full bg-primary/8 flex items-center justify-center">
            <Package className="w-9 h-9 text-primary/50" />
          </motion.div>
          <h3 className="mt-6 font-serif-display text-2xl font-bold text-dark">No orders yet</h3>
          <p className="mt-2 text-sm text-dark/45 font-light max-w-sm mx-auto">When you place an order, it will show up here with live status tracking.</p>
          <Link to="/vegetables" className="mt-7 inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-primary to-primary-dark text-white font-bold text-sm shadow-lg shadow-primary/15 hover:shadow-xl hover:-translate-y-0.5 transition-all">
            <ShoppingBag className="w-4 h-4" /> Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orderHistory.map((order, i) => <OrderCard key={order.id} order={order} index={i} />)}
        </div>
      )}
    </AccountLayout>
  )
}
