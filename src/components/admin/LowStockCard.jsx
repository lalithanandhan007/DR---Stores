import { motion } from 'framer-motion'
import { AlertTriangle, PackagePlus } from 'lucide-react'
import { useAdminData } from '../../context/AdminDataContext'
import { useToast } from '../../context/CartContext'

export default function LowStockCard() {
  const { lowStock: rawLowStock } = useAdminData()
  const { addToast } = useToast()
  const lowStock = rawLowStock.map((p) => ({
    ...p,
    name: p.name || p.productName || '—',
    stock: p.currentStock ?? p.stock ?? 0,
    reorder: p.minStock ?? p.reorder ?? 0,
  }))
  return (
    <div className="grid sm:grid-cols-2 gap-3">
      {lowStock.map((p, i) => {
        const pct = Math.min(100, Math.round((p.stock / p.reorder) * 100))
        const critical = pct <= 30
        return (
          <motion.div
            key={p._id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="bg-white rounded-3xl border border-black/5 shadow-soft p-4 flex items-center gap-3.5 hover:shadow-card transition-shadow"
          >
            <span className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: `linear-gradient(135deg, ${p.gradient?.[0] || '#4CAF50'}22, ${p.gradient?.[1] || '#2E7D32'}14)` }}>
              <span className="text-2xl">{p.emoji}</span>
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-dark truncate">{p.name}</p>
                {critical && <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0" />}
              </div>
              <p className="text-[11px] text-dark/40">{p.category}</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex-1 h-1.5 rounded-full bg-black/6 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${pct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className={`h-full rounded-full ${critical ? 'bg-gradient-to-r from-red-500 to-orange-400' : 'bg-gradient-to-r from-accent to-amber-400'}`}
                  />
                </div>
                <span className={`text-[11px] font-bold ${critical ? 'text-red-500' : 'text-accent'}`}>{p.stock} left</span>
              </div>
            </div>
            <button
              onClick={() => addToast(`${p.name} restock request sent (+${p.reorder} units)`, 'success', 3000)}
              className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary/8 text-primary text-[11px] font-bold hover:bg-primary hover:text-white transition-all duration-300"
            >
              <PackagePlus className="w-3.5 h-3.5" /> Restock
            </button>
          </motion.div>
        )
      })}
    </div>
  )
}
