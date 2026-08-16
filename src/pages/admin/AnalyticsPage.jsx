import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { TrendingUp, TrendingDown, Users, ShoppingBag, Wallet, Target, BarChart3, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { useAdminData } from '../../context/AdminDataContext'
import { inr } from '../../utils/format'

const COLORS = ['#2E7D32', '#4CAF50', '#66BB6A', '#81C784', '#A5D6A7', '#C8E6C9', '#E8F5E9']

function AnimatedNumber({ value, prefix = '', suffix = '', delay = 0 }) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    if (typeof value !== 'number') return
    const timeout = setTimeout(() => {
      let start = 0
      const duration = 1200
      const startTime = Date.now()
      const tick = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setDisplay(Math.round(eased * value))
        if (progress < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }, delay)
    return () => clearTimeout(timeout)
  }, [value, delay])
  return <span>{prefix}{typeof value === 'number' ? display.toLocaleString('en-IN') : value}{suffix}</span>
}

function ChartCard({ title, subtitle, children, delay = 0 }) {
  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white rounded-3xl border border-black/5 shadow-soft p-5 sm:p-6">
      {title && <div className="mb-4">
        <h3 className="text-sm font-bold text-dark">{title}</h3>
        {subtitle && <p className="text-[11px] text-dark/40 mt-0.5">{subtitle}</p>}
      </div>}
      {children}
    </motion.div>
  )
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="glass-card rounded-xl px-3 py-2 shadow-lift border border-white/60 text-xs">
      <p className="font-bold text-dark mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-dark/60"><span className="font-semibold" style={{ color: p.color }}>{p.name}:</span> {typeof p.value === 'number' && p.value > 999 ? inr(p.value) : p.value}</p>
      ))}
    </div>
  )
}

function EmptyChart({ title = 'No data available', subtitle = 'Data will appear here when available' }) {
  return (
    <div className="h-72 flex flex-col items-center justify-center text-center text-dark/40 p-4">
      <BarChart3 className="w-10 h-10 mb-3 text-dark/20" />
      <p className="text-sm font-medium text-dark/50">{title}</p>
      <p className="text-[11px] text-dark/30 mt-1">{subtitle}</p>
    </div>
  )
}

