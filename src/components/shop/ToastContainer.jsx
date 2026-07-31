import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle, Info, X } from 'lucide-react'
import { useToast } from '../../context/CartContext'

export default function ToastContainer() {
  const { toasts, removeToast } = useToast()

  return (
    <div className="fixed bottom-6 right-6 z-[70] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, x: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto glass-card rounded-2xl px-5 py-3.5 shadow-card flex items-center gap-3 min-w-[240px] max-w-[360px]"
          >
            <span className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
              toast.type === 'success' ? 'bg-secondary/15 text-secondary' : 'bg-primary/15 text-primary'
            }`}>
              {toast.type === 'success' ? <CheckCircle className="w-4.5 h-4.5" /> : <Info className="w-4.5 h-4.5" />}
            </span>
            <span className="text-sm font-medium text-dark/80 flex-1">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="w-7 h-7 rounded-full flex items-center justify-center text-dark/30 hover:text-dark/60 hover:bg-black/5 transition-colors shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
