import { downloadOrderInvoice } from '../../utils/invoicePdf'
import { motion } from 'framer-motion'
import { X, Printer, Download } from 'lucide-react'
import InvoicePreview from './InvoicePreview'
import { useToast } from '../../context/CartContext'

/* Full-screen invoice modal with Print + Download (mock) actions.
   Print relies on the @media print rule that isolates #invoice-print. */
export default function InvoiceModal({ order, onClose }) {
  const { addToast } = useToast()
  if (!order) return null

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-dark/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 26 }}
        className="relative w-full max-w-3xl bg-cream rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-5 sm:px-6 py-4 bg-white border-b border-black/5 shrink-0">
          <span className="text-sm font-bold text-dark">Invoice #{order._id}</span>
          <span className="text-[11px] text-dark/40">· {order.customer.name}</span>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => {
                try {
                  downloadOrderInvoice(order)
                  addToast('Invoice PDF downloaded', 'success', 2400)
                } catch (error) {
                  addToast('Could not generate invoice PDF', 'error', 3000)
                }
              }}
              className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl bg-white border border-black/8 text-xs font-bold text-dark/60 hover:border-primary/30 hover:text-primary transition-all"
            >
              <Download className="w-3.5 h-3.5" /> Download
            </button>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white text-xs font-bold shadow-md shadow-primary/15 hover:shadow-lg transition-all"
            >
              <Printer className="w-3.5 h-3.5" /> Print
            </button>
            <button onClick={onClose} className="w-9 h-9 rounded-xl flex items-center justify-center text-dark/30 hover:bg-black/5 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 admin-scroll print:overflow-visible">
          <InvoicePreview order={order} />
        </div>
      </motion.div>
    </motion.div>
  )
}
