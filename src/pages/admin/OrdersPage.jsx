import { useState, useMemo, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Filter, Download, ArrowUpDown, ChevronDown, ChevronLeft, ChevronRight, X,
  MoreHorizontal, Eye, Printer, Truck, Ban, Trash2, CheckCheck, Phone, Clock, Receipt,
} from 'lucide-react'
import { ORDER_STATUSES, PAYMENT_STATUSES, PAYMENT_METHODS } from '../../data/ordersData'
import { useOrders } from '../../context/OrdersContext'
import { useDelivery } from '../../context/DeliveryContext'
import { useToast } from '../../context/CartContext'
import OrderStatusBadge from '../../components/orders/OrderStatusBadge'
import PaymentBadge from '../../components/orders/PaymentBadge'
import ConfirmModal from '../../components/orders/ConfirmModal'
import ExportModal from '../../components/orders/ExportModal'
import InvoiceModal from '../../components/orders/InvoiceModal'
import { downloadOrderInvoice } from '../../utils/invoicePdf'
import { inr, formatTime, formatDate, timeAgo } from '../../utils/format'

const PAGE_SIZE = 10

const INITIAL_FILTERS = {
  status: '', paymentStatus: '', paymentMethod: '', partner: '',
  dateFrom: '', dateTo: '', amountMin: '', amountMax: '',
}

