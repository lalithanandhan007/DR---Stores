import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Package, ShoppingBag } from 'lucide-react'
import AccountLayout from '../../components/account/AccountLayout'
import OrderCard from '../../components/account/OrderCard'
import { useCart } from '../../context/CartContext'

export default function OrdersPage() {
  const { orderHistory } = useCart()

  return (
    <AccountLayout title="My Orders" subtitle="Track, repeat and download invoices for all your orders.">
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
