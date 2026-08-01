import { motion } from 'framer-motion'
import { AlertTriangle, X } from 'lucide-react'

/* Generic animated confirm dialog — cancel order, reject, refund, delete */
export default function ConfirmModal({ open, title, message, confirmLabel = 'Confirm', tone = 'danger', icon, onClose, onConfirm, loading = false }) {
  if (!open) return null
  const confirmCls = tone === 'danger'
    ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/20'
    : 'bg-gradient-to-r from-primary to-primary-dark shadow-md shadow-primary/15'

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-dark/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92 }}
        transition={{ type: 'spring', stiffness: 300, damping: 26 }}
        className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-7 text-center"
      >
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-dark/30 hover:bg-black/5 transition-colors">
          <X className="w-4 h-4" />
        </button>
        <span className={`w-14 h-14 mx-auto rounded-full flex items-center justify-center ${tone === 'danger' ? 'bg-red-50' : 'bg-primary/10'}`}>
          {icon || <AlertTriangle className={`w-7 h-7 ${tone === 'danger' ? 'text-red-500' : 'text-primary'}`} />}
        </span>
        <h3 className="mt-4 font-serif-display text-xl font-bold text-dark">{title}</h3>
        {message && <p className="mt-2 text-sm text-dark/50 font-light leading-relaxed">{message}</p>}
        <div className="grid grid-cols-2 gap-3 mt-6">
          <button onClick={onClose} className="h-12 rounded-2xl border border-black/10 text-sm font-bold text-dark/60 hover:border-black/25 transition-all">Cancel</button>
          <button onClick={onConfirm} disabled={loading} className={`h-12 rounded-2xl text-white text-sm font-bold transition-all disabled:opacity-60 ${confirmCls}`}>
            {loading ? <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin align-middle" /> : confirmLabel}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
