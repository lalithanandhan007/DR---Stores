import { motion } from 'framer-motion'
import { ShoppingBag, AlertTriangle, UserPlus, Package, TicketPercent, Undo2 } from 'lucide-react'
import { useAdminData } from '../../context/AdminDataContext'
import { timeAgo } from '../../utils/format'

const TYPE_META = {
  order: { icon: ShoppingBag, tint: 'bg-primary/10 text-primary' },
  alert: { icon: AlertTriangle, tint: 'bg-red-50 text-red-500' },
  customer: { icon: UserPlus, tint: 'bg-secondary/10 text-secondary' },
  inventory: { icon: Package, tint: 'bg-accent/10 text-accent' },
  coupon: { icon: TicketPercent, tint: 'bg-blue-50 text-blue-600' },
  refund: { icon: Undo2, tint: 'bg-violet-50 text-violet-600' },
}

export default function ActivityTimeline() {
  const { activity: rawActivity } = useAdminData()
  const activity = rawActivity.map((a) => ({
    ...a,
    id: a._id,
    time: timeAgo(a.timestamp || a.createdAt),
    note: a.note || a.detail,
  }))
  return (
    <div className="bg-white rounded-3xl border border-black/5 shadow-soft p-5 sm:p-6">
      <h3 className="text-sm font-bold text-dark mb-5">Recent Activity</h3>
      <div className="relative pl-1">
        {activity.map((a, i) => {
          const meta = TYPE_META[a.type] || TYPE_META.order
          return (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="relative flex gap-4 pb-6 last:pb-0"
            >
              {/* connector */}
              {i < activity.length - 1 && (
                <span className="absolute left-[15px] top-9 bottom-0 w-px bg-gradient-to-b from-primary/15 to-transparent" />
              )}
              <span className={`relative z-10 w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${meta.tint}`}>
                <meta.icon className="w-4 h-4" />
              </span>
              <div className="min-w-0 flex-1 pt-0.5">
                <p className="text-[13px] text-dark/80 leading-snug">
                  <b className="font-bold text-dark">{a.actor}</b> {a.action}{' '}
                  {a.target && <b className="font-bold text-primary">{a.target}</b>}
                  {a.amount && <span className="text-dark/50"> · {a.amount}</span>}
                  {a.note && <span className="text-dark/50"> · {a.note}</span>}
                </p>
                <p className="text-[11px] text-dark/35 mt-0.5">{a.time}</p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
