import { useState, useMemo, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Filter, ArrowUpDown, ChevronDown, ChevronLeft, ChevronRight, X,
  Plus, MoreHorizontal, Eye, Pencil, Trash2, TicketPercent, TrendingUp, Percent,
  DollarSign, Calendar, Users, CheckCircle2, Ban,
} from 'lucide-react'
import { COUPON_TYPES, couponTargets, couponAnalytics } from '../../data/couponsData'
import { useCoupons } from '../../context/CouponsContext'
import { useToast } from '../../context/CartContext'
import ConfirmModal from '../../components/orders/ConfirmModal'
import { inr, formatDate, timeAgo } from '../../utils/format'

const PAGE_SIZE = 10

/* ================= COUPON BADGE ================= */
function CouponBadge({ active }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border font-bold text-[10px] px-2.5 py-1 ${active ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
      {active ? <CheckCircle2 className="w-3 h-3" /> : <Ban className="w-3 h-3" />}
      {active ? 'Active' : 'Disabled'}
    </span>
  )
}

/* ================= KPI STRIP ================= */
function KpiStrip({ counts }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {[
        { icon: TicketPercent, label: 'Total Coupons', value: counts.total, tint: 'bg-primary/10 text-primary' },
        { icon: CheckCircle2, label: 'Active', value: counts.active, tint: 'bg-emerald-50 text-emerald-600' },
        { icon: TrendingUp, label: 'Total Redemptions', value: counts.totalUsed.toLocaleString('en-IN'), tint: 'bg-blue-50 text-blue-600' },
        { icon: DollarSign, label: 'Revenue via Coupons', value: inr(couponsRevenue(couponAnalytics)), tint: 'bg-amber-50 text-amber-600' },
      ].map((s) => (
        <div key={s.label} className="bg-white rounded-2xl border border-black/5 shadow-soft p-4">
          <span className={`w-9 h-9 rounded-xl flex items-center justify-center ${s.tint}`}><s.icon className="w-4.5 h-4.5" /></span>
          <p className="mt-2.5 text-xl font-black text-dark">{s.value}</p>
          <p className="text-[10px] text-dark/40 mt-0.5">{s.label}</p>
        </div>
      ))}
    </div>
  )
}

function couponsRevenue(data) { return data.reduce((s, d) => s + d.revenue, 0) }

