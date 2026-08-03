import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Filter, Download, ArrowUpDown, ChevronDown, ChevronLeft, ChevronRight, X,
  UserRound, ShoppingBag, Box, Users, ClipboardList, TicketPercent, Truck, Settings, AlertTriangle,
} from 'lucide-react'
import { ACTIVITY_TYPES, getActivityTypeMeta, severityColors } from '../../data/activityData'
import { useAdminData } from '../../context/AdminDataContext'
import { useToast } from '../../context/CartContext'
import { formatDateTime } from '../../utils/format'

const PAGE_SIZE = 15
const ICON_MAP = { user: UserRound, shoppingBag: ShoppingBag, box: Box, users: Users, clipboard: ClipboardList, ticket: TicketPercent, truck: Truck, settings: Settings, alert: AlertTriangle }

/* ================= KPI STRIP ================= */
function KpiStrip({ counts, typeFilter, onSelect }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 admin-scroll -mx-1 px-1">
      {[{ key: '', label: 'All', value: counts.total, tint: 'bg-dark text-white' },
        ...ACTIVITY_TYPES.map((t) => ({ key: t.value, label: t.label.split(' ')[0], value: counts[t.value] || 0, tint: t.color }))
      ].map((c) => {
        const active = typeFilter === c.key
        return (
          <button key={c.key || 'all'} onClick={() => onSelect(c.key)}
            className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-bold transition-all ${active ? 'border-primary bg-primary text-white shadow-md shadow-primary/20' : `${c.tint} border-transparent hover:border-black/10 bg-white`}`}>
            {c.value > 0 && <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md ${active ? 'bg-white/20 text-white' : 'bg-black/5'}`}>{c.value}</span>}
            {c.label}
          </button>
        )
      })}
    </div>
  )
}

