import { useState } from 'react'
import * as XLSX from 'xlsx'
import { downloadOrderInvoice } from '../../utils/invoicePdf'
import { motion } from 'framer-motion'
import { X, Download, FileSpreadsheet, FileText, FileType2, Check } from 'lucide-react'
import { useToast } from '../../context/CartContext'

const FORMATS = [
  { id: 'csv', label: 'CSV', desc: 'Comma-separated values', icon: FileType2, tint: 'bg-emerald-50 text-emerald-600' },
  { id: 'excel', label: 'Excel', desc: 'XLSX spreadsheet', icon: FileSpreadsheet, tint: 'bg-primary/10 text-primary' },
  { id: 'pdf', label: 'PDF', desc: 'Printable document', icon: FileText, tint: 'bg-red-50 text-red-500' },
]

export default function ExportModal({ orders = [], count, open, onClose }) {
  const { addToast } = useToast()
  const [exporting, setExporting] = useState(null)

  if (!open) return null

  const handle = (fmt) => {
    if (fmt === 'excel') {
      setExporting(fmt)
    
      const headers = [
        'Order ID',
        'Customer Name',
        'Customer Phone',
        'Customer Email',
        'Order Date',
        'Status',
        'Payment Method',
        'Payment Status',
        'Subtotal',
        'Discount',
        'Delivery Fee',
        'Packaging Fee',
        'Tax',
        'Grand Total',
        'Delivery Partner',
        'Delivery Slot',
        'Source',
        'Items Count',
      ]
    
      const rows = orders.map((order) => ({
        'Order ID': order._id,
        'Customer Name': order.customer?.name || '',
        'Customer Phone': order.customer?.phone || '',
        'Customer Email': order.customer?.email || '',
        'Order Date': order.createdAt ? new Date(order.createdAt).toLocaleString('en-IN') : '',
        'Status': order.status || '',
        'Payment Method': order.payment?.method || '',
        'Payment Status': order.payment?.status || '',
        'Subtotal': order.subtotal ?? 0,
        'Discount': order.discount ?? 0,
        'Delivery Fee': order.deliveryFee ?? 0,
        'Packaging Fee': order.packagingFee ?? 0,
        'Tax': order.tax ?? 0,
        'Grand Total': order.grandTotal ?? 0,
        'Delivery Partner': order.partner?.name || '',
        'Delivery Slot': order.delivery?.slot?.label || '',
        'Source': order.source || '',
        'Items Count': order.items?.length || 0,
      }))
    
      const worksheet = XLSX.utils.json_to_sheet(rows, { header: headers })
      const workbook = XLSX.utils.book_new()
    
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders')
    
      XLSX.writeFile(
        workbook,
        `dr-stores-orders-${new Date().toISOString().slice(0, 10)}.xlsx`
      )
    
      addToast(`${orders.length} orders exported as Excel`, 'success', 2600)
      setExporting(null)
      onClose()
      return
    }
    
    if (fmt === 'pdf') {
      if (!orders.length) {
        addToast('No orders available to export', 'info', 2600)
        return
      }
    
      if (orders.length > 1) {
        addToast('PDF export currently supports one order at a time. Select one order.', 'info', 3000)
        return
      }
    
      setExporting(fmt)
    
      try {
        downloadOrderInvoice(orders[0])
        addToast('Order invoice exported as PDF', 'success', 2600)
      } catch (err) {
        addToast('Could not generate PDF invoice', 'error', 3000)
      } finally {
        setExporting(null)
        onClose()
      }
    
      return
    }
  
    setExporting(fmt)
  
    const headers = [
      'Order ID',
      'Customer Name',
      'Customer Phone',
      'Customer Email',
      'Order Date',
      'Status',
      'Payment Method',
      'Payment Status',
      'Subtotal',
      'Discount',
      'Delivery Fee',
      'Packaging Fee',
      'Tax',
      'Grand Total',
      'Delivery Partner',
      'Delivery Slot',
      'Source',
      'Items Count',
    ]
  
    const escapeCsv = (value) => {
      const text = String(value ?? '')
      return `"${text.replace(/"/g, '""')}"`
    }
  
    const rows = orders.map((order) => [
      order._id,
      order.customer?.name,
      order.customer?.phone,
      order.customer?.email,
      order.createdAt ? new Date(order.createdAt).toLocaleString('en-IN') : '',
      order.status,
      order.payment?.method,
      order.payment?.status,
      order.subtotal,
      order.discount,
      order.deliveryFee,
      order.packagingFee,
      order.tax,
      order.grandTotal,
      order.partner?.name || '',
      order.delivery?.slot?.label || '',
      order.source,
      order.items?.length || 0,
    ])
  
    const csv = [
      headers.map(escapeCsv).join(','),
      ...rows.map((row) => row.map(escapeCsv).join(',')),
    ].join('\r\n')
  
    const blob = new Blob(['\uFEFF' + csv], {
      type: 'text/csv;charset=utf-8;',
    })
  
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
  
    link.href = url
    link.download = `dr-stores-orders-${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  
    addToast(`${orders.length} orders exported as CSV`, 'success', 2600)
    setExporting(null)
    onClose()
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
          <Check className="w-3 h-3 text-primary" /> CSV export includes the currently selected or filtered orders.
        </p>
      </motion.div>
    </motion.div>
  )
}
