import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText, Download, Printer, X, Eye, Search, Calendar, TrendingUp,
  Receipt, Wallet, ClipboardList, Users, Box, Truck, ChevronRight, Check,
} from 'lucide-react'
import { REPORT_CATEGORIES, reportTemplates } from '../../data/reportsData'
import { useToast } from '../../context/CartContext'
import { useAdminData } from '../../context/AdminDataContext'
import { inr } from '../../utils/format'
import { downloadReportPdf } from '../../utils/reportPdf'

const ICON_MAP = { receipt: Receipt, wallet: Wallet, clipboard: ClipboardList, users: Users, box: Box, truck: Truck }

/* ================= REPORT PREVIEW MODAL ================= */
function ReportPreview({ report, onClose }) {
  const { addToast } = useToast()
  const { statCards, analytics, stats, topProducts, recentOrders } = useAdminData()

  const stat = (id) => statCards?.find((s) => s.id === id)?.value ?? '—'

  // Build report data from live backend data
  const buildReportData = () => {
    const totalRevenue = stats?.todayRevenue ?? 0
    const totalOrders = stats?.todayOrders ?? 0
    const avgOrderValue = stats?.avgOrderValue ?? 0
    const totalCustomers = stats?.totalCustomers ?? 0
    const deliveredToday = stats?.deliveredToday ?? 0
    const pendingOrders = stats?.pendingOrders ?? 0

    // Get top products from analytics or topProducts
    const productsSource = analytics?.topProducts?.length ? analytics.topProducts : topProducts
    const topProductData = productsSource?.slice(0, 5).map((p) => ({
      name: p.name,
      qty: p.sold ?? p.reviewCount ?? 0,
      revenue: (p.sold ?? p.reviewCount ?? 0) * (p.price ?? p.sellingPrice ?? 0),
    })) || []

    // Payment breakdown would need order payment data - using placeholder for now
    const paymentBreakdown = {
      'UPI': 45,
      'Card': 30,
      'Net Banking': 15,
      'COD': 10,
    }

    return {
      title: report.name,
      summary: {
        totalSales: totalRevenue,
        totalOrders,
        avgOrder: avgOrderValue,
        totalCustomers,
        deliveredToday,
        pendingOrders,
      },
      topProducts: topProductData,
      paymentBreakdown,
      generatedAt: new Date().toISOString(),
    }
  }

  const data = buildReportData()
  const handlePdf = () => {
    downloadReportPdf(report, data)
    addToast('Report PDF downloaded', 'success', 2400)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-dark/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.94, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 26 }}
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        id="report-print">
        <div className="px-6 pt-6 pb-4 bg-gradient-to-br from-primary to-primary-dark flex items-center justify-between">
          <div>
            <h3 className="font-serif-display text-lg font-bold text-white">Report Preview</h3>
            <p className="text-xs text-white/70 mt-0.5">{report.name}</p>
          </div>
          <div className="flex items-center gap-2">
          <button onClick={handlePdf}
              className="h-9 px-3.5 rounded-xl bg-white/15 text-white text-[11px] font-bold flex items-center gap-1.5 hover:bg-white/25 transition-colors">
              <Download className="w-3.5 h-3.5" /> PDF
            </button>
            <button onClick={() => window.print()}
              className="h-9 px-3.5 rounded-xl bg-white/15 text-white text-[11px] font-bold flex items-center gap-1.5 hover:bg-white/25 transition-colors">
              <Printer className="w-3.5 h-3.5" /> Print
            </button>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/15 text-white flex items-center justify-center hover:bg-white/25"><X className="w-4 h-4" /></button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6 admin-scroll">
          <div className="space-y-5">
            <div className="rounded-2xl bg-cream p-4">
              <h4 className="font-serif-display text-base font-bold text-dark">{data.title}</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                {[
                  { label: 'Total Sales', value: inr(data.summary.totalSales) },
                  { label: 'Total Orders', value: data.summary.totalOrders },
                  { label: 'Avg Order Value', value: inr(data.summary.avgOrder) },
                  { label: 'Total Customers', value: data.summary.totalCustomers.toLocaleString('en-IN') },
                  { label: 'Delivered Today', value: data.summary.deliveredToday },
                  { label: 'Pending Orders', value: data.summary.pendingOrders },
                ].map((s, i) => (
                  <div key={s.label} className="rounded-xl bg-white p-3 text-center">
                    <p className="text-lg font-black text-dark">{s.value}</p>
                    <p className="text-[10px] text-dark/40">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h5 className="text-xs font-bold text-dark/60 mb-2">Top Products</h5>
              <div className="space-y-1.5">
                {data.topProducts.length > 0 ? (
                  data.topProducts.map((p, i) => (
                    <div key={i} className="flex items-center justify-between rounded-xl bg-cream px-3 py-2">
                      <span className="text-xs font-bold text-dark">{i + 1}. {p.name}</span>
                      <span className="text-xs text-dark/50">{p.qty} units · {inr(p.revenue)}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-dark/40 text-center py-4">No product data available</p>
                )}
              </div>
            </div>
            <div>
              <h5 className="text-xs font-bold text-dark/60 mb-2">Payment Breakdown</h5>
              <div className="flex gap-2 flex-wrap">
                {Object.entries(data.paymentBreakdown).map(([method, pct]) => (
                  <span key={method} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-black/5 text-xs font-semibold text-dark/60">
                    {method} <span className="font-black text-primary">{pct}%</span>
                  </span>
                ))}
              </div>
            </div>
            <div className="pt-4 border-t border-black/5 text-xs text-dark/40 flex items-center justify-between">
              <span>Generated: {new Date(data.generatedAt).toLocaleString('en-IN')}</span>
              <span>D.R.STORES · Live Data</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ================= MAIN PAGE ================= */
export default function ReportsPage() {
  const { addToast } = useToast()
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('')
  const [previewReport, setPreviewReport] = useState(null)

  const filtered = reportTemplates.filter((r) => {
    if (activeCategory && r.category !== activeCategory) return false
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      return r.name.toLowerCase().includes(q) || r.description.toLowerCase().includes(q)
    }
    return true
  })

  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <h1 className="font-serif-display text-2xl font-bold text-dark tracking-tight">Reports</h1>
            <p className="text-xs text-dark/45 mt-0.5">{reportTemplates.length} report templates · Generate, preview, and export</p>
          </div>
        </div>
      </motion.div>

      {/* Category chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 admin-scroll -mx-1 px-1">
        <button onClick={() => setActiveCategory('')} className={`shrink-0 inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl border text-xs font-bold transition-all ${!activeCategory ? 'border-primary bg-primary text-white shadow-md shadow-primary/20' : 'bg-white border-transparent text-dark/60 hover:border-black/10'}`}>
          All Reports
        </button>
        {REPORT_CATEGORIES.map((cat) => {
          const Icon = ICON_MAP[cat.icon] || FileText
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`shrink-0 inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl border text-xs font-bold transition-all ${activeCategory === cat.id ? 'border-primary bg-primary text-white shadow-md shadow-primary/20' : 'bg-white border-transparent text-dark/60 hover:border-black/10'}`}
            >
              <Icon className="w-3.5 h-3.5" />
              {cat.label}
            </button>
          )
        })}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark/30" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search reports…"
          className="w-full h-10 pl-10 pr-4 rounded-2xl bg-white border border-black/5 text-sm text-dark placeholder:text-dark/30 focus:outline-none focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all" />
      </div>

      {/* Report cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((report, i) => {
          const catMeta = REPORT_CATEGORIES.find((c) => c.id === report.category)
          return (
            <motion.div key={report._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
              className="group bg-white rounded-3xl border border-black/5 shadow-soft p-5 hover:shadow-card hover:-translate-y-0.5 transition-all duration-300">
              <div className="flex items-start justify-between">
                <span className={`w-11 h-11 rounded-2xl flex items-center justify-center ${catMeta?.color || 'bg-primary/10 text-primary'}`}>
                  <FileText className="w-5 h-5" />
                </span>
                <span className="text-[10px] font-bold text-dark/30 uppercase tracking-wider">{report.period}</span>
              </div>
              <h3 className="mt-3.5 text-sm font-bold text-dark">{report.name}</h3>
              <p className="mt-1 text-[11px] text-dark/45 leading-relaxed line-clamp-2">{report.description}</p>
              <div className="mt-3.5 flex items-center gap-2 text-[10px] text-dark/35">
                <Calendar className="w-3 h-3" />
                <span>Last generated: {report.lastGenerated ? new Date(report.lastGenerated).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Never'}</span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-600">{report.status}</span>
              </div>
              <div className="mt-4 pt-3.5 border-t border-black/5 flex items-center gap-2">
                <button onClick={() => setPreviewReport(report)}
                  className="flex-1 h-9 rounded-xl bg-primary/8 text-primary text-[11px] font-bold flex items-center justify-center gap-1.5 hover:bg-primary/15 transition-colors">
                  <Eye className="w-3.5 h-3.5" /> Preview
                </button>
                <button onClick={() => addToast(`${report.name} exported as PDF (demo)`, 'success', 2400)}
                  className="h-9 px-3 rounded-xl bg-white border border-black/8 text-[11px] font-bold text-dark/50 hover:border-primary/30 hover:text-primary transition-all">
                  <Download className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => addToast(`${report.name} printed (demo)`, 'success', 2400)}
                  className="h-9 px-3 rounded-xl bg-white border border-black/8 text-[11px] font-bold text-dark/50 hover:border-primary/30 hover:text-primary transition-all">
                  <Printer className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="py-16 text-center">
          <span className="w-16 h-16 mx-auto rounded-3xl bg-primary/8 flex items-center justify-center"><FileText className="w-8 h-8 text-primary" /></span>
          <h3 className="mt-5 font-serif-display text-xl font-bold text-dark">No reports found</h3>
          <p className="mt-1.5 text-sm text-dark/45 font-light">Try a different search or category.</p>
        </div>
      )}

      <AnimatePresence>
        {previewReport && <ReportPreview report={previewReport} onClose={() => setPreviewReport(null)} />}
      </AnimatePresence>
    </div>
  )
}