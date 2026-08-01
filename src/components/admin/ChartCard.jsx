import { motion } from 'framer-motion'

/* Consistent card frame for all dashboard charts */
export default function ChartCard({ title, subtitle, action, children, index = 0, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className={`bg-white rounded-3xl border border-black/5 shadow-soft p-5 sm:p-6 ${className}`}
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h3 className="text-sm font-bold text-dark">{title}</h3>
          {subtitle && <p className="text-[11px] text-dark/40 mt-0.5">{subtitle}</p>}
        </div>
        {action}
      </div>
      <div className="w-full">{children}</div>
    </motion.div>
  )
}
