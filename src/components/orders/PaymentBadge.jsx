import { motion } from 'framer-motion'
import { getPaymentStatusMeta } from '../../data/ordersData'

/* Payment-status pill used across the orders table & detail page */
export default function PaymentBadge({ status, size = 'sm' }) {
  const meta = getPaymentStatusMeta(status)
  const sizing = size === 'xs' ? 'text-[9px] px-2 py-0.5' : 'text-[10px] px-2.5 py-1'
  return (
    <motion.span
      key={status}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 320, damping: 22 }}
      className={`inline-flex items-center gap-1.5 rounded-full border font-bold whitespace-nowrap ${meta.badge} ${sizing}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
      {meta.label}
    </motion.span>
  )
}
