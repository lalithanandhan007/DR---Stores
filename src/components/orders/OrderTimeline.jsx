import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { getOrderStatusMeta } from '../../data/ordersData'
import { formatTime } from '../../utils/format'

/* Vertical animated order timeline. The last entry is the live status. */
export default function OrderTimeline({ timeline }) {
  if (!timeline?.length) return null
  const currentIdx = timeline.length - 1

  return (
    <ol className="relative">
      {timeline.map((entry, i) => {
        const isDone = i < currentIdx
        const isCurrent = i === currentIdx
        const meta = getOrderStatusMeta(entry.status)

        return (
          <li key={`${entry.status}-${i}`} className="relative flex gap-4 last:pb-0">
            {/* connector line */}
            {i < timeline.length - 1 && (
              <motion.span
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.4, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformOrigin: 'top' }}
                className={`absolute left-[15px] top-9 w-0.5 origin-top ${isDone ? 'bg-gradient-to-b from-primary/40 to-primary/15' : 'bg-black/8'}`}
              />
            )}

            {/* node */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20, delay: i * 0.1 }}
              className="relative z-10 w-8 h-8 rounded-full shrink-0 flex items-center justify-center"
            >
              {isDone ? (
                <span className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-dark text-white flex items-center justify-center shadow-md shadow-primary/25">
                  <Check className="w-4 h-4" strokeWidth={3} />
                </span>
              ) : isCurrent ? (
                <>
                  <span className={`absolute inset-0 rounded-full ${meta.dot} opacity-25 animate-ping`} />
                  <span className={`relative w-8 h-8 rounded-full border-2 bg-white flex items-center justify-center ${meta.badge.split(' ').filter((c) => c.includes('border')).join(' ')}`}>
                    <span className={`w-2.5 h-2.5 rounded-full ${meta.dot}`} />
                  </span>
                </>
              ) : (
                <span className="w-8 h-8 rounded-full border-2 border-dashed border-black/15 bg-cream flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-black/15" />
                </span>
              )}
            </motion.div>

            {/* content */}
            <motion.div
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: i * 0.1 }}
              className="flex-1 pt-1 pb-7"
            >
              <div className="flex items-start justify-between gap-3">
                <p className={`text-sm font-bold ${isCurrent ? 'text-dark' : isDone ? 'text-dark/70' : 'text-dark/35'}`}>
                  {entry.label}
                </p>
                <span className="text-[11px] text-dark/40 font-medium shrink-0">{formatTime(entry.time)}</span>
              </div>
              <p className="text-xs text-dark/45 mt-0.5 font-light">
                {entry.actor && <span className="font-semibold text-dark/55">{entry.actor}</span>}
                {entry.note ? ` · ${entry.note}` : ''}
              </p>
              {isCurrent && (
                <motion.span
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="inline-flex items-center gap-1.5 mt-1.5 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-primary/8 text-primary"
                >
                  <span className="relative flex w-1.5 h-1.5">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${meta.dot}`} />
                    <span className={`relative inline-flex rounded-full w-1.5 h-1.5 ${meta.dot}`} />
                  </span>
                  Current status
                </motion.span>
              )}
            </motion.div>
          </li>
        )
      })}
    </ol>
  )
}
