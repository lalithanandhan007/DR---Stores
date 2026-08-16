import { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Filter, Download, ArrowUpDown, ChevronDown, ChevronLeft, ChevronRight, X,
  Package, AlertTriangle, PackageCheck, Plus, History, MoreHorizontal, RefreshCcw, Boxes,
} from 'lucide-react'
import { INVENTORY_STATUSES, getInventoryStatusMeta } from '../../data/inventoryData'
import { useInventory } from '../../context/InventoryContext'
import { useToast } from '../../context/CartContext'
import { inr, formatDateTime, timeAgo } from '../../utils/format'

const PAGE_SIZE = 10
const INITIAL_FILTERS = { status: '' }

/* ================= STATUS BADGE ================= */
function StockBadge({ status }) {
  const meta = getInventoryStatusMeta(status)
  return (
    <motion.span key={status} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center gap-1.5 rounded-full border font-bold whitespace-nowrap text-[10px] px-2.5 py-1 ${meta.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} /> {meta.label}
    </motion.span>
  )
}

/* ================= KPI STRIP ================= */
function KpiStrip({ counts, statusFilter, onSelect }) {
  const chips = [
    { key: '', label: 'All Items', value: counts.total, tint: 'bg-dark text-white' },
    { key: 'in_stock', label: 'In Stock', value: counts.in_stock, tint: 'bg-emerald-50 text-emerald-600' },
    { key: 'low', label: 'Low Stock', value: counts.low, tint: 'bg-amber-50 text-amber-600' },
    { key: 'out_of_stock', label: 'Out of Stock', value: counts.out_of_stock, tint: 'bg-red-50 text-red-500' },
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
        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" /> {counts.totalValue} value
      </div>
    </div>
  )
}

/* ================= RESTOCK MODAL ================= */
function RestockModal({ item, onClose }) {
  const { restock } = useInventory()
  const { addToast } = useToast()
  const [qty, setQty] = useState(50)
  const [busy, setBusy] = useState(false)
  if (!item) return null
  const handle = () => {
    if (qty <= 0) return
    setBusy(true)
    setTimeout(() => { restock(item._id, qty); setBusy(false); onClose() }, 600)
  }
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-dark/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.94, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 26 }}
        className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-7">
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-dark/30 hover:bg-black/5"><X className="w-4 h-4" /></button>
        <div className="flex items-center gap-3 mb-5">
          <span className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl" style={{ background: `linear-gradient(135deg, ${item.gradient[0]}25, ${item.gradient[1]}12)` }}>{item.emoji}</span>
          <div><p className="font-bold text-dark">{item.productName}</p><p className="text-[10px] text-dark/40">{item.sku} · Current: {item.currentStock}</p></div>
        </div>
        <label className="block text-xs font-bold text-dark/60 mb-2">Restock quantity</label>
        <div className="flex gap-2 mb-4">
          {[25, 50, 100, 200].map((q) => (
            <button key={q} onClick={() => setQty(q)} className={`flex-1 py-2 rounded-xl text-xs font-bold border-2 transition-all ${qty === q ? 'border-primary bg-primary text-white' : 'border-black/8 text-dark/55 hover:border-primary/20'}`}>{q}</button>
          ))}
        </div>
        <input type="number" min={1} value={qty} onChange={(e) => setQty(Number(e.target.value) || 0)}
          className="w-full h-11 px-4 rounded-xl bg-cream border border-black/8 text-sm text-dark font-bold text-center focus:outline-none focus:border-primary/30 mb-4" />
        <button onClick={handle} disabled={busy || qty <= 0}
          className="w-full h-12 rounded-2xl bg-gradient-to-r from-primary to-primary-dark text-white text-sm font-bold shadow-lg shadow-primary/15 flex items-center justify-center gap-2 hover:shadow-xl transition-all disabled:opacity-50">
          {busy ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><RefreshCcw className="w-4 h-4" /> Restock {qty} units</>}
        </button>
      </motion.div>
    </motion.div>
  )
}

