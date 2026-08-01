import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react'
import { topProducts } from '../../data/adminData'

export default function TopSellingProducts() {
  const maxRevenue = Math.max(...topProducts.map((p) => p.revenue))
  return (
    <div className="space-y-3">
      {topProducts.map((p, i) => {
        const up = p.trend >= 0
        const barPct = Math.round((p.revenue / maxRevenue) * 100)
        return (
          <motion.div
            key={p._id}
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className="bg-white rounded-3xl border border-black/5 shadow-soft p-4 flex items-center gap-4 hover:shadow-card hover:-translate-y-0.5 transition-all duration-300"
          >
            <div className="relative w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 overflow-hidden" style={{ background: `linear-gradient(135deg, ${p.gradient[0]}22, ${p.gradient[1]}14)` }}>
              <span className="text-2xl">{p.emoji}</span>
              <span className="absolute top-0.5 left-0.5 text-[9px] font-black text-dark/30">{i + 1}</span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-bold text-dark truncate">{p.name}</p>
                <span className={`inline-flex items-center gap-1 text-[11px] font-bold ${up ? 'text-emerald-600' : 'text-red-500'}`}>
                  {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {Math.abs(p.trend)}%
                </span>
              </div>
              <div className="flex items-center justify-between mt-1 text-[11px] text-dark/45">
                <span>{p.sold.toLocaleString('en-IN')} sold · ₹{p.price}</span>
                <span className="font-bold text-dark">₹{p.revenue.toLocaleString('en-IN')}</span>
              </div>
              <div className="mt-2 h-1.5 rounded-full bg-black/6 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${barPct}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                />
              </div>
            </div>

            <button className="shrink-0 w-9 h-9 rounded-xl bg-black/4 flex items-center justify-center text-dark/35 hover:text-primary hover:bg-primary/8 transition-colors" aria-label={`${p.name} analytics`}>
              <BarChart3 className="w-4 h-4" />
            </button>
          </motion.div>
        )
      })}
    </div>
  )
}
