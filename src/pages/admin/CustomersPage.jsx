import { useState, useMemo, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Filter, Download, ArrowUpDown, ChevronDown, ChevronLeft, ChevronRight, X,
  MoreHorizontal, Eye, Phone, Mail, MessageSquare, Ban, ShieldCheck, Trash2,
  Tag, Star,
} from 'lucide-react'
import { CUSTOMER_TAGS, getCustomerTagMeta } from '../../data/customersData'
import { useCustomers } from '../../context/CustomersContext'
import { useToast } from '../../context/CartContext'
import ConfirmModal from '../../components/orders/ConfirmModal'
import Avatar from '../../components/account/Avatar'
import { inr, timeAgo } from '../../utils/format'

const PAGE_SIZE = 10

const INITIAL_FILTERS = { tag: '', blocked: '' }

/* ================= TAG BADGE ================= */
function TagBadge({ tag, size = 'sm' }) {
  const meta = getCustomerTagMeta(tag)
  const sizing = size === 'xs' ? 'text-[9px] px-2 py-0.5' : 'text-[10px] px-2.5 py-1'
  return (
    <motion.span
      key={tag}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center gap-1 rounded-full border font-bold whitespace-nowrap ${meta.badge} ${sizing}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
      {meta.label}
    </motion.span>
  )
}

