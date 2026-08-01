import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { quickActions } from '../../data/adminData'
import { AdminIcon } from './ui'

export default function QuickActionCard({ index }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {quickActions.map((qa, i) => (
        <motion.button
          key={qa.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.45, delay: (index * 0.03) + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.97 }}
          className="group relative text-left bg-white rounded-3xl border border-black/5 shadow-soft p-4 sm:p-5 overflow-hidden hover:shadow-card transition-shadow"
        >
          <span className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full bg-gradient-to-br opacity-[0.06] group-hover:opacity-[0.12] transition-opacity" style={{ background: `linear-gradient(135deg, ${qa.tint.split(' ')[1]}, ${qa.tint.split(' ')[2]})` }} />
          <div className="flex items-start justify-between">
            <span className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${qa.tint} text-white flex items-center justify-center shadow-md transition-transform duration-300 group-hover:scale-110`}>
              <AdminIcon name={qa.icon} className="w-5 h-5" />
            </span>
            <ArrowUpRight className="w-4 h-4 text-dark/20 group-hover:text-primary transition-colors" />
          </div>
          <p className="mt-3.5 text-sm font-bold text-dark">{qa.label}</p>
          <p className="mt-1 text-[11px] text-dark/45 leading-relaxed">{qa.desc}</p>
        </motion.button>
      ))}
    </div>
  )
}
