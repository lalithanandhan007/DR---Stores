import { useState, useMemo, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Filter, ArrowUpDown, ChevronDown, ChevronLeft, ChevronRight, X,
  MoreHorizontal, Phone, Truck, Star, Clock, Package, Eye, CheckCircle2, ToggleLeft, ToggleRight,
} from 'lucide-react'
import { DELIVERY_STATUSES, getDeliveryStatusMeta, deliveryPerformance } from '../../data/deliveryData'
import { useDelivery } from '../../context/DeliveryContext'
import { useToast } from '../../context/CartContext'
import { inr, timeAgo } from '../../utils/format'

const PAGE_SIZE = 10

/* ================= STATUS BADGE ================= */
function DeliveryBadge({ status }) {
  const meta = getDeliveryStatusMeta(status)
  return (
    <motion.span key={status} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center gap-1.5 rounded-full border font-bold whitespace-nowrap text-[10px] px-2.5 py-1 ${meta.badge}`}>
      {status === 'online' || status === 'on_delivery' ? (
        <span className="relative flex w-1.5 h-1.5"><span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${meta.dot}`} /><span className={`relative inline-flex rounded-full w-1.5 h-1.5 ${meta.dot}`} /></span>
      ) : <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />}
      {meta.label}
    </motion.span>
  )
}