/* ================= MAIN PAGE ================= */
export default function InventoryPage() {
  const { inventory, history, bulkRestock, loading } = useInventory()
  const { addToast } = useToast()
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState(INITIAL_FILTERS)
  const [filterOpen, setFilterOpen] = useState(false)
  const [sortBy, setSortBy] = useState('currentStock')
  const [sortDir, setSortDir] = useState('asc')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState(new Set())
  const [restockItem, setRestockItem] = useState(null)
  const [tab, setTab] = useState('stock') // stock | history

  const counts = useMemo(() => {
    const c = { total: inventory.length, totalValue: 0 }
    for (const s of INVENTORY_STATUSES) c[s.value] = 0
    for (const item of inventory) { c[item.status] = (c[item.status] || 0) + 1; c.totalValue += item.sellingPrice * item.currentStock }
    return c
  }, [inventory])

  const filtered = useMemo(() => {
    let list = [...inventory]
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter((i) => i.productName.toLowerCase().includes(q) || i.sku?.toLowerCase().includes(q) || i._id.toLowerCase().includes(q))
    }
    if (filters.status) list = list.filter((i) => i.status === filters.status)
    list.sort((a, b) => {
      let va = a[sortBy], vb = b[sortBy]
      if (typeof va === 'string') { va = va?.toLowerCase(); vb = vb?.toLowerCase() }
      return sortDir === 'asc' ? (va > vb ? 1 : va < vb ? -1 : 0) : (va < vb ? 1 : va > vb ? -1 : 0)
    })
    return list
  }, [inventory, search, filters, sortBy, sortDir])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const paged = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const toggleSelect = (id) => setSelected((prev) => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n })
  const selectAll = () => setSelected((prev) => (prev.size === paged.length && paged.length > 0 ? new Set() : new Set(paged.map((i) => i._id))))

  const hasActiveFilters = Object.values(filters).some((v) => v !== '')
  const sortOpts = [
    { v: 'currentStock', l: 'Stock Level' }, { v: 'productName', l: 'Name' },
    { v: 'sellingPrice', l: 'Price' }, { v: 'lastRestocked', l: 'Last Restocked' },
  ]

  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <h1 className="font-serif-display text-2xl font-bold text-dark tracking-tight">Inventory</h1>
            <p className="text-xs text-dark/45 mt-0.5">{counts.total} items · {inr(counts.totalValue)} total stock value · {counts.low} low stock</p>
          </div>
          <button
  onClick={() => {
    const headers = [
      'Product',
      'SKU',
      'Current Stock',
      'Minimum Stock',
      'Reserved',
      'Incoming',
      'Stock Value',
      'Status',
      'Last Restock',
    ]

    const escapeCsv = (value) => {
      const text = String(value ?? '')
      return `"${text.replace(/"/g, '""')}"`
    }

    const rows = inventory.map((item) => [
      item.name,
      item.sku,
      item.currentStock,
      item.minStock,
      item.reserved,
      item.incoming,
      item.value,
      item.status,
      item.lastRestocked
        ? new Date(item.lastRestocked).toLocaleString('en-IN')
        : '',
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
    link.download = `dr-stores-inventory-${new Date().toISOString().slice(0, 10)}.csv`

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    addToast(`${inventory.length} inventory items exported as CSV`, 'success', 2600)
  }}
  className="ml-auto inline-flex items-center gap-2 h-10 px-4 rounded-2xl bg-gradient-to-r from-primary to-primary-dark text-white text-xs font-bold shadow-md shadow-primary/15 hover:shadow-lg hover:-translate-y-0.5 transition-all"
>
  <Download className="w-4 h-4" /> Export
</button>
        </div>
        <div className="mt-4"><KpiStrip counts={counts} statusFilter={filters.status} onSelect={(s) => { setFilters((f) => ({ ...f, status: s })); setPage(1) }} /></div>
      </motion.div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-white rounded-2xl border border-black/5 p-1 w-fit">
        {[{ id: 'stock', label: 'Stock Table', icon: Package }, { id: 'history', label: 'Stock History', icon: History }].map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${tab === t.id ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-dark/50 hover:text-primary'}`}>
            <t.icon className="w-3.5 h-3.5" /> {t.label}
          </button>
        ))}
      </div>

      {tab === 'stock' && (
        <>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark/30" />
              <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} placeholder="Search by name, SKU…"
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
            {selected.size > 0 && (
              <button onClick={() => { bulkRestock([...selected], 50); setSelected(new Set()) }}
                className="inline-flex items-center gap-1.5 h-10 px-4 rounded-2xl bg-primary/10 text-primary border border-primary/15 text-xs font-bold hover:bg-primary/15 transition-all">
                <Plus className="w-3.5 h-3.5" /> Bulk Restock ({selected.size})
              </button>
            )}
          </div>

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
                    {['Product', 'SKU', 'Current', 'Min', 'Reserved', 'Incoming', 'Value', 'Status', 'Last Restock', ''].map((h, i) => (
                      <th key={i} className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider text-dark/35 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paged.map((item, i) => {
                    const value = item.sellingPrice * item.currentStock
                    const pct = Math.min((item.currentStock / (item.minStock * 3)) * 100, 100)
                    return (
                      <motion.tr key={item._id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.03, ease: [0.22, 1, 0.36, 1] }}
                        className="border-b border-black/4 last:border-0 hover:bg-primary/[0.02] transition-colors group">
                        <td className="px-4 py-3"><input type="checkbox" checked={selected.has(item._id)} onChange={() => toggleSelect(item._id)} className="w-4 h-4 rounded accent-[#2E7D32]" /></td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-3">
                            <span className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0" style={{ background: `linear-gradient(135deg, ${item.gradient[0]}25, ${item.gradient[1]}12)` }}>
                              <span className="text-xl">{item.emoji}</span>
                            </span>
                            <div><p className="text-sm font-bold text-dark">{item.productName}</p></div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-[11px] font-mono text-dark/50">{item.sku}</td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-black ${item.status === 'out_of_stock' ? 'text-red-500' : item.status === 'low' ? 'text-amber-600' : 'text-dark'}`}>{item.currentStock}</span>
                            <div className="w-16 h-1.5 rounded-full bg-black/5 overflow-hidden">
                              <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6, delay: i * 0.05 }}
                                className={`h-full rounded-full ${item.status === 'low' ? 'bg-amber-400' : item.status === 'out_of_stock' ? 'bg-red-400' : 'bg-primary'}`} />
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-xs text-dark/45">{item.minStock}</td>
                        <td className="px-4 py-3.5 text-xs text-dark/45">{item.reservedStock}</td>
                        <td className="px-4 py-3.5 text-xs text-dark/55 font-semibold">{item.incomingStock > 0 ? `+${item.incomingStock}` : '—'}</td>
                        <td className="px-4 py-3.5 text-xs font-bold text-dark">{inr(value)}</td>
                        <td className="px-4 py-3.5"><StockBadge status={item.status} /></td>
                        <td className="px-4 py-3.5 text-[11px] text-dark/40">{timeAgo(item.lastRestocked)}</td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => setRestockItem(item)} className="inline-flex items-center gap-1 h-7 px-2.5 rounded-lg bg-primary/8 text-primary text-[10px] font-bold hover:bg-primary/15 transition-all opacity-0 group-hover:opacity-100">
                              <Plus className="w-3 h-3" /> Restock
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    )
                  })}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="py-20 text-center">
                  <span className="w-16 h-16 mx-auto rounded-3xl bg-primary/8 flex items-center justify-center"><Boxes className="w-8 h-8 text-primary" /></span>
                  <h3 className="mt-5 font-serif-display text-xl font-bold text-dark">No items found</h3>
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
        </>
      )}

      {tab === 'history' && (
        <div className="bg-white rounded-3xl border border-black/5 shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[700px]">
              <thead>
                <tr className="border-b border-black/5">
                  {['Time', 'Product', 'Type', 'Qty', 'Reason', 'By'].map((h) => (
                    <th key={h} className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-dark/35 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {history.slice(0, 50).map((entry, i) => (
                  <motion.tr key={entry._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                    className="border-b border-black/4 last:border-0 hover:bg-primary/[0.02] transition-colors">
                    <td className="px-5 py-3 text-xs text-dark/55 whitespace-nowrap">{formatDateTime(entry.timestamp)}</td>
                    <td className="px-5 py-3 text-xs font-bold text-dark">{entry.productId}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full border ${entry.quantity > 0 ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-red-50 text-red-500 border-red-200'}`}>
                        {entry.type}
                      </span>
                    </td>
                    <td className={`px-5 py-3 text-sm font-black ${entry.quantity > 0 ? 'text-emerald-600' : 'text-red-500'}`}>{entry.quantity > 0 ? '+' : ''}{entry.quantity}</td>
                    <td className="px-5 py-3 text-xs text-dark/55">{entry.reason}</td>
                    <td className="px-5 py-3 text-xs text-dark/40">{entry.performedBy}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Filter Modal */}
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
                  <label className="block text-xs font-bold text-dark/60 mb-2">Stock Status</label>
                  <select value={filters.status} onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))} className="w-full h-10 px-3 rounded-xl bg-cream border border-black/8 text-sm text-dark focus:outline-none focus:border-primary/30">
                    <option value="">All statuses</option>
                    {INVENTORY_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
                <button onClick={() => { setFilters(INITIAL_FILTERS); setPage(1); setFilterOpen(false) }} className="w-full h-10 rounded-xl border border-black/8 text-xs font-bold text-dark/50 hover:border-red-300 hover:text-red-500 transition-all">Clear All Filters</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>{restockItem && <RestockModal item={restockItem} onClose={() => setRestockItem(null)} />}</AnimatePresence>
    </div>
  )
}