/* ================= MAIN PAGE ================= */
export default function ActivityLogsPage() {
  const { addToast } = useToast()
  const { activity: activityLogs } = useAdminData()
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [severityFilter, setSeverityFilter] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)
  const [sortBy, setSortBy] = useState('timestamp')
  const [sortDir, setSortDir] = useState('desc')
  const [page, setPage] = useState(1)

  const counts = useMemo(() => {
    const c = { total: activityLogs.length }
    for (const t of ACTIVITY_TYPES) c[t.value] = 0
    for (const l of activityLogs) c[l.type] = (c[l.type] || 0) + 1
    return c
  }, [activityLogs])

  const filtered = useMemo(() => {
    let list = [...activityLogs]
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter((l) => l.action.toLowerCase().includes(q) || l.detail.toLowerCase().includes(q) || l.actor.toLowerCase().includes(q))
    }
    if (typeFilter) list = list.filter((l) => l.type === typeFilter)
    if (severityFilter) list = list.filter((l) => l.severity === severityFilter)
    list.sort((a, b) => {
      const va = new Date(a[sortBy]).getTime(), vb = new Date(b[sortBy]).getTime()
      return sortDir === 'asc' ? va - vb : vb - va
    })
    return list
  }, [activityLogs, search, typeFilter, severityFilter, sortBy, sortDir])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const paged = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)
  const hasActiveFilters = typeFilter || severityFilter

  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <h1 className="font-serif-display text-2xl font-bold text-dark tracking-tight">Activity Logs</h1>
            <p className="text-xs text-dark/45 mt-0.5">{counts.total} log entries · Audit trail of all admin actions</p>
          </div>
          <button onClick={() => addToast('Activity logs exported (demo)', 'success', 2400)} className="ml-auto inline-flex items-center gap-2 h-10 px-4 rounded-2xl bg-gradient-to-r from-primary to-primary-dark text-white text-xs font-bold shadow-md shadow-primary/15 hover:shadow-lg hover:-translate-y-0.5 transition-all">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
        <div className="mt-4"><KpiStrip counts={counts} typeFilter={typeFilter} onSelect={(t) => { setTypeFilter(t); setPage(1) }} /></div>
      </motion.div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark/30" />
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} placeholder="Search actions, details, actors…"
            className="w-full h-10 pl-10 pr-4 rounded-2xl bg-white border border-black/5 text-sm text-dark placeholder:text-dark/30 focus:outline-none focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all" />
        </div>
        <button onClick={() => setFilterOpen(true)} className={`inline-flex items-center gap-1.5 h-10 px-4 rounded-2xl bg-white border text-xs font-bold transition-all ${hasActiveFilters ? 'border-primary text-primary bg-primary/5' : 'border-black/5 text-dark/60 hover:border-primary/25 hover:text-primary'}`}>
          <Filter className="w-3.5 h-3.5" /> Filters {hasActiveFilters && <span className="w-4 h-4 rounded-full bg-primary text-white text-[9px] flex items-center justify-center">!</span>}
        </button>
        <div className="relative">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="h-10 pl-3 pr-8 rounded-2xl bg-white border border-black/5 text-xs font-bold text-dark/60 appearance-none focus:outline-none focus:border-primary/25">
            <option value="timestamp">Time</option><option value="action">Action</option>
          </select>
          <ArrowUpDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-dark/30 pointer-events-none" />
        </div>
        <button onClick={() => setSortDir((d) => d === 'asc' ? 'desc' : 'asc')} className="w-10 h-10 rounded-2xl bg-white border border-black/5 flex items-center justify-center text-dark/40 hover:text-primary transition-colors">
          <motion.span animate={{ rotate: sortDir === 'asc' ? 0 : 180 }} className="block"><ChevronDown className="w-4 h-4" /></motion.span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-black/5 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[850px]">
            <thead>
              <tr className="border-b border-black/5">
                {['Time', 'Type', 'Actor', 'Action', 'Detail', 'Severity'].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-dark/35 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.map((log, i) => {
                const typeMeta = getActivityTypeMeta(log.type)
                const TypeIcon = ICON_MAP[typeMeta.icon] || AlertTriangle
                return (
                  <motion.tr key={log._id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: i * 0.02 }}
                    className="border-b border-black/4 last:border-0 hover:bg-primary/[0.02] transition-colors">
                    <td className="px-5 py-3 text-xs text-dark/55 whitespace-nowrap">{formatDateTime(log.timestamp)}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full ${typeMeta.color}`}>
                        <TypeIcon className="w-3 h-3" /> {typeMeta.label.split(' ')[0]}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs font-semibold text-dark">{log.actor}</td>
                    <td className="px-5 py-3 text-xs font-bold text-dark">{log.action}</td>
                    <td className="px-5 py-3 text-xs text-dark/55 max-w-[250px] truncate">{log.detail}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${severityColors[log.severity]}`}>
                        {log.severity}
                      </span>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <span className="w-16 h-16 mx-auto rounded-3xl bg-primary/8 flex items-center justify-center"><ClipboardList className="w-8 h-8 text-primary" /></span>
              <h3 className="mt-5 font-serif-display text-xl font-bold text-dark">No logs found</h3>
              <p className="mt-1.5 text-sm text-dark/45 font-light">Try a different search or filter.</p>
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

      {/* Filter modal */}
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
                  <label className="block text-xs font-bold text-dark/60 mb-2">Activity Type</label>
                  <select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPage(1) }} className="w-full h-10 px-3 rounded-xl bg-cream border border-black/8 text-sm text-dark focus:outline-none focus:border-primary/30">
                    <option value="">All types</option>
                    {ACTIVITY_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-dark/60 mb-2">Severity</label>
                  <select value={severityFilter} onChange={(e) => { setSeverityFilter(e.target.value); setPage(1) }} className="w-full h-10 px-3 rounded-xl bg-cream border border-black/8 text-sm text-dark focus:outline-none focus:border-primary/30">
                    <option value="">All severities</option>
                    <option value="info">Info</option>
                    <option value="success">Success</option>
                    <option value="warning">Warning</option>
                    <option value="error">Error</option>
                  </select>
                </div>
                <button onClick={() => { setTypeFilter(''); setSeverityFilter(''); setPage(1); setFilterOpen(false) }} className="w-full h-10 rounded-xl border border-black/8 text-xs font-bold text-dark/50 hover:border-red-300 hover:text-red-500 transition-all">Clear All Filters</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