/* ================= COUPON FORM MODAL ================= */
function CouponFormModal({ coupon, onClose }) {
  const { addCoupon, updateCoupon } = useCoupons()
  const { addToast } = useToast()
  const isEdit = !!coupon
  const [form, setForm] = useState({
    code: coupon?.code || '', type: coupon?.type || 'flat', value: coupon?.value || '',
    maxDiscount: coupon?.maxDiscount || '', minOrder: coupon?.minOrder || '',
    usageLimit: coupon?.usageLimit || '', expiry: coupon?.expiry ? new Date(coupon.expiry).toISOString().split('T')[0] : '',
    description: coupon?.description || '', target: coupon?.target || 'all',
  })
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const handle = () => {
    if (!form.code || !form.value) return
    if (isEdit) {
      updateCoupon(coupon._id, { ...form, value: Number(form.value), maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : null, minOrder: Number(form.minOrder) || 0, usageLimit: Number(form.usageLimit) || 9999, expiry: form.expiry ? new Date(form.expiry).toISOString() : undefined })
    } else {
      addCoupon({ ...form, code: form.code.toUpperCase().trim(), value: Number(form.value), maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : null, minOrder: Number(form.minOrder) || 0, usageLimit: Number(form.usageLimit) || 9999, expiry: form.expiry ? new Date(form.expiry).toISOString() : undefined, active: true })
    }
    onClose()
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-dark/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.94, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 26 }}
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[88vh] flex flex-col">
        <div className="px-6 pt-6 pb-5 bg-gradient-to-br from-primary to-primary-dark">
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/15 text-white flex items-center justify-center hover:bg-white/25"><X className="w-4 h-4" /></button>
          <h3 className="font-serif-display text-xl font-bold text-white">{isEdit ? 'Edit Coupon' : 'Create Coupon'}</h3>
          <p className="text-xs text-white/70 mt-0.5">Configure discount rules and limits</p>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4 admin-scroll">
          <div>
            <label className="block text-[13px] font-semibold text-dark/70 mb-1.5">Coupon Code *</label>
            <input value={form.code} onChange={(e) => set('code', e.target.value.toUpperCase())} placeholder="e.g. SUMMER30"
              className="w-full h-11 px-4 rounded-xl bg-cream border border-black/8 text-sm text-dark font-bold tracking-wider placeholder:text-dark/30 focus:outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10 transition-all" />
          </div>
          <div>
            <label className="block text-[13px] font-semibold text-dark/70 mb-1.5">Discount Type *</label>
            <div className="grid grid-cols-2 gap-2">
              {COUPON_TYPES.map((t) => (
                <button key={t.value} onClick={() => set('type', t.value)}
                  className={`h-11 rounded-xl text-xs font-bold border-2 transition-all flex items-center justify-center gap-2 ${form.type === t.value ? 'border-primary bg-primary text-white' : 'border-black/8 text-dark/55 hover:border-primary/20'}`}>
                  {t.value === 'flat' ? <DollarSign className="w-4 h-4" /> : <Percent className="w-4 h-4" />} {t.label}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[13px] font-semibold text-dark/70 mb-1.5">{form.type === 'flat' ? 'Discount (₹) *' : 'Discount (%) *'}</label>
              <input type="number" value={form.value} onChange={(e) => set('value', e.target.value)} placeholder="0"
                className="w-full h-11 px-4 rounded-xl bg-cream border border-black/8 text-sm text-dark focus:outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10 transition-all" />
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-dark/70 mb-1.5">Max Discount (₹)</label>
              <input type="number" value={form.maxDiscount} onChange={(e) => set('maxDiscount', e.target.value)} placeholder="No limit"
                className="w-full h-11 px-4 rounded-xl bg-cream border border-black/8 text-sm text-dark placeholder:text-dark/30 focus:outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10 transition-all" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[13px] font-semibold text-dark/70 mb-1.5">Min Order (₹)</label>
              <input type="number" value={form.minOrder} onChange={(e) => set('minOrder', e.target.value)} placeholder="0"
                className="w-full h-11 px-4 rounded-xl bg-cream border border-black/8 text-sm text-dark focus:outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10 transition-all" />
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-dark/70 mb-1.5">Usage Limit</label>
              <input type="number" value={form.usageLimit} onChange={(e) => set('usageLimit', e.target.value)} placeholder="Unlimited"
                className="w-full h-11 px-4 rounded-xl bg-cream border border-black/8 text-sm text-dark placeholder:text-dark/30 focus:outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10 transition-all" />
            </div>
          </div>
          <div>
            <label className="block text-[13px] font-semibold text-dark/70 mb-1.5">Expiry Date</label>
            <input type="date" value={form.expiry} onChange={(e) => set('expiry', e.target.value)}
              className="w-full h-11 px-4 rounded-xl bg-cream border border-black/8 text-sm text-dark focus:outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10 transition-all" />
          </div>
          <div>
            <label className="block text-[13px] font-semibold text-dark/70 mb-1.5">Target Audience</label>
            <select value={form.target} onChange={(e) => set('target', e.target.value)}
              className="w-full h-11 px-4 rounded-xl bg-cream border border-black/8 text-sm text-dark focus:outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10 transition-all">
              {couponTargets.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[13px] font-semibold text-dark/70 mb-1.5">Description</label>
            <input value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Brief description of this coupon"
              className="w-full h-11 px-4 rounded-xl bg-cream border border-black/8 text-sm text-dark placeholder:text-dark/30 focus:outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10 transition-all" />
          </div>
        </div>
        <div className="px-6 py-4 border-t border-black/5 bg-cream/60 flex items-center gap-3">
          <button onClick={onClose} className="flex-1 h-12 rounded-2xl border border-black/10 text-sm font-bold text-dark/60 hover:border-black/25 transition-all">Cancel</button>
          <button onClick={handle} disabled={!form.code || !form.value}
            className="flex-1 h-12 rounded-2xl bg-gradient-to-r from-primary to-primary-dark text-white text-sm font-bold shadow-lg shadow-primary/15 hover:shadow-xl transition-all disabled:opacity-50">
            {isEdit ? 'Update Coupon' : 'Create Coupon'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ================= MAIN PAGE ================= */
export default function CouponsPage() {
  const { coupons, loading, toggleActive, deleteCoupon, deleteCoupons } = useCoupons()
  const { addToast } = useToast()
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortDir, setSortDir] = useState('desc')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState(new Set())
  const [formOpen, setFormOpen] = useState(false)
  const [editCoupon, setEditCoupon] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [viewCoupon, setViewCoupon] = useState(null)
  const [rowAction, setRowAction] = useState(null) // { open, coupon }

  const counts = useMemo(() => {
    const c = { total: coupons.length, active: 0, totalUsed: 0 }
    for (const cp of coupons) { if (cp.active) c.active++; c.totalUsed += cp.usedCount }
    return c
  }, [coupons])

  const filtered = useMemo(() => {
    let list = [...coupons]
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter((c) => c.code.toLowerCase().includes(q) || c.description?.toLowerCase().includes(q))
    }
    list.sort((a, b) => {
      let va = a[sortBy], vb = b[sortBy]
      if (typeof va === 'string') { va = va?.toLowerCase(); vb = vb?.toLowerCase() }
      return sortDir === 'asc' ? (va > vb ? 1 : va < vb ? -1 : 0) : (va < vb ? 1 : va > vb ? -1 : 0)
    })
    return list
  }, [coupons, search, sortBy, sortDir])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const paged = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const toggleSelect = (id) => setSelected((prev) => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n })
  const selectAll = () => setSelected((prev) => (prev.size === paged.length && paged.length > 0 ? new Set() : new Set(paged.map((c) => c._id))))

  const sortOpts = [
    { v: 'createdAt', l: 'Created' }, { v: 'code', l: 'Code' },
    { v: 'usedCount', l: 'Usage' }, { v: 'expiry', l: 'Expiry' },
  ]

  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <h1 className="font-serif-display text-2xl font-bold text-dark tracking-tight">Coupons</h1>
            <p className="text-xs text-dark/45 mt-0.5">{counts.total} coupons · {counts.active} active · {counts.totalUsed.toLocaleString('en-IN')} total redemptions</p>
          </div>
          <button onClick={() => { setEditCoupon(null); setFormOpen(true) }}
            className="ml-auto inline-flex items-center gap-2 h-10 px-5 rounded-2xl bg-gradient-to-r from-primary to-primary-dark text-white text-xs font-bold shadow-md shadow-primary/15 hover:shadow-lg hover:-translate-y-0.5 transition-all">
            <Plus className="w-4 h-4" /> Create Coupon
          </button>
        </div>
        <div className="mt-4"><KpiStrip counts={counts} /></div>
      </motion.div>

      {/* Analytics chart */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-white rounded-3xl border border-black/5 shadow-soft p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div><h3 className="text-sm font-bold text-dark">Coupon Usage — Last 7 Days</h3><p className="text-[11px] text-dark/40 mt-0.5">Daily redemptions and revenue impact</p></div>
          <span className="text-xs font-bold text-primary bg-primary/8 px-3 py-1.5 rounded-xl">{inr(couponsRevenue(couponAnalytics))} revenue</span>
        </div>
        <div className="flex items-end gap-3 h-36">
          {couponAnalytics.map((d, i) => {
            const maxVal = Math.max(...couponAnalytics.map((x) => x.used))
            const h = (d.used / maxVal) * 100
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] font-bold text-dark/40">{d.used}</span>
                <motion.div initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ duration: 0.5, delay: i * 0.05 }}
                  className="w-full bg-gradient-to-t from-primary to-primary-dark rounded-t-md" style={{ height: `${h}%` }} />
                <span className="text-[9px] font-bold text-dark/35">{new Date(d.date).toLocaleDateString('en-IN', { weekday: 'short' })}</span>
              </div>
            )
          })}
        </div>
      </motion.div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark/30" />
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} placeholder="Search by code or description…"
            className="w-full h-10 pl-10 pr-4 rounded-2xl bg-white border border-black/5 text-sm text-dark placeholder:text-dark/30 focus:outline-none focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all" />
        </div>
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

      <AnimatePresence>
        {selected.size > 0 && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="flex flex-wrap items-center gap-3 bg-primary/8 rounded-2xl border border-primary/15 px-4 py-3">
            <span className="text-xs font-bold text-primary">{selected.size} selected</span>
            <div className="flex flex-wrap items-center gap-2 ml-auto">
              <button onClick={() => { [...selected].forEach((id) => toggleActive(id)); setSelected(new Set()) }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold bg-emerald-100 text-emerald-700"><CheckCircle2 className="w-3.5 h-3.5" /> Toggle Active</button>
              <button onClick={() => setDeleteTarget({ bulk: true })} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold bg-red-100 text-red-600"><Trash2 className="w-3.5 h-3.5" /> Delete</button>
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
          <table className="w-full text-left min-w-[1000px]">
            <thead>
              <tr className="border-b border-black/5">
                <th className="px-4 py-3.5 w-10"><input type="checkbox" checked={selected.size === paged.length && paged.length > 0} onChange={selectAll} className="w-4 h-4 rounded accent-[#2E7D32]" /></th>
                {['Code', 'Type', 'Discount', 'Min Order', 'Usage', 'Target', 'Expiry', 'Status', ''].map((h, i) => (
                  <th key={i} className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider text-dark/35 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.map((cp, i) => {
                const usagePct = cp.usageLimit > 0 ? Math.min((cp.usedCount / cp.usageLimit) * 100, 100) : 0
                const isExpired = cp.expiry && new Date(cp.expiry) < new Date()
                return (
                  <motion.tr key={cp._id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.03, ease: [0.22, 1, 0.36, 1] }}
                    className="border-b border-black/4 last:border-0 hover:bg-primary/[0.02] transition-colors group">
                    <td className="px-4 py-3.5"><input type="checkbox" checked={selected.has(cp._id)} onChange={() => toggleSelect(cp._id)} className="w-4 h-4 rounded accent-[#2E7D32]" /></td>
                    <td className="px-4 py-3.5">
                      <div>
                        <p className="text-sm font-black text-primary tracking-wider">{cp.code}</p>
                        <p className="text-[10px] text-dark/40 truncate max-w-[200px]">{cp.description}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-dark bg-cream px-2.5 py-1 rounded-lg">
                        {cp.type === 'flat' ? '₹' : ''}{cp.value}{cp.type === 'percent' ? '%' : ''}
                        {cp.maxDiscount && <span className="text-dark/40 font-normal ml-0.5">(max {inr(cp.maxDiscount)})</span>}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-dark/55">{cp.minOrder > 0 ? inr(cp.minOrder) : 'None'}</td>
                    <td className="px-4 py-3.5">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-dark">{cp.usedCount.toLocaleString('en-IN')}</span>
                          <span className="text-[10px] text-dark/35">/ {cp.usageLimit.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="w-16 h-1.5 rounded-full bg-black/5 overflow-hidden mt-1">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${usagePct}%` }} transition={{ duration: 0.6, delay: i * 0.05 }}
                            className={`h-full rounded-full ${usagePct >= 90 ? 'bg-red-400' : usagePct >= 60 ? 'bg-amber-400' : 'bg-primary'}`} />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-[10px] font-bold text-dark/50 capitalize">{cp.target}</td>
                    <td className="px-4 py-3.5 text-xs text-dark/55 whitespace-nowrap">
                      {cp.expiry ? formatDate(cp.expiry) : 'None'}
                      {isExpired && <span className="ml-1 text-[9px] font-bold text-red-500">Expired</span>}
                    </td>
                    <td className="px-4 py-3.5"><CouponBadge active={cp.active} /></td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => toggleActive(cp._id)} className="w-8 h-8 rounded-xl flex items-center justify-center text-dark/30 hover:text-primary hover:bg-primary/8 transition-colors opacity-0 group-hover:opacity-100"
                          title={cp.active ? 'Disable' : 'Enable'}>
                          {cp.active ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Ban className="w-4 h-4 text-gray-400" />}
                        </button>
                        <button onClick={() => { setEditCoupon(cp); setFormOpen(true) }} className="w-8 h-8 rounded-xl flex items-center justify-center text-dark/30 hover:text-primary hover:bg-primary/8 transition-colors opacity-0 group-hover:opacity-100">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteTarget({ coupon: cp })} className="w-8 h-8 rounded-xl flex items-center justify-center text-dark/30 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100">
                          <Trash2 className="w-4 h-4" />
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
              <span className="w-16 h-16 mx-auto rounded-3xl bg-primary/8 flex items-center justify-center"><TicketPercent className="w-8 h-8 text-primary" /></span>
              <h3 className="mt-5 font-serif-display text-xl font-bold text-dark">No coupons found</h3>
              <p className="mt-1.5 text-sm text-dark/45 font-light">Create your first coupon to get started.</p>
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

      <AnimatePresence>
        {formOpen && <CouponFormModal coupon={editCoupon} onClose={() => { setFormOpen(false); setEditCoupon(null) }} />}
        {deleteTarget && (
          <ConfirmModal open title={deleteTarget.bulk ? `Delete ${selected.size} coupons?` : 'Delete coupon?'}
            message="This coupon will be permanently removed." confirmLabel="Delete"
            onClose={() => setDeleteTarget(null)}
            onConfirm={() => {
              if (deleteTarget.bulk) deleteCoupons([...selected]); else deleteCoupon(deleteTarget.coupon._id)
              setSelected(new Set()); setDeleteTarget(null)
            }} />
        )}
      </AnimatePresence>
    </div>
  )
}