export default function AnalyticsPage() {
  const [period, setPeriod] = useState('monthly')
  const { analytics, loading, monthlyRevenue, weeklyRevenue, ordersTrend } = useAdminData()

  const kpiSummary = analytics?.kpiSummary || []
  const topProducts = analytics?.topProducts || []
  const topCategories = analytics?.topCategories || []
  const deliveryAnalytics = analytics?.deliveryAnalytics || null

  const monthlyRevenueData = monthlyRevenue || []
  const weeklyRevenueData = weeklyRevenue || []
  const orderTrendData = ordersTrend || []

  if (loading) {
    return (
      <div className="space-y-5">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
          <div className="flex flex-wrap items-center gap-3">
            <div>
              <h1 className="font-serif-display text-2xl font-bold text-dark tracking-tight">Analytics</h1>
              <p className="text-xs text-dark/45 mt-0.5">Comprehensive business intelligence dashboard</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-24 rounded-2xl bg-black/4 animate-pulse" />)}
        </div>
        <div className="grid lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 h-72 rounded-3xl bg-black/4 animate-pulse" />
          <div className="h-72 rounded-3xl bg-black/4 animate-pulse" />
        </div>
        <div className="grid lg:grid-cols-2 gap-5">
          <div className="h-64 rounded-3xl bg-black/4 animate-pulse" />
          <div className="h-64 rounded-3xl bg-black/4 animate-pulse" />
        </div>
        <div className="grid lg:grid-cols-2 gap-5">
          <div className="h-64 rounded-3xl bg-black/4 animate-pulse" />
          <div className="h-64 rounded-3xl bg-black/4 animate-pulse" />
        </div>
        <div className="grid sm:grid-cols-3 gap-5">
          <div className="h-36 rounded-2xl bg-black/4 animate-pulse" />
          <div className="h-36 rounded-2xl bg-black/4 animate-pulse" />
          <div className="h-36 rounded-2xl bg-black/4 animate-pulse" />
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-sm">
          <span className="w-16 h-16 mx-auto rounded-3xl bg-primary/8 flex items-center justify-center"><BarChart3 className="w-8 h-8 text-primary" /></span>
          <h3 className="mt-5 font-serif-display text-xl font-bold text-dark">No analytics available</h3>
          <p className="mt-1.5 text-sm text-dark/45 font-light">Analytics data will appear here once orders start flowing.</p>
        </div>
      </div>
    )
  }

  const revenueChartData = useMemo(() => {
    if (!monthlyRevenueData.length) return []
    return monthlyRevenueData.map(m => ({
      month: m.month,
      revenue: m.revenue || 0,
      orders: m.orders || 0,
      prevRevenue: m.prev || 0,
    }))
  }, [monthlyRevenueData])

  const weeklyRevenueChartData = useMemo(() => {
    if (!weeklyRevenueData.length) return []
    return weeklyRevenueData.map(w => ({
      day: w.day,
      revenue: w.revenue || 0,
      orders: w.orders || 0,
    }))
  }, [weeklyRevenueData])

  const orderTrendChartData = useMemo(() => {
    if (!orderTrendData.length) return []
    return orderTrendData.map(o => ({
      date: o.date,
      orders: o.orders || 0,
      delivered: o.delivered || 0,
    }))
  }, [orderTrendData])

  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <h1 className="font-serif-display text-2xl font-bold text-dark tracking-tight">Analytics</h1>
            <p className="text-xs text-dark/45 mt-0.5">Comprehensive business intelligence dashboard</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
        {kpiSummary.map((kpi, i) => (
          <motion.div key={kpi.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white rounded-2xl border border-black/5 shadow-soft p-4 hover:shadow-card hover:-translate-y-0.5 transition-all">
            <p className="text-[11px] text-dark/45 font-medium">{kpi.label}</p>
            <p className="mt-1.5 text-xl font-black text-dark">
              <AnimatedNumber value={kpi.value} prefix={kpi.prefix || ''} suffix={kpi.suffix || ''} delay={i * 80} />
            </p>
            <span className={`inline-flex items-center gap-0.5 mt-1 text-[10px] font-bold ${kpi.growth >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
              {kpi.growth >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {Math.abs(kpi.growth)}%
            </span>
            <p className="text-[10px] text-dark/40 mt-0.5">{kpi.period}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <ChartCard title="Monthly Revenue Trend" subtitle="Revenue vs previous year" delay={0.05}>
            {revenueChartData.length ? (
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueChartData}>
                    <defs>
                      <linearGradient id="gRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2E7D32" stopOpacity={0.2} />
                        <stop offset="100%" stopColor="#2E7D32" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gPrev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#E8F0E8" stopOpacity={0.5} />
                        <stop offset="100%" stopColor="#E8F0E8" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#999' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#999' }} tickFormatter={(v) => `${v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v}`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#2E7D32" fill="url(#gRevenue)" strokeWidth={2} />
                    <Area type="monotone" dataKey="prevRevenue" name="Previous Year" stroke="#E8F0E8" fill="url(#gPrev)" strokeWidth={2} strokeDasharray="5 5" />
                    <Legend />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <EmptyChart />
            )}
          </ChartCard>
        </div>
        <ChartCard title="Weekly Revenue" subtitle="Last 7 days" delay={0.1}>
          {weeklyRevenueChartData.length ? (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyRevenueChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#999' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#999' }} tickFormatter={(v) => `${v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v}`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="revenue" name="Revenue" radius={[6, 6, 0, 0]} fill="#4CAF50" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyChart />
          )}
        </ChartCard>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <ChartCard title="Order Trend (7 Days)" subtitle="Orders placed vs delivered" delay={0.15}>
          {orderTrendChartData.length ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={orderTrendChartData}>
                  <defs>
                    <linearGradient id="gOrders" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2E7D32" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#2E7D32" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gDelivered" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FF9800" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#FF9800" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#999' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#999' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="orders" name="Orders" stroke="#2E7D32" fill="url(#gOrders)" strokeWidth={2} />
                  <Area type="monotone" dataKey="delivered" name="Delivered" stroke="#FF9800" fill="url(#gDelivered)" strokeWidth={2} />
                  <Legend />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyChart />
          )}
        </ChartCard>
        <ChartCard title="Top Categories" subtitle="Product categories by count" delay={0.2}>
          {topCategories.length ? (
            <div className="flex items-center gap-6">
              <div className="w-48 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={topCategories} dataKey="orders" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={80} strokeWidth={2} stroke="#fff">
                      {topCategories.map((c, i) => <Cell key={i} fill={c.color} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-2">
                {topCategories.map((c) => (
                  <div key={c.name} className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: c.color }} />
                    <span className="text-xs text-dark/60 flex-1 truncate">{c.name}</span>
                    <span className="text-xs font-bold text-dark">{c.share}%</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <EmptyChart />
          )}
        </ChartCard>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <ChartCard title="Top Selling Products" subtitle="By units sold" delay={0.25}>
          <div className="space-y-3">
            {topProducts.slice(0, 6).map((p, i) => {
              const maxSold = topProducts[0]?.sold || 1
              const pct = (p.sold / maxSold) * 100
              return (
                <div key={p.name} className="flex items-center gap-3">
                  <span className="text-xl w-8 text-center">{p.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-dark truncate">{p.name}</span>
                      <span className="text-[11px] font-bold text-dark/60">{p.sold.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-black/5 overflow-hidden mt-1">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6, delay: i * 0.08 }}
                        className="h-full rounded-full bg-gradient-to-r from-primary to-primary-dark" />
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold ${p.growth >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                    {p.growth >= 0 ? '+' : ''}{p.growth}%
                  </span>
                </div>
              )
            })}
          </div>
        </ChartCard>
        <ChartCard title="Delivery Performance" subtitle="Average delivery time & on-time rate" delay={0.3}>
          {deliveryAnalytics ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-dark/45">Average Delivery Time</p>
                  <p className="text-3xl font-black text-primary">{deliveryAnalytics.avgTime} min</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-dark/45">On-Time Rate</p>
                  <p className="text-3xl font-black text-emerald-600">{deliveryAnalytics.onTimeRate}%</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                  <p className="text-xs text-emerald-700 font-bold">Total Deliveries</p>
                  <p className="text-xl font-black text-emerald-800">{deliveryAnalytics.totalDeliveries.toLocaleString('en-IN')}</p>
                </div>
                <div className="p-3 rounded-xl bg-red-50 border border-red-100">
                  <p className="text-xs text-red-700 font-bold">Failed Deliveries</p>
                  <p className="text-xl font-black text-red-800">{deliveryAnalytics.failedDeliveries || 0}</p>
                </div>
              </div>
            </div>
          ) : (
            <EmptyChart />
          )}
        </ChartCard>
      </div>

      <div className="grid sm:grid-cols-3 gap-5">
        {[
          { label: 'Repeat Customer Rate', value: '--', sub: 'Requires customer tracking data', color: 'text-primary' },
          { label: 'Average Order Value', value: analytics?.kpiSummary?.find(k => k.label === 'Avg Order Value')?.value || '--', prefix: '₹', sub: 'From live order data', color: 'text-emerald-600' },
          { label: 'Conversion Rate', value: '--', sub: 'Requires session/visitor tracking', color: 'text-accent' },
        ].map((stat, i) => (
          <ChartCard key={stat.label} delay={0.35 + i * 0.05}>
            <p className="text-[11px] text-dark/45">{stat.label}</p>
            <p className={`mt-1 text-3xl font-black ${stat.color}`}>
              <AnimatedNumber value={stat.value} prefix={stat.prefix || ''} suffix={stat.suffix || ''} delay={350 + i * 80} />
            </p>
            <p className="text-[10px] text-dark/40 mt-1">{stat.sub}</p>
          </ChartCard>
        ))}
      </div>

      <p className="text-center text-[11px] text-dark/30 flex items-center justify-center gap-1.5 py-4">
        <BarChart3 className="w-3.5 h-3.5" /> D.R.STORES Analytics · Powered by MongoDB aggregation pipelines
      </p>
    </div>
  )
}