import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MoreHorizontal, ArrowUpRight } from 'lucide-react'
import { useOrders } from '../../context/OrdersContext'
import { formatTime } from '../../utils/format'
import PaymentStatusBadge from '../ui/PaymentStatusBadge'

const STATUS = {
  delivered: { label: 'Delivered', cls: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
  preparing: { label: 'Preparing', cls: 'bg-amber-50 text-amber-600 border-amber-200' },
  pending: { label: 'Pending', cls: 'bg-blue-50 text-blue-600 border-blue-200' },
  out_for_delivery: { label: 'Out for Delivery', cls: 'bg-primary/8 text-primary border-primary/15' },
  cancelled: { label: 'Cancelled', cls: 'bg-red-50 text-red-500 border-red-200' },
}

export default function OrderTable({ orders: ordersProp }) {
  const { orders: ctxOrders } = useOrders()
  const navigate = useNavigate()
  const allOrders = ordersProp || ctxOrders || []
  const recentOrders = allOrders.slice(0, 7).map((o) => ({
    _id: o._id,
    avatar: o.avatar || o.customer?.avatar || '',
    customer: typeof o.customer === 'string' ? o.customer : (o.customer?.name || '—'),
    emoji: o.emoji || (Array.isArray(o.items) && o.items[0]?.emoji) || '🛒',
    items: typeof o.items === 'number' ? o.items : (Array.isArray(o.items) ? o.items.reduce((s, it) => s + (it.qty || 0), 0) : 0),
    amount: o.amount ?? o.grandTotal ?? 0,
    paymentMethod: typeof o.payment === 'string' ? o.payment : (o.payment?.method || '—'),
    paymentStatus: o.payment?.status || 'pending',
    status: o.status,
    delivery: typeof o.delivery === 'string' ? o.delivery : (o.delivery?.slot?.label || formatTime(o.delivery?.expectedAt)),
  }))
  return (
    <div className="bg-white rounded-3xl border border-black/5 shadow-soft overflow-hidden">
      <div className="overflow-x-auto admin-scroll">
        <table className="w-full text-left min-w-[820px]">
          <thead>
            <tr className="border-b border-black/5">
              {['Order ID', 'Customer', 'Items', 'Amount', 'Payment', 'Status', 'Delivery', 'Action'].map((h) => (
                <th key={h} className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-dark/35 whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((o, i) => {
              const st = STATUS[o.status] || STATUS.pending
              return (
                <motion.tr
                  key={o._id}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.35, delay: i * 0.04 }}
                  className="border-b border-black/4 last:border-0 group hover:bg-primary/[0.03] transition-colors"
                >
                  <td className="px-5 py-3.5 text-xs font-bold text-primary whitespace-nowrap">#{o._id}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <span className="w-8 h-8 rounded-lg bg-primary/8 text-primary text-[10px] font-bold flex items-center justify-center shrink-0">{o.avatar}</span>
                      <span className="text-xs font-semibold text-dark whitespace-nowrap">{o.customer}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs text-dark/60 whitespace-nowrap">{o.emoji} {o.items} items</span>
                  </td>
                  <td className="px-5 py-3.5 text-xs font-bold text-dark whitespace-nowrap">₹{o.amount}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-dark/40 font-medium">{o.paymentMethod}</span>
                      <PaymentStatusBadge status={o.paymentStatus} />
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border whitespace-nowrap ${st.cls}`}>
                      {o.status === 'out_for_delivery' && <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />}
                      {st.label}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-dark/55 whitespace-nowrap">{o.delivery}</td>
                  <td className="px-5 py-3.5">
                    <button className="w-8 h-8 rounded-xl flex items-center justify-center text-dark/30 hover:text-primary hover:bg-primary/8 transition-colors" aria-label={`Actions for ${o._id}`}>
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-5 py-3.5 border-t border-black/5">
        <p className="text-[11px] text-dark/40">Showing {recentOrders.length} of {allOrders.length} total</p>
        <button onClick={() => navigate('/admin/orders')} className="inline-flex items-center gap-1.5 text-[11px] font-bold text-primary hover:text-primary-dark transition-colors">
          View all orders <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
