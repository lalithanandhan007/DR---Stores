import { motion } from 'framer-motion'
import { getOrderStatusMeta } from '../../data/ordersData'

/* Premium animated order-status badge. Live statuses pulse. */
export default function OrderStatusBadge({ status, size = 'md', layout = false }) {
  const meta = getOrderStatusMeta(status)
  const live = ['pending', 'preparing', 'out_for_delivery'].includes(status)
  const sizing = size === 'sm' ? 'text-[10px] px-2.5 py-1' : 'text-[11px] px-3 py-1.5'

  return (
    <motion.span
      key={status}
      layout={layout}
      initial={{ opacity: 0, scale: 0.8, y: 4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 320, damping: 22 }}
      className={`inline-flex items-center gap-1.5 rounded-full border font-bold whitespace-nowrap ${meta.badge} ${sizing}`}
    >
      {live ? (
        <span className="relative flex w-1.5 h-1.5">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${meta.dot}`} />
          <span className={`relative inline-flex rounded-full w-1.5 h-1.5 ${meta.dot}`} />
        </span>
      ) : (
        <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
      )}
      {meta.label}
    </motion.span>
  )
}