/* ================= KPI STRIP ================= */
function KpiStrip({ counts, statusFilter, onSelect }) {
  const chips = [
    { key: '', label: 'All Orders', value: counts.total, tint: 'bg-dark text-white' },
    { key: 'pending', label: 'Pending', value: counts.pending, tint: 'bg-amber-50 text-amber-600' },
    { key: 'accepted', label: 'Accepted', value: counts.accepted, tint: 'bg-blue-50 text-blue-600' },
    { key: 'preparing', label: 'Preparing', value: counts.preparing, tint: 'bg-violet-50 text-violet-600' },
    { key: 'packed', label: 'Packed', value: counts.packed, tint: 'bg-indigo-50 text-indigo-600' },
    { key: 'out_for_delivery', label: 'Out For Delivery', value: counts.out_for_delivery, tint: 'bg-primary/8 text-primary' },
    { key: 'delivered', label: 'Delivered', value: counts.delivered, tint: 'bg-emerald-50 text-emerald-600' },
    { key: 'cancelled', label: 'Cancelled', value: counts.cancelled, tint: 'bg-red-50 text-red-500' },
    { key: 'refunded', label: 'Refunded', value: counts.refunded, tint: 'bg-gray-100 text-gray-500' },
  ]
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 admin-scroll -mx-1 px-1">
      {chips.map((c) => {
        const active = statusFilter === c.key
        return (
          <button
            key={c.key || 'all'}
            onClick={() => onSelect(c.key)}
            className={`shrink-0 inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl border text-xs font-bold transition-all ${
              active ? 'border-primary bg-primary text-white shadow-md shadow-primary/20' : `${c.tint} border-transparent hover:border-black/10 bg-white`
            }`}
          >
            {c.value > 0 && (
              <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${active ? 'bg-white/20 text-white' : 'bg-black/5'}`}>{c.value}</span>
            )}
            {c.label}
          </button>
        )
      })}
      <div className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white border border-black/5 text-xs font-bold text-dark/60">
        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" /> {inr(counts.revenue)} active
      </div>
    </div>
  )
}

/* ================= FILTER PANEL ================= */
function FilterPanel({ open, onClose, filters, setFilters, onClear }) {
  const { partners } = useDelivery()
  if (!open) return null
  const set = (k, v) => setFilters((f) => ({ ...f, [k]: v }))

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[80] flex items-start justify-end">
      <div className="absolute inset-0 bg-dark/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ x: 360 }} animate={{ x: 0 }} exit={{ x: 360 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="relative w-[340px] max-w-full h-full bg-white shadow-lift p-6 overflow-y-auto admin-scroll"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-bold text-dark">Filters</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-dark/30 hover:bg-black/5"><X className="w-4 h-4" /></button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-dark/60 mb-2">Order Status</label>
            <select value={filters.status} onChange={(e) => set('status', e.target.value)} className="w-full h-10 px-3 rounded-xl bg-cream border border-black/8 text-sm text-dark focus:outline-none focus:border-primary/30">
              <option value="">All statuses</option>
              {ORDER_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-dark/60 mb-2">Payment Status</label>
            <select value={filters.paymentStatus} onChange={(e) => set('paymentStatus', e.target.value)} className="w-full h-10 px-3 rounded-xl bg-cream border border-black/8 text-sm text-dark focus:outline-none focus:border-primary/30">
              <option value="">All payment statuses</option>
              {PAYMENT_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-dark/60 mb-2">Payment Method</label>
            <select value={filters.paymentMethod} onChange={(e) => set('paymentMethod', e.target.value)} className="w-full h-10 px-3 rounded-xl bg-cream border border-black/8 text-sm text-dark focus:outline-none focus:border-primary/30">
              <option value="">All methods</option>
              {PAYMENT_METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-dark/60 mb-2">Delivery Partner</label>
            <select value={filters.partner} onChange={(e) => set('partner', e.target.value)} className="w-full h-10 px-3 rounded-xl bg-cream border border-black/8 text-sm text-dark focus:outline-none focus:border-primary/30">
              <option value="">All partners</option>
              {partners.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
              <option value="unassigned">Not assigned</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-dark/60 mb-2">Order Date</label>
            <div className="grid grid-cols-2 gap-2">
              <input type="date" value={filters.dateFrom} onChange={(e) => set('dateFrom', e.target.value)} className="h-10 px-3 rounded-xl bg-cream border border-black/8 text-sm text-dark focus:outline-none focus:border-primary/30" />
              <input type="date" value={filters.dateTo} onChange={(e) => set('dateTo', e.target.value)} className="h-10 px-3 rounded-xl bg-cream border border-black/8 text-sm text-dark focus:outline-none focus:border-primary/30" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-dark/60 mb-2">Amount range (₹)</label>
            <div className="grid grid-cols-2 gap-2">
              <input type="number" placeholder="Min" value={filters.amountMin} onChange={(e) => set('amountMin', e.target.value)} className="h-10 px-3 rounded-xl bg-cream border border-black/8 text-sm focus:outline-none focus:border-primary/30" />
              <input type="number" placeholder="Max" value={filters.amountMax} onChange={(e) => set('amountMax', e.target.value)} className="h-10 px-3 rounded-xl bg-cream border border-black/8 text-sm focus:outline-none focus:border-primary/30" />
            </div>
          </div>

          <button onClick={onClear} className="w-full h-10 rounded-xl border border-black/8 text-xs font-bold text-dark/50 hover:border-red-300 hover:text-red-500 transition-all">
            Clear All Filters
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ================= ROW ACTIONS ================= */
function RowActions({ order, onAction }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    const fn = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  const terminal = ['delivered', 'cancelled', 'refunded'].includes(order.status)
  const actions = [
    { id: 'view', label: 'View Details', icon: Eye, color: 'text-primary' },
    { id: 'print', label: 'Print Invoice', icon: Printer, color: 'text-indigo-600' },
    { id: 'download', label: 'Download Invoice', icon: Download, color: 'text-amber-600' },
    { id: 'assign', label: 'Assign Partner', icon: Truck, color: 'text-blue-600' },
    { id: 'cancel', label: 'Cancel Order', icon: Ban, color: 'text-red-500', danger: true },
  ]
  if (terminal) {
    actions.splice(2, 1)
    actions.splice(2, 1)
  }

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen((o) => !o)} className="w-8 h-8 rounded-xl flex items-center justify-center text-dark/30 hover:text-primary hover:bg-primary/8 transition-colors">
        <MoreHorizontal className="w-4 h-4" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 4, scale: 0.96 }}
            transition={{ duration: 0.16 }}
            className="absolute right-0 top-full mt-1 w-48 glass-card rounded-2xl p-1.5 shadow-lift z-50"
          >
            {actions.map((a) => (
              <button
                key={a.id}
                onClick={() => { onAction(a.id, order); setOpen(false) }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-dark/70 hover:bg-primary/8 transition-colors ${a.danger ? 'text-red-500 hover:bg-red-50 hover:text-red-600' : ''}`}
              >
                <a.icon className={`w-4 h-4 ${a.color}`} /> {a.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ================= EMPTY STATE ================= */
function EmptyState({ searching }) {
  return (
    <div className="py-20 text-center">
      <div className="relative inline-flex">
        <span className="w-16 h-16 rounded-3xl bg-primary/8 flex items-center justify-center">
          <Receipt className="w-8 h-8 text-primary" />
        </span>
        <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-accent text-white text-xs flex items-center justify-center">0</span>
      </div>
      <h3 className="mt-5 font-serif-display text-xl font-bold text-dark">No orders found</h3>
      <p className="mt-1.5 text-sm text-dark/45 font-light">
        {searching ? 'Try a different search term or clear the filters.' : 'New orders will appear here automatically.'}
      </p>
    </div>
  )
}

/* ================= MAIN PAGE ================= */
export default function OrdersPage() {
  const navigate = useNavigate()
  const { orders, loading, updateStatus, bulkStatus, deleteOrders } = useOrders()
  const { addToast } = useToast()

  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState(INITIAL_FILTERS)
  const [filterOpen, setFilterOpen] = useState(false)
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortDir, setSortDir] = useState('desc')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState(new Set())
  const [cancelTarget, setCancelTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null) // { order } or { bulk: true }
  const [exportOpen, setExportOpen] = useState(false)
  const [invoiceOrder, setInvoiceOrder] = useState(null)

  const counts = useMemo(() => {
    const c = { total: orders.length, revenue: 0 }
    for (const s of ORDER_STATUSES) c[s.value] = 0
    for (const o of orders) {
      c[o.status] = (c[o.status] || 0) + 1
      if (!['cancelled', 'refunded'].includes(o.status)) c.revenue += o.grandTotal
    }
    return c
  }, [orders])

  const filtered = useMemo(() => {
    let list = [...orders]

    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter((o) =>
        o._id.toLowerCase().includes(q) ||
        o.customer.name.toLowerCase().includes(q) ||
        o.customer.phone.replace(/\s+/g, '').includes(q.replace(/\s+/g, ''))
      )
    }

    if (filters.status) list = list.filter((o) => o.status === filters.status)
    if (filters.paymentStatus) list = list.filter((o) => o.payment.status === filters.paymentStatus)
    if (filters.paymentMethod) list = list.filter((o) => o.payment.method === filters.paymentMethod)
    if (filters.partner === 'unassigned') list = list.filter((o) => !o.partner)
    else if (filters.partner) list = list.filter((o) => o.partner?._id === filters.partner)
    if (filters.dateFrom) list = list.filter((o) => new Date(o.createdAt) >= new Date(filters.dateFrom))
    if (filters.dateTo) list = list.filter((o) => new Date(o.createdAt) <= new Date(filters.dateTo + 'T23:59:59'))
    if (filters.amountMin) list = list.filter((o) => o.grandTotal >= Number(filters.amountMin))
    if (filters.amountMax) list = list.filter((o) => o.grandTotal <= Number(filters.amountMax))

    list.sort((a, b) => {
      let va, vb
      if (sortBy === 'customer') { va = a.customer.name.toLowerCase(); vb = b.customer.name.toLowerCase() }
      else if (sortBy === 'grandTotal') { va = a.grandTotal; vb = b.grandTotal }
      else if (sortBy === 'status') { va = a.status; vb = b.status }
      else { va = a[sortBy] ? new Date(a[sortBy]).getTime() : 0; vb = b[sortBy] ? new Date(b[sortBy]).getTime() : 0 }
      if (sortDir === 'asc') return va > vb ? 1 : va < vb ? -1 : 0
      return va < vb ? 1 : va > vb ? -1 : 0
    })
    return list
  }, [orders, search, filters, sortBy, sortDir])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const paged = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const toggleSelect = (id) => setSelected((prev) => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n })
  const selectAll = () => setSelected((prev) => (prev.size === paged.length && paged.length > 0 ? new Set() : new Set(paged.map((o) => o._id))))

  const handleRowAction = (action, order) => {
    if (action === 'view') navigate(`/admin/orders/${order._id}`)
    else if (action === 'print') setInvoiceOrder(order)
      else if (action === 'download') {
        try {
          downloadOrderInvoice(order)
          addToast('Invoice PDF downloaded', 'success', 2400)
        } catch (err) {
          addToast('Could not generate PDF invoice', 'error', 3000)
        }
      }
    else if (action === 'assign') navigate(`/admin/orders/${order._id}`)
    else if (action === 'cancel') setCancelTarget(order)
  }

  const handleBulk = (action) => {
    const ids = [...selected]
    if (!ids.length) return
    if (action === 'accept') {
      const pending = ids.filter((id) => orders.find((o) => o._id === id)?.status === 'pending')
      if (pending.length) bulkStatus(pending, 'accepted')
      else addToast('No pending orders selected to accept', 'info', 2600)
      setSelected(new Set())
    } else if (action === 'print') {
      addToast(`Printing ${ids.length} invoice${ids.length > 1 ? 's' : ''} (demo)`, 'success', 2400)
      setSelected(new Set())
    } else if (action === 'export') setExportOpen(true)
    else if (action === 'delete') setDeleteTarget({ bulk: true })
  }

  const sortOpts = [
    { v: 'createdAt', l: 'Order Time' },
    { v: 'expectedAt', l: 'Expected Delivery' },
    { v: 'customer', l: 'Customer' },
    { v: 'grandTotal', l: 'Amount' },
    { v: 'status', l: 'Status' },
  ]

  const hasActiveFilters = Object.values(filters).some((v) => v !== '')

  return (
    <div className="space-y-5">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <h1 className="font-serif-display text-2xl font-bold text-dark tracking-tight">Orders</h1>
            <p className="text-xs text-dark/45 mt-0.5">{counts.total} orders · {inr(counts.revenue)} in active value · {timeAgo(orders[0]?.createdAt)} latest</p>
          </div>
          <button
            onClick={() => setExportOpen(true)}
            className="ml-auto inline-flex items-center gap-2 h-10 px-4 rounded-2xl bg-gradient-to-r from-primary to-primary-dark text-white text-xs font-bold shadow-md shadow-primary/15 hover:shadow-lg hover:-translate-y-0.5 transition-all"
          >
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
        <div className="mt-4">
          <KpiStrip counts={counts} statusFilter={filters.status} onSelect={(s) => { setFilters((f) => ({ ...f, status: s })); setPage(1) }} />
        </div>
      </motion.div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark/30" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            placeholder="Search by order ID, customer, phone…"
            className="w-full h-10 pl-10 pr-4 rounded-2xl bg-white border border-black/5 text-sm text-dark placeholder:text-dark/30 focus:outline-none focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all"
          />
        </div>
        <button
          onClick={() => setFilterOpen(true)}
          className={`inline-flex items-center gap-1.5 h-10 px-4 rounded-2xl bg-white border text-xs font-bold transition-all ${hasActiveFilters ? 'border-primary text-primary bg-primary/5' : 'border-black/5 text-dark/60 hover:border-primary/25 hover:text-primary'}`}
        >
          <Filter className="w-3.5 h-3.5" /> Filters {hasActiveFilters && <span className="w-4.5 h-4.5 rounded-full bg-primary text-white text-[9px] flex items-center justify-center">{Object.values(filters).filter(Boolean).length}</span>}
        </button>
        <div className="relative">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="h-10 pl-3 pr-8 rounded-2xl bg-white border border-black/5 text-xs font-bold text-dark/60 appearance-none focus:outline-none focus:border-primary/25">
            {sortOpts.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
          </select>
          <ArrowUpDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-dark/30 pointer-events-none" />
        </div>
        <button onClick={() => setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))} className="w-10 h-10 rounded-2xl bg-white border border-black/5 flex items-center justify-center text-dark/40 hover:text-primary transition-colors" title="Toggle sort direction">
          <motion.span animate={{ rotate: sortDir === 'asc' ? 0 : 180 }} className="block"><ChevronDown className="w-4 h-4" /></motion.span>
        </button>
      </div>

      {/* Bulk actions */}
      <AnimatePresence>
        {selected.size > 0 && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="flex flex-wrap items-center gap-3 bg-primary/8 rounded-2xl border border-primary/15 px-4 py-3">
            <span className="text-xs font-bold text-primary">{selected.size} selected</span>
            <div className="flex flex-wrap items-center gap-2 ml-auto">
              {[
                { v: 'accept', l: 'Accept', icon: CheckCheck, c: 'bg-emerald-100 text-emerald-700' },
                { v: 'print', l: 'Print', icon: Printer, c: 'bg-indigo-100 text-indigo-700' },
                { v: 'export', l: 'Export', icon: Download, c: 'bg-primary/10 text-primary' },
                { v: 'delete', l: 'Delete', icon: Trash2, c: 'bg-red-100 text-red-600' },
              ].map((a) => (
                <button key={a.v} onClick={() => handleBulk(a.v)} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold ${a.c}`}>
                  <a.icon className="w-3.5 h-3.5" /> {a.l}
                </button>
              ))}
              <button onClick={() => setSelected(new Set())} className="w-8 h-8 rounded-xl flex items-center justify-center text-dark/30 hover:bg-black/5"><X className="w-4 h-4" /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-black/5 shadow-soft overflow-hidden">
        {loading ? (
          <div className="p-5 space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-14 rounded-xl bg-black/4 animate-pulse" />
            ))}
          </div>
        ) : (
        <>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[1280px]">
            <thead>
              <tr className="border-b border-black/5">
                <th className="px-4 py-3.5 w-10"><input type="checkbox" checked={selected.size === paged.length && paged.length > 0} onChange={selectAll} className="w-4 h-4 rounded accent-[#2E7D32]" /></th>
                {['Order', 'Customer', 'Items', 'Total', 'Payment', 'Status', 'Partner', 'Ordered', 'Expected', ''].map((h, i) => (
                  <th key={i} className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider text-dark/35 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.map((o, i) => (
                <motion.tr
                  key={o._id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.03, ease: [0.22, 1, 0.36, 1] }}
                  className="border-b border-black/4 last:border-0 hover:bg-primary/[0.02] transition-colors group"
                >
                  <td className="px-4 py-3.5"><input type="checkbox" checked={selected.has(o._id)} onChange={() => toggleSelect(o._id)} className="w-4 h-4 rounded accent-[#2E7D32]" /></td>

                  {/* Order */}
                  <td className="px-4 py-3.5">
                    <button onClick={() => navigate(`/admin/orders/${o._id}`)} className="text-xs font-bold text-primary hover:text-primary-dark hover:underline whitespace-nowrap">#{o._id}</button>
                    <p className="text-[10px] text-dark/35 mt-0.5 whitespace-nowrap">{o.source} {o.priority === 'high' && <span className="ml-1 text-red-500">· Priority</span>}</p>
                  </td>

                  {/* Customer */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <span className="w-8 h-8 rounded-lg bg-primary/8 text-primary text-[10px] font-bold flex items-center justify-center shrink-0">{o.customer.avatar}</span>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-dark whitespace-nowrap">{o.customer.name}</p>
                        <p className="text-[10px] text-dark/40 flex items-center gap-1 whitespace-nowrap"><Phone className="w-2.5 h-2.5" /> {o.customer.phone}</p>
                      </div>
                    </div>
                  </td>

                  {/* Items */}
                  <td className="px-4 py-3.5">
                    <div className="flex -space-x-1.5">
                      {o.items.slice(0, 3).map((it, j) => (
                        <span key={j} className="w-6 h-6 rounded-lg border-2 border-white flex items-center justify-center text-sm bg-cream" title={it.name}>{it.emoji}</span>
                      ))}
                      {o.items.length > 3 && <span className="w-6 h-6 rounded-lg border-2 border-white flex items-center justify-center text-[9px] font-bold text-dark/50 bg-white">+{o.items.length - 3}</span>}
                    </div>
                    <p className="text-[10px] text-dark/40 mt-1 whitespace-nowrap">{o.items.reduce((s, it) => s + it.qty, 0)} items</p>
                  </td>

                  {/* Total */}
                  <td className="px-4 py-3.5">
                    <p className="text-sm font-black text-dark whitespace-nowrap">{inr(o.grandTotal)}</p>
                    {o.coupon && <p className="text-[10px] text-primary font-bold whitespace-nowrap">Coupon {o.coupon}</p>}
                  </td>

                  {/* Payment */}
                  <td className="px-4 py-3.5">
                    <p className="text-[11px] font-semibold text-dark/55 whitespace-nowrap">{o.payment.method}</p>
                    <div className="mt-1"><PaymentBadge status={o.payment.status} /></div>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3.5"><OrderStatusBadge status={o.status} size="sm" /></td>

                  {/* Partner */}
                  <td className="px-4 py-3.5">
                    {o.partner ? (
                      <div className="flex items-center gap-1.5">
                        <Truck className="w-3 h-3 text-primary shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-dark whitespace-nowrap">{o.partner.name}</p>
                          <p className="text-[10px] text-dark/35 whitespace-nowrap">{o.partner.vehicle.split('·')[0].trim()}</p>
                        </div>
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-dark/30 bg-black/3 px-2 py-1 rounded-lg whitespace-nowrap">Unassigned</span>
                    )}
                  </td>

                  {/* Ordered */}
                  <td className="px-4 py-3.5">
                    <p className="text-xs font-semibold text-dark whitespace-nowrap">{formatTime(o.createdAt)}</p>
                    <p className="text-[10px] text-dark/40 whitespace-nowrap">{formatDate(o.createdAt)} · {timeAgo(o.createdAt)}</p>
                  </td>

                  {/* Expected */}
                  <td className="px-4 py-3.5">
                    {['delivered', 'cancelled', 'refunded'].includes(o.status) ? (
                      <span className="text-[10px] text-dark/30 whitespace-nowrap">—</span>
                    ) : (
                      <>
                        <p className="text-xs font-semibold text-dark whitespace-nowrap">{formatTime(o.delivery?.expectedAt)}</p>
                        <p className="text-[10px] text-dark/40 flex items-center gap-1 whitespace-nowrap"><Clock className="w-2.5 h-2.5" /> {o.delivery?.slot?.label}</p>
                      </>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => navigate(`/admin/orders/${o._id}`)} className="w-8 h-8 rounded-xl flex items-center justify-center text-dark/30 hover:text-primary hover:bg-primary/8 transition-colors opacity-0 group-hover:opacity-100" title="View">
                        <Eye className="w-4 h-4" />
                      </button>
                      <RowActions order={o} onAction={handleRowAction} />
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && <EmptyState searching={!!search || hasActiveFilters} />}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-black/5">
          <p className="text-[11px] text-dark/40">
            {filtered.length === 0 ? 'No results' : <>Showing {((safePage - 1) * PAGE_SIZE) + 1}–{Math.min(safePage * PAGE_SIZE, filtered.length)} of {filtered.length} orders</>}
          </p>
          <div className="flex items-center gap-1.5">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={safePage <= 1} className="w-8 h-8 rounded-xl flex items-center justify-center text-dark/30 hover:bg-primary/8 disabled:opacity-30"><ChevronLeft className="w-4 h-4" /></button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const pn = i + 1
              return <button key={pn} onClick={() => setPage(pn)} className={`w-8 h-8 rounded-xl text-xs font-bold flex items-center justify-center transition-all ${pn === safePage ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-dark/45 hover:bg-primary/8'}`}>{pn}</button>
            })}
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={safePage >= totalPages} className="w-8 h-8 rounded-xl flex items-center justify-center text-dark/30 hover:bg-primary/8 disabled:opacity-30"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
        </>
        )}
      </div>

      {/* Modals */}
      <FilterPanel open={filterOpen} onClose={() => setFilterOpen(false)} filters={filters} setFilters={setFilters} onClear={() => { setFilters(INITIAL_FILTERS); setPage(1) }} />
      <AnimatePresence>
        {cancelTarget && (
          <ConfirmModal
            open
            icon={<Ban className="w-7 h-7 text-red-500" />}
            title="Cancel this order?"
            message={`${cancelTarget.customer.name}'s order #${cancelTarget._id} worth ${inr(cancelTarget.grandTotal)} will be cancelled.${cancelTarget.payment.status === 'paid' ? ' The payment will need to be refunded.' : ''}`}
            confirmLabel="Cancel Order"
            onClose={() => setCancelTarget(null)}
            onConfirm={() => {
              updateStatus(cancelTarget._id, 'cancelled', 'Cancelled from the Orders page')
              setCancelTarget(null)
            }}
          />
        )}
        {deleteTarget && (
          <ConfirmModal
            open
            title={deleteTarget.bulk ? `Delete ${selected.size} orders?` : 'Delete this order?'}
            message="The order history will be permanently removed from this view. This cannot be undone."
            confirmLabel="Delete"
            onClose={() => setDeleteTarget(null)}
            onConfirm={() => {
              if (deleteTarget.bulk) deleteOrders([...selected])
              else deleteOrders([deleteTarget._id])
              addToast(`Deleted ${selected.size || 1} order${selected.size > 1 ? 's' : ''}`, 'info', 2400)
              setDeleteTarget(null)
              setSelected(new Set())
            }}
          />
        )}
      </AnimatePresence>
      <ExportModal
        orders={selected.size
        ? filtered.filter((o) => selected.has(o._id))
        : filtered}
        count={selected.size || filtered.length}
        open={exportOpen}
        onClose={() => setExportOpen(false)}
      />
      <AnimatePresence>{invoiceOrder && <InvoiceModal order={invoiceOrder} onClose={() => setInvoiceOrder(null)} />}</AnimatePresence>
    </div>
  )
}
