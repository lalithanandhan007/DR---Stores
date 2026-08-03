import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, Plus, TicketPercent, ClipboardList, Store, ChevronRight, CalendarDays } from 'lucide-react'
import { useAdminData } from '../../context/AdminDataContext'
import StatCard from '../../components/admin/StatCard'
import ChartCard from '../../components/admin/ChartCard'
import {
  WeeklyRevenueChart, MonthlyRevenueChart, OrdersTrendChart,
  CategoryDistributionChart, SalesOverviewChart,
} from '../../components/admin/charts'
import OrderTable from '../../components/admin/OrderTable'
import LowStockCard from '../../components/admin/LowStockCard'
import TopSellingProducts from '../../components/admin/TopSellingProducts'
import QuickActionCard from '../../components/admin/QuickActionCard'
import ActivityTimeline from '../../components/admin/ActivityTimeline'
import NotificationPanel from '../../components/admin/NotificationPanel'
import { Reveal, SectionHeader } from '../../components/admin/ui'
import { useAdmin } from '../../context/AdminContext'

function StatusToggle() {
  const { storeStatus } = useAdminData()
  const [open, setOpen] = useState(storeStatus.open)
  return (
    <button
      onClick={() => setOpen((o) => !o)}
      className={`inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full border text-xs font-bold transition-all duration-300 ${
        open ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-red-50 text-red-500 border-red-200'
      }`}
    >
      <span className="relative flex w-2 h-2">
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${open ? 'bg-emerald-500' : 'bg-red-500'}`} />
        <span className={`relative inline-flex rounded-full w-2 h-2 ${open ? 'bg-emerald-500' : 'bg-red-500'}`} />
      </span>
      {open ? 'Store Open' : 'Store Closed'}
      <ChevronRight className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-90' : '-rotate-90'}`} />
    </button>
  )
}

