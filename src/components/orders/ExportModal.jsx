import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Download, FileSpreadsheet, FileText, FileType2, Check } from 'lucide-react'
import { useToast } from '../../context/CartContext'

const FORMATS = [
  { id: 'csv', label: 'CSV', desc: 'Comma-separated values', icon: FileType2, tint: 'bg-emerald-50 text-emerald-600' },
  { id: 'excel', label: 'Excel', desc: 'XLSX spreadsheet', icon: FileSpreadsheet, tint: 'bg-primary/10 text-primary' },
  { id: 'pdf', label: 'PDF', desc: 'Printable document', icon: FileText, tint: 'bg-red-50 text-red-500' },
]

export default function ExportModal({ count, open, onClose }) {
  const { addToast } = useToast()
  const [exporting, setExporting] = useState(null)

  if (!open) return null

  const handle = (fmt) => {
    setExporting(fmt)
    setTimeout(() => {
      addToast(`${count} orders exported as ${fmt.toUpperCase()} (demo)`, 'success', 2600)
      setExporting(null)
      onClose()
    }, 900)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-dark/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 26 }}
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-7"
      >
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-dark/30 hover:bg-black/5"><X className="w-4 h-4" /></button>
        <div className="text-center mb-6">
          <span className="w-14 h-14 mx-auto rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
            <Download className="w-7 h-7" />
          </span>
          <h3 className="mt-3 font-serif-display text-xl font-bold text-dark">Export Orders</h3>
          <p className="mt-1 text-sm text-dark/45 font-light">Exporting <b className="text-primary font-bold">{count}</b> order{count === 1 ? '' : 's'} with current filters & status.</p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {FORMATS.map((fmt) => (
            <button
              key={fmt.id}
              onClick={() => handle(fmt.id)}
              className="group rounded-2xl border-2 border-black/8 p-4 text-center hover:border-primary/30 hover:bg-primary/5 transition-all"
            >
              <span className={`w-11 h-11 mx-auto rounded-xl flex items-center justify-center ${fmt.tint}`}>
                {exporting === fmt.id ? <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" /> : <fmt.icon className="w-5 h-5" />}
              </span>
              <p className="mt-2 text-xs font-bold text-dark group-hover:text-primary transition-colors">{fmt.label}</p>
              <p className="text-[9px] text-dark/35 mt-0.5">{fmt.desc}</p>
            </button>
          ))}
        </div>
        <p className="mt-5 flex items-center justify-center gap-1.5 text-[11px] text-dark/30 text-center">
          <Check className="w-3 h-3 text-primary" /> Mock export — ready to wire to a real report generator.
        </p>
      </motion.div>
    </motion.div>
  )
}