/* ================= KPI STRIP ================= */
function KpiStrip({ counts, statusFilter, onSelect }) {
  const chips = [
    { key: '', label: 'All Partners', value: counts.total, tint: 'bg-dark text-white' },
    { key: 'online', label: 'Online', value: counts.online, tint: 'bg-emerald-50 text-emerald-600' },
    { key: 'on_delivery', label: 'On Delivery', value: counts.on_delivery, tint: 'bg-primary/8 text-primary' },
    { key: 'offline', label: 'Offline', value: counts.offline, tint: 'bg-gray-100 text-gray-500' },
  ]
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 admin-scroll -mx-1 px-1">
      {chips.map((c) => {
        const active = statusFilter === c.key
        return (
          <button key={c.key || 'all'} onClick={() => onSelect(c.key)}
            className={`shrink-0 inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl border text-xs font-bold transition-all ${active ? 'border-primary bg-primary text-white shadow-md shadow-primary/20' : `${c.tint} border-transparent hover:border-black/10 bg-white`}`}>
            {c.value > 0 && <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${active ? 'bg-white/20 text-white' : 'bg-black/5'}`}>{c.value}</span>}
            {c.label}
          </button>
        )
      })}
      <div className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white border border-black/5 text-xs font-bold text-dark/60">
        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" /> {counts.onTimePct}% on-time
      </div>
    </div>
  )
}

/* ================= ROW ACTIONS ================= */
function RowActions({ partner, onAction }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    const fn = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])
  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen((o) => !o)} className="w-8 h-8 rounded-xl flex items-center justify-center text-dark/30 hover:text-primary hover:bg-primary/8 transition-colors">
        <MoreHorizontal className="w-4 h-4" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 6, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 4, scale: 0.96 }}
            transition={{ duration: 0.16 }} className="absolute right-0 top-full mt-1 w-48 glass-card rounded-2xl p-1.5 shadow-lift z-50">
            {[
              { id: 'toggle', label: partner.status === 'offline' ? 'Go Online' : 'Go Offline', icon: partner.status === 'offline' ? ToggleRight : ToggleLeft, color: 'text-primary' },
              { id: 'call', label: 'Call', icon: Phone, color: 'text-emerald-600' },
            ].map((a) => (
              <button key={a.id} onClick={() => { onAction(a.id, partner); setOpen(false) }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-dark/70 hover:bg-primary/8 transition-colors">
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
export default function DeliveryPage() {
  const { partners, toggleOnline } = useDelivery()
  const { addToast } = useToast()
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({ status: '' })
  const [filterOpen, setFilterOpen] = useState(false)
  const [sortBy, setSortBy] = useState('rating')
  const [sortDir, setSortDir] = useState('desc')
  const [page, setPage] = useState(1)
  const [viewPartner, setViewPartner] = useState(null)

  const counts = useMemo(() => {
    const c = { total: partners.length, totalDeliveries: 0, onTimePct: 0 }
    for (const s of DELIVERY_STATUSES) c[s.value] = 0
    for (const p of partners) { c[p.status] = (c[p.status] || 0) + 1; c.totalDeliveries += p.totalDeliveries }
    c.onTimePct = Math.round(partners.reduce((s, p) => s + p.onTimePercentage, 0) / partners.length)
    return c
  }, [partners])

  const filtered = useMemo(() => {
    let list = [...partners]
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.phone.includes(q) || p.vehicle.toLowerCase().includes(q))
    }
    if (filters.status) list = list.filter((p) => p.status === filters.status)
    list.sort((a, b) => {
      let va = a[sortBy], vb = b[sortBy]
      if (typeof va === 'string') { va = va?.toLowerCase(); vb = vb?.toLowerCase() }
      return sortDir === 'asc' ? (va > vb ? 1 : va < vb ? -1 : 0) : (va < vb ? 1 : va > vb ? -1 : 0)
    })
    return list
  }, [partners, search, filters, sortBy, sortDir])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const paged = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const handleAction = (action, partner) => {
    if (action === 'toggle') toggleOnline(partner._id)
    else if (action === 'call') addToast(`Calling ${partner.name} (demo)`, 'info', 2000)
  }

  const hasActiveFilters = Object.values(filters).some((v) => v !== '')
  const sortOpts = [
    { v: 'rating', l: 'Rating' }, { v: 'totalDeliveries', l: 'Deliveries' },
    { v: 'onTimePercentage', l: 'On-Time %' }, { v: 'name', l: 'Name' },
  ]

  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <h1 className="font-serif-display text-2xl font-bold text-dark tracking-tight">Delivery Partners</h1>
            <p className="text-xs text-dark/45 mt-0.5">{counts.total} partners · {counts.totalDeliveries.toLocaleString('en-IN')} total deliveries · {counts.onTimePct}% on-time</p>
          </div>
        </div>
        <div className="mt-4"><KpiStrip counts={counts} statusFilter={filters.status} onSelect={(s) => { setFilters((f) => ({ ...f, status: s })); setPage(1) }} /></div>
      </motion.div>

      {/* Performance bar chart */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-white rounded-3xl border border-black/5 shadow-soft p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div><h3 className="text-sm font-bold text-dark">Weekly Performance</h3><p className="text-[11px] text-dark/40 mt-0.5">Deliveries vs on-time completion</p></div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-dark/45"><span className="w-2 h-2 rounded-full bg-primary" /> Delivered</span>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-dark/45"><span className="w-2 h-2 rounded-full bg-emerald-400" /> On Time</span>
          </div>
        </div>
        <div className="flex items-end gap-3 h-40">
          {deliveryPerformance.map((d, i) => {
            const maxVal = Math.max(...deliveryPerformance.map((x) => x.delivered))
            const h1 = (d.delivered / maxVal) * 100
            const h2 = (d.onTime / maxVal) * 100
            return (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] font-bold text-dark/40">{d.delivered}</span>
                <div className="w-full flex items-end gap-1" style={{ height: '100px' }}>
                  <motion.div initial={{ height: 0 }} animate={{ height: `${h1}%` }} transition={{ duration: 0.5, delay: i * 0.05 }}
                    className="flex-1 bg-primary/20 rounded-t-md" />
                  <motion.div initial={{ height: 0 }} animate={{ height: `${h2}%` }} transition={{ duration: 0.5, delay: i * 0.05 + 0.1 }}
                    className="flex-1 bg-emerald-400 rounded-t-md" />
                </div>
                <span className="text-[10px] font-bold text-dark/40">{d.day}</span>
              </div>
            )
          })}
        </div>
      </motion.div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark/30" />
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} placeholder="Search by name, phone, vehicle…"
            className="w-full h-10 pl-10 pr-4 rounded-2xl bg-white border border-black/5 text-sm text-dark placeholder:text-dark/30 focus:outline-none focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all" />
        </div>
        <button onClick={() => setFilterOpen(true)} className={`inline-flex items-center gap-1.5 h-10 px-4 rounded-2xl bg-white border text-xs font-bold transition-all ${hasActiveFilters ? 'border-primary text-primary bg-primary/5' : 'border-black/5 text-dark/60 hover:border-primary/25 hover:text-primary'}`}>
          <Filter className="w-3.5 h-3.5" /> Filters
        </button>
        <div className="relative">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="h-10 pl-3 pr-8 rounded-2xl bg-white border border-black/5 text-xs font-bold text-dark/60 appearance-none focus:outline-none focus:border-primary/25">
            {sortOpts.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
          </select>
          <ArrowUpDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-dark/30 pointer-events-none" />
        </div>
        <button onClick={() => setSortDir((d) => d === 'asc' ? 'desc' : 'asc')} className="w-10 h-10 rounded-2xl bg-white border border-black/5 flex items-center justify-center text-dark/40 hover:text-primary transition-colors">
          <motion.span animate={{ rotate: sortDir === 'asc' ? 0 : 180 }} className="block"><ChevronDown className="w-4 h-4" /></motion.span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-black/5 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[1100px]">
            <thead>
              <tr className="border-b border-black/5">
                {['Partner', 'Vehicle', 'Status', 'Rating', 'Deliveries', 'On-Time', 'Avg Time', 'Today', 'Zone', ''].map((h, i) => (
                  <th key={i} className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-dark/35 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.map((p, i) => (
                <motion.tr key={p._id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.03, ease: [0.22, 1, 0.36, 1] }}
                  className="border-b border-black/4 last:border-0 hover:bg-primary/[0.02] transition-colors group">
                  <td className="px-5 py-3.5">
                    <button onClick={() => setViewPartner(p)} className="flex items-center gap-3 text-left hover:opacity-80 transition-opacity">
                      <span className="w-10 h-10 rounded-xl bg-primary/8 text-primary flex items-center justify-center shrink-0"><Truck className="w-5 h-5" /></span>
                      <div><p className="text-sm font-bold text-dark">{p.name}</p><p className="text-[10px] text-dark/40">{p.phone}</p></div>
                    </button>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-dark/55 whitespace-nowrap">{p.vehicle.split('·')[0].trim()}</td>
                  <td className="px-5 py-3.5"><DeliveryBadge status={p.status} /></td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600"><Star className="w-3 h-3 fill-amber-400" /> {p.rating}</span>
                  </td>
                  <td className="px-5 py-3.5 text-sm font-black text-dark">{p.totalDeliveries.toLocaleString('en-IN')}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-dark/60">{p.onTimePercentage}%</span>
                      <div className="w-12 h-1.5 rounded-full bg-black/5 overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${p.onTimePercentage}%` }} transition={{ duration: 0.6, delay: i * 0.05 }}
                          className={`h-full rounded-full ${p.onTimePercentage >= 90 ? 'bg-emerald-400' : p.onTimePercentage >= 80 ? 'bg-amber-400' : 'bg-red-400'}`} />
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-dark/55">{p.avgDeliveryTime} min</td>
                  <td className="px-5 py-3.5 text-sm font-black text-primary">{p.todayDeliveries}</td>
                  <td className="px-5 py-3.5 text-[11px] text-dark/40 max-w-[120px] truncate">{p.zone}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setViewPartner(p)} className="w-8 h-8 rounded-xl flex items-center justify-center text-dark/30 hover:text-primary hover:bg-primary/8 transition-colors opacity-0 group-hover:opacity-100">
                        <Eye className="w-4 h-4" />
                      </button>
                      <RowActions partner={p} onAction={handleAction} />
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-20 text-center">
              <span className="w-16 h-16 mx-auto rounded-3xl bg-primary/8 flex items-center justify-center"><Truck className="w-8 h-8 text-primary" /></span>
              <h3 className="mt-5 font-serif-display text-xl font-bold text-dark">No delivery partners found</h3>
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
      </div>

      {/* Partner detail modal */}
      <AnimatePresence>
        {viewPartner && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[90] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-dark/40 backdrop-blur-sm" onClick={() => setViewPartner(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 26 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[88vh] flex flex-col">
              <div className="px-6 pt-6 pb-5 bg-gradient-to-br from-primary to-primary-dark">
                <button onClick={() => setViewPartner(null)} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/15 text-white flex items-center justify-center hover:bg-white/25 transition-colors"><X className="w-4 h-4" /></button>
                <div className="flex items-center gap-3">
                  <span className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center"><Truck className="w-6 h-6 text-white" /></span>
                  <div>
                    <h3 className="font-serif-display text-xl font-bold text-white">{viewPartner.name}</h3>
                    <p className="text-xs text-white/70">{viewPartner.vehicle}</p>
                  </div>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-4 admin-scroll">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Rating', value: `★ ${viewPartner.rating}` },
                    { label: 'Total Deliveries', value: viewPartner.totalDeliveries.toLocaleString('en-IN') },
                    { label: 'On-Time', value: `${viewPartner.onTimePercentage}%` },
                  ].map((s) => (
                    <div key={s.label} className="rounded-2xl bg-cream p-3 text-center">
                      <p className="text-lg font-black text-dark">{s.value}</p>
                      <p className="text-[10px] text-dark/40">{s.label}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-2 text-xs">
                  {[
                    { icon: Phone, text: viewPartner.phone },
                    { icon: Clock, text: viewPartner.shift },
                    { icon: Package, text: viewPartner.zone },
                    { icon: Star, text: `Avg delivery time: ${viewPartner.avgDeliveryTime} min` },
                  ].map((r, i) => (
                    <div key={i} className="flex items-center gap-2.5"><r.icon className="w-4 h-4 text-primary shrink-0" /><span className="text-dark/60">{r.text}</span></div>
                  ))}
                </div>
                {viewPartner.recentDeliveries?.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-dark/60 mb-2">Recent deliveries</p>
                    <div className="space-y-2">
                      {viewPartner.recentDeliveries.map((d) => (
                        <div key={d.orderId} className="flex items-center gap-3 rounded-xl bg-cream px-3 py-2.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-dark">{d.orderId} → {d.customer}</p>
                            <p className="text-[10px] text-dark/40">{timeAgo(d.time)} · {inr(d.earnings)}</p>
                          </div>
                          {d.rating && <span className="text-[10px] font-bold text-amber-600">★ {d.rating}</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter */}
      <AnimatePresence>
        {filterOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[80] flex items-start justify-end">
            <div className="absolute inset-0 bg-dark/40 backdrop-blur-sm" onClick={() => setFilterOpen(false)} />
            <motion.div initial={{ x: 360 }} animate={{ x: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="relative w-[340px] max-w-full h-full bg-white shadow-lift p-6 overflow-y-auto admin-scroll">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-base font-bold text-dark">Filters</h3>
                <button onClick={() => setFilterOpen(false)} className="w-8 h-8 rounded-full flex items-center justify-center text-dark/30 hover:bg-black/5"><X className="w-4 h-4" /></button>
              </div>
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-dark/60 mb-2">Status</label>
                  <select value={filters.status} onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))} className="w-full h-10 px-3 rounded-xl bg-cream border border-black/8 text-sm text-dark focus:outline-none focus:border-primary/30">
                    <option value="">All statuses</option>
                    {DELIVERY_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
                <button onClick={() => { setFilters({ status: '' }); setPage(1); setFilterOpen(false) }} className="w-full h-10 rounded-xl border border-black/8 text-xs font-bold text-dark/50 hover:border-red-300 hover:text-red-500 transition-all">Clear All Filters</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