export default function AdminDashboardPage() {
  const { openModule } = useAdmin()
  const navigate = useNavigate()
  const { loading, statCards, storeStatus, adminProfile } = useAdminData()
  const firstName = adminProfile.name.split(' ')[0]
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  const heroQuick = [
    { label: 'Add Product', icon: Plus, mod: 'products' },
    { label: 'Create Coupon', icon: TicketPercent, mod: 'coupons' },
    { label: 'Manage Orders', icon: ClipboardList, mod: 'orders' },
  ]

  return (
    <div className="space-y-6">
      {/* ============ HERO ============ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-dark via-primary to-secondary p-6 sm:p-8 shadow-lift"
      >
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full border border-white/10 spin-slow" />
        <div className="absolute -bottom-24 -left-16 w-72 h-72 rounded-full bg-white/5" />
        <div className="absolute top-10 right-24 hidden sm:block text-6xl opacity-20 float-slow">🥬</div>
        <div className="absolute bottom-6 right-10 hidden sm:block text-5xl opacity-20 float-med">🍅</div>

        <div className="relative flex flex-col lg:flex-row lg:items-center gap-5">
          <div className="flex-1">
            <p className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white/60">
              <CalendarDays className="w-3.5 h-3.5" /> {today}
            </p>
            <h1 className="mt-2 font-serif-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight">
              Welcome back, {firstName} <span className="inline-block">👋</span>
            </h1>
            <p className="mt-2 text-sm text-white/70 font-light">
              {storeStatus.hours} · {storeStatus.statusLabel} · Everything is running smoothly today.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {heroQuick.map((q) => (
                <button
                  key={q.label}
                  onClick={() => (q.mod === 'orders' ? navigate('/admin/orders') : openModule(q.mod))}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/12 border border-white/15 text-white text-xs font-bold hover:bg-white/25 transition-all backdrop-blur"
                >
                  <q.icon className="w-3.5 h-3.5" /> {q.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex lg:flex-col items-center lg:items-end gap-3">
            <StatusToggle />
            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/12 border border-white/15 text-white text-xs font-bold backdrop-blur">
              <Store className="w-3.5 h-3.5" /> {adminProfile.store}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ============ STAT CARDS ============ */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-40 rounded-3xl bg-black/4 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {statCards.map((s, i) => <StatCard key={s.id} stat={s} index={i} />)}
        </div>
      )}

      {/* ============ CHARTS ROW 1 ============ */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <ChartCard title="Weekly Revenue" subtitle="Last 7 days performance" action={<LegendDots dots={[{ c: '#2E7D32', l: 'Revenue' }]} />}>
            <WeeklyRevenueChart />
          </ChartCard>
        </div>
        <ChartCard title="Category Distribution" subtitle="Share of today's orders" action={<LegendDots dots={[{ c: '#2E7D32', l: 'All' }]} />}>
          <div className="flex flex-col items-center">
            <CategoryDistributionChart />
            <CategoryLegend />
          </div>
        </ChartCard>
      </div>

      {/* ============ CHARTS ROW 2 ============ */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <ChartCard title="Monthly Revenue" subtitle="Revenue over the last 12 months" action={<LegendDots dots={[{ c: '#FF9800', l: 'Revenue' }]} />}>
            <MonthlyRevenueChart />
          </ChartCard>
        </div>
        <ChartCard title="Top Selling Products" subtitle="By revenue this week">
          <TopSellingProducts />
        </ChartCard>
      </div>

      {/* ============ RECENT ORDERS ============ */}
      <Reveal>
        <SectionHeader title="Recent Orders" subtitle="Latest 7 orders across all channels" action={
          <button className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-dark transition-colors">View all <ChevronRight className="w-3.5 h-3.5" /></button>
        } />
        <OrderTable />
      </Reveal>

      {/* ============ CHARTS ROW 3 ============ */}
      <div className="grid lg:grid-cols-2 gap-4">
        <ChartCard title="Sales Overview" subtitle="This month vs last month" action={<LegendDots dots={[{ c: '#2E7D32', l: 'This month' }, { c: '#E8F0E8', l: 'Last month' }]} />}>
          <SalesOverviewChart />
        </ChartCard>
        <ChartCard title="Orders Trend" subtitle="Orders placed vs delivered" action={<LegendDots dots={[{ c: '#2E7D32', l: 'Orders' }, { c: '#81C784', l: 'Delivered' }]} />}>
          <OrdersTrendChart />
        </ChartCard>
      </div>

      {/* ============ QUICK ACTIONS ============ */}
      <Reveal>
        <SectionHeader title="Quick Actions" subtitle="Shortcuts for your daily store operations" />
        <QuickActionCard index={0} />
      </Reveal>

      {/* ============ LOW STOCK ============ */}
      <Reveal>
        <SectionHeader title="Low Stock Alerts" subtitle="Items that need attention before running out" action={
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-500 bg-red-50 px-3 py-1.5 rounded-full">{statCards.find((s) => s.id === 'lowStock').value} items low</span>
        } />
        <LowStockCard index={0} />
      </Reveal>

      {/* ============ ACTIVITY + NOTIFICATIONS ============ */}
      <div className="grid lg:grid-cols-2 gap-4 items-start">
        <Reveal>
          <ActivityTimeline />
        </Reveal>
        <Reveal delay={0.08}>
          <div className="bg-white rounded-3xl border border-black/5 shadow-soft p-5 sm:p-6">
            <h3 className="text-sm font-bold text-dark mb-5">Notifications</h3>
            <NotificationPanel />
          </div>
        </Reveal>
      </div>

      {/* Footer note */}
      <Reveal>
        <p className="text-center text-[11px] text-dark/30 flex items-center justify-center gap-1.5 py-4">
          <Sparkles className="w-3.5 h-3.5" /> D.R.STORES Admin · Data is mock and ready to connect to MongoDB
        </p>
      </Reveal>
    </div>
  )
}

function LegendDots({ dots }) {
  return (
    <div className="flex items-center gap-3">
      {dots.map((d) => (
        <span key={d.l} className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-dark/45">
          <span className="w-2 h-2 rounded-full" style={{ background: d.c }} /> {d.l}
        </span>
      ))}
    </div>
  )
}

function CategoryLegend() {
  const { categoryDistribution } = useAdminData()
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 w-full max-w-xs">
      {categoryDistribution.map((c) => (
        <span key={c.category} className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-dark/50">
          <span className="w-2 h-2 rounded-full" style={{ background: c.color }} /> {c.category} <b className="text-dark ml-auto">{c.value}%</b>
        </span>
      ))}
    </div>
  )
}