/* ================= KPI STRIP ================= */
function KpiStrip({ counts, tagFilter, onSelect }) {
  const chips = [
    { key: '', label: 'All Customers', value: counts.total, tint: 'bg-dark text-white' },
    { key: 'vip', label: 'VIP', value: counts.vip, tint: 'bg-amber-50 text-amber-600' },
    { key: 'premium', label: 'Premium', value: counts.premium, tint: 'bg-violet-50 text-violet-600' },
    { key: 'regular', label: 'Regular', value: counts.regular, tint: 'bg-emerald-50 text-emerald-600' },
    { key: 'new', label: 'New', value: counts.new, tint: 'bg-blue-50 text-blue-600' },
  ]
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 admin-scroll -mx-1 px-1">
      {chips.map((c) => {
        const active = tagFilter === c.key
        return (
          <button key={c.key || 'all'} onClick={() => onSelect(c.key)}
            className={`shrink-0 inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl border text-xs font-bold transition-all ${active ? 'border-primary bg-primary text-white shadow-md shadow-primary/20' : `${c.tint} border-transparent hover:border-black/10 bg-white`}`}>
            {c.value > 0 && <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${active ? 'bg-white/20 text-white' : 'bg-black/5'}`}>{c.value}</span>}
            {c.label}
          </button>
        )
      })}
      <div className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white border border-black/5 text-xs font-bold text-dark/60">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> {inr(counts.lifetimeSpend)} lifetime
      </div>
    </div>
  )
}

/* ================= FILTER PANEL ================= */
function FilterPanel({ open, onClose, filters, setFilters, onClear }) {
  if (!open) return null
  const set = (k, v) => setFilters((f) => ({ ...f, [k]: v }))
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[80] flex items-start justify-end">
      <div className="absolute inset-0 bg-dark/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ x: 360 }} animate={{ x: 0 }} exit={{ x: 360 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="relative w-[340px] max-w-full h-full bg-white shadow-lift p-6 overflow-y-auto admin-scroll">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-bold text-dark">Filters</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-dark/30 hover:bg-black/5"><X className="w-4 h-4" /></button>
        </div>
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-dark/60 mb-2">Customer Tag</label>
            <select value={filters.tag} onChange={(e) => set('tag', e.target.value)} className="w-full h-10 px-3 rounded-xl bg-cream border border-black/8 text-sm text-dark focus:outline-none focus:border-primary/30">
              <option value="">All tags</option>
              {CUSTOMER_TAGS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-dark/60 mb-2">Account Status</label>
            <select value={filters.blocked} onChange={(e) => set('blocked', e.target.value)} className="w-full h-10 px-3 rounded-xl bg-cream border border-black/8 text-sm text-dark focus:outline-none focus:border-primary/30">
              <option value="">All</option>
              <option value="active">Active</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>
          <button onClick={onClear} className="w-full h-10 rounded-xl border border-black/8 text-xs font-bold text-dark/50 hover:border-red-300 hover:text-red-500 transition-all">Clear All Filters</button>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ================= ROW ACTIONS ================= */
function RowActions({ customer, onAction }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    const fn = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])
  const actions = [
    { id: 'view', label: 'View Profile', icon: Eye, color: 'text-primary' },
    { id: 'call', label: 'Call', icon: Phone, color: 'text-emerald-600' },
    { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare, color: 'text-emerald-500' },
    { id: 'email', label: 'Send Email', icon: Mail, color: 'text-blue-600' },
    { id: 'block', label: customer.blocked ? 'Unblock' : 'Block', icon: Ban, color: 'text-red-500', danger: !customer.blocked },
  ]
  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen((o) => !o)} className="w-8 h-8 rounded-xl flex items-center justify-center text-dark/30 hover:text-primary hover:bg-primary/8 transition-colors">
        <MoreHorizontal className="w-4 h-4" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 6, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 4, scale: 0.96 }}
            transition={{ duration: 0.16 }} className="absolute right-0 top-full mt-1 w-48 glass-card rounded-2xl p-1.5 shadow-lift z-50">
            {actions.map((a) => (
              <button key={a.id} onClick={() => { onAction(a.id, customer); setOpen(false) }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-dark/70 hover:bg-primary/8 transition-colors ${a.danger ? 'text-red-500 hover:bg-red-50 hover:text-red-600' : ''}`}>
                <a.icon className={`w-4 h-4 ${a.color}`} /> {a.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ================= MAIN PAGE ================= */
export default function CustomersPage() {
  const navigate = useNavigate()
  const { customers, loading, toggleBlock, deleteCustomers } = useCustomers()
  const { addToast } = useToast()

  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState(INITIAL_FILTERS)
  const [filterOpen, setFilterOpen] = useState(false)
  const [sortBy, setSortBy] = useState('lifetimeSpend')
  const [sortDir, setSortDir] = useState('desc')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState(new Set())
  const [deleteTarget, setDeleteTarget] = useState(null)

  const counts = useMemo(() => {
    const c = { total: customers.length, lifetimeSpend: 0 }
    for (const t of CUSTOMER_TAGS) c[t.value] = 0
    for (const cu of customers) { c[cu.tag] = (c[cu.tag] || 0) + 1; c.lifetimeSpend += cu.lifetimeSpend }
    return c
  }, [customers])

  const filtered = useMemo(() => {
    let list = [...customers]
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter((c) => c.name.toLowerCase().includes(q) || c.phone.replace(/\s+/g, '').includes(q.replace(/\s+/g, '')) || c.email.toLowerCase().includes(q))
    }
    if (filters.tag) list = list.filter((c) => c.tag === filters.tag)
    if (filters.blocked === 'active') list = list.filter((c) => !c.blocked)
    if (filters.blocked === 'blocked') list = list.filter((c) => c.blocked)
    list.sort((a, b) => {
      let va, vb
      if (sortBy === 'name') { va = a.name.toLowerCase(); vb = b.name.toLowerCase() }
      else if (sortBy === 'totalOrders') { va = a.totalOrders; vb = b.totalOrders }
      else { va = a[sortBy] || 0; vb = b[sortBy] || 0 }
      if (typeof va === 'string') { if (sortDir === 'asc') return va > vb ? 1 : va < vb ? -1 : 0; return va < vb ? 1 : va > vb ? -1 : 0 }
      return sortDir === 'asc' ? va - vb : vb - va
    })
    return list
  }, [customers, search, filters, sortBy, sortDir])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const paged = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const toggleSelect = (id) => setSelected((prev) => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n })
  const selectAll = () => setSelected((prev) => (prev.size === paged.length && paged.length > 0 ? new Set() : new Set(paged.map((c) => c._id))))

  const handleRowAction = (action, customer) => {
    if (action === 'view') navigate(`/admin/customers/${customer._id}`)
    else if (action === 'call') addToast(`Calling ${customer.name} (demo)`, 'info', 2000)
    else if (action === 'whatsapp') addToast(`Opening WhatsApp with ${customer.name} (demo)`, 'info', 2000)
    else if (action === 'email') addToast(`Opening email to ${customer.email} (demo)`, 'info', 2000)
    else if (action === 'block') toggleBlock(customer._id)
  }

  const handleBulk = (action) => {
    const ids = [...selected]
    if (!ids.length) return
    if (action === 'export') addToast(`Exporting ${ids.length} customers (demo)`, 'success', 2400)
    else if (action === 'delete') setDeleteTarget({ bulk: true })
    else if (action === 'block') { ids.forEach((id) => toggleBlock(id)); setSelected(new Set()) }
  }

  const sortOpts = [
    { v: 'lifetimeSpend', l: 'Lifetime Spend' },
    { v: 'totalOrders', l: 'Total Orders' },
    { v: 'name', l: 'Name' },
    { v: 'lastActiveAt', l: 'Last Active' },
    { v: 'joinedAt', l: 'Joined' },
  ]

  const hasActiveFilters = Object.values(filters).some((v) => v !== '')

  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <h1 className="font-serif-display text-2xl font-bold text-dark tracking-tight">Customers</h1>
            <p className="text-xs text-dark/45 mt-0.5">{counts.total} registered · {inr(counts.lifetimeSpend)} total lifetime spend · {counts.vip} VIP</p>
          </div>
          <button onClick={() => addToast('Customer export started (demo)', 'success', 2400)} className="ml-auto inline-flex items-center gap-2 h-10 px-4 rounded-2xl bg-gradient-to-r from-primary to-primary-dark text-white text-xs font-bold shadow-md shadow-primary/15 hover:shadow-lg hover:-translate-y-0.5 transition-all">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
        <div className="mt-4"><KpiStrip counts={counts} tagFilter={filters.tag} onSelect={(t) => { setFilters((f) => ({ ...f, tag: t })); setPage(1) }} /></div>
      </motion.div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark/30" />
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} placeholder="Search by name, phone, email…"
            className="w-full h-10 pl-10 pr-4 rounded-2xl bg-white border border-black/5 text-sm text-dark placeholder:text-dark/30 focus:outline-none focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all" />
        </div>
        <button onClick={() => setFilterOpen(true)} className={`inline-flex items-center gap-1.5 h-10 px-4 rounded-2xl bg-white border text-xs font-bold transition-all ${hasActiveFilters ? 'border-primary text-primary bg-primary/5' : 'border-black/5 text-dark/60 hover:border-primary/25 hover:text-primary'}`}>
          <Filter className="w-3.5 h-3.5" /> Filters {hasActiveFilters && <span className="w-4.5 h-4.5 rounded-full bg-primary text-white text-[9px] flex items-center justify-center">{Object.values(filters).filter(Boolean).length}</span>}
        </button>
        <div className="relative">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="h-10 pl-3 pr-8 rounded-2xl bg-white border border-black/5 text-xs font-bold text-dark/60 appearance-none focus:outline-none focus:border-primary/25">
            {sortOpts.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
          </select>
          <ArrowUpDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-dark/30 pointer-events-none" />
        </div>
        <button onClick={() => setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))} className="w-10 h-10 rounded-2xl bg-white border border-black/5 flex items-center justify-center text-dark/40 hover:text-primary transition-colors">
          <motion.span animate={{ rotate: sortDir === 'asc' ? 0 : 180 }} className="block"><ChevronDown className="w-4 h-4" /></motion.span>
        </button>
      </div>

      <AnimatePresence>
        {selected.size > 0 && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="flex flex-wrap items-center gap-3 bg-primary/8 rounded-2xl border border-primary/15 px-4 py-3">
            <span className="text-xs font-bold text-primary">{selected.size} selected</span>
            <div className="flex flex-wrap items-center gap-2 ml-auto">
              {[
                { v: 'block', l: 'Block', icon: Ban, c: 'bg-amber-100 text-amber-700' },
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
          <table className="w-full text-left min-w-[1050px]">
            <thead>
              <tr className="border-b border-black/5">
                <th className="px-4 py-3.5 w-10"><input type="checkbox" checked={selected.size === paged.length && paged.length > 0} onChange={selectAll} className="w-4 h-4 rounded accent-[#2E7D32]" /></th>
                {['Customer', 'Tag', 'Phone', 'Orders', 'Lifetime Spend', 'Avg Order', 'Last Active', 'Status', ''].map((h, i) => (
                  <th key={i} className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider text-dark/35 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.map((c, i) => (
                <motion.tr key={c._id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.03, ease: [0.22, 1, 0.36, 1] }}
                  className="border-b border-black/4 last:border-0 hover:bg-primary/[0.02] transition-colors group">
                  <td className="px-4 py-3.5"><input type="checkbox" checked={selected.has(c._id)} onChange={() => toggleSelect(c._id)} className="w-4 h-4 rounded accent-[#2E7D32]" /></td>
                  <td className="px-4 py-3.5">
                    <button onClick={() => navigate(`/admin/customers/${c._id}`)} className="flex items-center gap-3 text-left hover:opacity-80 transition-opacity">
                      <Avatar name={c.name} size={36} />
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-dark truncate">{c.name}</p>
                        <p className="text-[10px] text-dark/40 truncate">{c.email}</p>
                      </div>
                    </button>
                  </td>
                  <td className="px-4 py-3.5"><TagBadge tag={c.tag} /></td>
                  <td className="px-4 py-3.5 text-xs text-dark/60 whitespace-nowrap">{c.phone}</td>
                  <td className="px-4 py-3.5 text-sm font-black text-dark">{c.totalOrders}</td>
                  <td className="px-4 py-3.5 text-sm font-black text-primary">{inr(c.lifetimeSpend)}</td>
                  <td className="px-4 py-3.5 text-xs text-dark/55">{inr(c.avgOrderValue)}</td>
                  <td className="px-4 py-3.5 text-xs text-dark/45 whitespace-nowrap">{timeAgo(c.lastActiveAt)}</td>
                  <td className="px-4 py-3.5">
                    {c.blocked
                      ? <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-500 bg-red-50 border border-red-200 px-2.5 py-1 rounded-full"><Ban className="w-3 h-3" /> Blocked</span>
                      : <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full"><ShieldCheck className="w-3 h-3" /> Active</span>}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => navigate(`/admin/customers/${c._id}`)} className="w-8 h-8 rounded-xl flex items-center justify-center text-dark/30 hover:text-primary hover:bg-primary/8 transition-colors opacity-0 group-hover:opacity-100">
                        <Eye className="w-4 h-4" />
                      </button>
                      <RowActions customer={c} onAction={handleRowAction} />
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-20 text-center">
              <span className="w-16 h-16 mx-auto rounded-3xl bg-primary/8 flex items-center justify-center"><Tag className="w-8 h-8 text-primary" /></span>
              <h3 className="mt-5 font-serif-display text-xl font-bold text-dark">No customers found</h3>
              <p className="mt-1.5 text-sm text-dark/45 font-light">Try a different search or clear filters.</p>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-black/5">
          <p className="text-[11px] text-dark/40">{filtered.length === 0 ? 'No results' : <>Showing {((safePage - 1) * PAGE_SIZE) + 1}–{Math.min(safePage * PAGE_SIZE, filtered.length)} of {filtered.length}</>}</p>
          <div className="flex items-center gap-1.5">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={safePage <= 1} className="w-8 h-8 rounded-xl flex items-center justify-center text-dark/30 hover:bg-primary/8 disabled:opacity-30"><ChevronLeft className="w-4 h-4" /></button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => { const pn = i + 1; return <button key={pn} onClick={() => setPage(pn)} className={`w-8 h-8 rounded-xl text-xs font-bold flex items-center justify-center transition-all ${pn === safePage ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-dark/45 hover:bg-primary/8'}`}>{pn}</button> })}
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={safePage >= totalPages} className="w-8 h-8 rounded-xl flex items-center justify-center text-dark/30 hover:bg-primary/8 disabled:opacity-30"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
        </>
        )}
      </div>

      <FilterPanel open={filterOpen} onClose={() => setFilterOpen(false)} filters={filters} setFilters={setFilters} onClear={() => { setFilters(INITIAL_FILTERS); setPage(1) }} />
      <AnimatePresence>
        {deleteTarget && (
          <ConfirmModal open title="Delete customers?" message={`${selected.size} customer records will be permanently removed.`} confirmLabel="Delete"
            onClose={() => setDeleteTarget(null)} onConfirm={() => { deleteCustomers([...selected]); setSelected(new Set()); setDeleteTarget(null) }} />
        )}
      </AnimatePresence>
    </div>
  )
}
