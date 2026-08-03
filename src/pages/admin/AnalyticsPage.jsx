import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { TrendingUp, TrendingDown, Users, ShoppingBag, Wallet, Target, BarChart3, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import {
  monthlyRevenue, salesByHour, salesByDay,
  customerGrowth, customerRetention, avgOrderValue, conversionRate,
} from '../../data/analyticsData'
import { useAdminData } from '../../context/AdminDataContext'
import { inr } from '../../utils/format'

const COLORS = ['#2E7D32', '#4CAF50', '#66BB6A', '#81C784', '#A5D6A7', '#C8E6C9', '#E8F5E9']

function AnimatedNumber({ value, prefix = '', suffix = '', delay = 0 }) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
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
  return <span>{prefix}{display.toLocaleString('en-IN')}{suffix}</span>
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

export default function AnalyticsPage() {
  const [period, setPeriod] = useState('monthly')
  const { analytics } = useAdminData()
  const kpiSummary = analytics?.kpiSummary || []
  const topProducts = analytics?.topProducts || []
  const topCategories = analytics?.topCategories || []

  return (
    <div className="space-y-5">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <h1 className="font-serif-display text-2xl font-bold text-dark tracking-tight">Analytics</h1>
            <p className="text-xs text-dark/45 mt-0.5">Comprehensive business intelligence dashboard</p>
          </div>
          <div className="ml-auto flex items-center gap-1 bg-white rounded-2xl border border-black/5 p-1">
            {['daily', 'weekly', 'monthly'].map((p) => (
              <button key={p} onClick={() => setPeriod(p)} className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${period === p ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-dark/50 hover:text-primary'}`}>{p}</button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* KPI Cards */}
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
          </motion.div>
        ))}
      </div>

      {/* Revenue Charts Row */}
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <ChartCard title="Revenue Trend" subtitle="Monthly revenue vs previous year" delay={0.05}>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyRevenue}>
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
                  <YAxis tick={{ fontSize: 11, fill: '#999' }} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="prev" name="Previous Year" stroke="#ccc" fill="url(#gPrev)" strokeWidth={2} />
                  <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#2E7D32" fill="url(#gRevenue)" strokeWidth={2.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
        <ChartCard title="Sales by Day" subtitle="Weekly pattern" delay={0.1}>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#999' }} />
                <YAxis tick={{ fontSize: 11, fill: '#999' }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="sales" name="Sales" radius={[6, 6, 0, 0]}>
                  {salesByDay.map((_, i) => <Cell key={i} fill={i === 5 || i === 6 ? '#2E7D32' : '#4CAF50'} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Sales by Hour + Customer Growth */}
      <div className="grid lg:grid-cols-2 gap-5">
        <ChartCard title="Sales by Hour" subtitle="Today's hourly revenue distribution" delay={0.15}>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesByHour}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="hour" tick={{ fontSize: 9, fill: '#999' }} />
                <YAxis tick={{ fontSize: 10, fill: '#999' }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="sales" name="Sales" radius={[4, 4, 0, 0]} fill="#FF9800" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
        <ChartCard title="Customer Growth" subtitle="New vs returning customers" delay={0.2}>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={customerGrowth}>
                <defs>
                  <linearGradient id="gNew" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2E7D32" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#2E7D32" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gReturn" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FF9800" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#FF9800" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#999' }} />
                <YAxis tick={{ fontSize: 11, fill: '#999' }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="returning" name="Returning" stroke="#FF9800" fill="url(#gReturn)" strokeWidth={2} />
                <Area type="monotone" dataKey="new" name="New" stroke="#2E7D32" fill="url(#gNew)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Top Products + Category Split */}
      <div className="grid lg:grid-cols-2 gap-5">
        <ChartCard title="Top Selling Products" subtitle="By units sold this month" delay={0.25}>
          <div className="space-y-3">
            {topProducts.slice(0, 6).map((p, i) => {
              const maxSold = topProducts[0].sold
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
        <ChartCard title="Revenue by Category" subtitle="Category contribution to total revenue" delay={0.3}>
          <div className="flex items-center gap-6">
            <div className="w-48 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={topCategories} dataKey="revenue" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={80} strokeWidth={2} stroke="#fff">
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
        </ChartCard>
      </div>

      {/* Retention + AOV + Conversion */}
      <div className="grid sm:grid-cols-3 gap-5">
        {[
          { label: 'Repeat Customer Rate', value: customerRetention.rate, suffix: '%', sub: `${customerRetention.repeat}% repeat · ${customerRetention.oneTime}% one-time`, color: 'text-primary' },
          { label: 'Average Order Value', value: avgOrderValue.current, prefix: '₹', sub: `${avgOrderValue.growth}% growth vs ₹${avgOrderValue.previous}`, color: 'text-emerald-600' },
          { label: 'Conversion Rate', value: conversionRate.current, suffix: '%', sub: `${conversionRate.growth}% improvement vs ${conversionRate.previous}%`, color: 'text-accent' },
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
        <BarChart3 className="w-3.5 h-3.5" /> D.R.STORES Analytics · All data is mock and ready to connect to MongoDB aggregation pipelines
      </p>
    </div>
  )
}
