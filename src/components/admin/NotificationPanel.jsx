import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Package, AlertTriangle, TicketPercent, UserRound, CheckCheck, Bell, X } from 'lucide-react'
import { notifications as seed } from '../../data/adminData'

const TYPE_META = {
  order: { icon: Package, tint: 'bg-primary/10 text-primary' },
  lowstock: { icon: AlertTriangle, tint: 'bg-red-50 text-red-500' },
  coupon: { icon: TicketPercent, tint: 'bg-accent/10 text-accent' },
  customer: { icon: UserRound, tint: 'bg-secondary/10 text-secondary' },
}

export default function NotificationPanel() {
  const [items, setItems] = useState(seed)

  const unreadCount = items.filter((n) => !n.read).length
  const markAll = () => setItems((prev) => prev.map((n) => ({ ...n, read: true })))
  const markOne = (id) => setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  const deleteOne = (id) => setItems((prev) => prev.filter((n) => n.id !== id))

  return (
    <div className="glass-card rounded-3xl p-4 shadow-lift overflow-hidden">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Bell className="w-4 h-4" />
          </span>
          <div>
            <p className="text-sm font-bold text-dark leading-none">Notifications</p>
            <p className="text-[10px] text-dark/40 mt-0.5">{unreadCount} unread</p>
          </div>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAll} className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:text-primary-dark transition-colors">
            <CheckCheck className="w-3.5 h-3.5" /> Mark all
          </button>
        )}
      </div>

      <div className="space-y-1 max-h-80 overflow-y-auto admin-scroll -mx-1 px-1">
        <AnimatePresence>
          {items.length === 0 && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-8 text-center text-xs text-dark/40">No notifications</motion.p>
          )}
          {items.map((n, i) => {
            const meta = TYPE_META[n.type] || TYPE_META.order
            return (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16, height: 0, marginBottom: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`relative group flex items-start gap-3 p-3 rounded-2xl transition-colors ${n.read ? 'opacity-55 hover:opacity-90' : 'bg-primary/4 hover:bg-primary/8'}`}
              >
                <button onClick={() => markOne(n.id)} className="flex items-start gap-3 flex-1 text-left">
                  <span className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${meta.tint}`}>
                    <meta.icon className="w-4 h-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-bold text-dark leading-snug">{n.title}</span>
                    <span className="block text-[11px] text-dark/50 mt-0.5 leading-snug">{n.message}</span>
                    <span className="block text-[10px] text-dark/30 mt-1">{n.time}</span>
                  </span>
                  {!n.read && <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />}
                </button>
                <button onClick={(e) => { e.stopPropagation(); deleteOne(n.id) }}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-dark/20 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all">
                  <X className="w-3 h-3" />
                </button>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}
