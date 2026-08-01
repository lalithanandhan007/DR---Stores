import {
  Area, AreaChart, Line, LineChart, Bar, BarChart, Pie, PieChart, Cell,
  ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid,
} from 'recharts'
import { weeklyRevenue, monthlyRevenue, ordersTrend, categoryDistribution, salesOverview } from '../../data/adminData'

const inr = (v) => `₹${v.toLocaleString('en-IN')}`

/* Shared premium tooltip */
function PremiumTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white/95 backdrop-blur rounded-xl border border-black/5 shadow-lift px-3 py-2.5 text-xs">
      {label && <p className="font-bold text-dark mb-1.5">{label}</p>}
      <div className="space-y-1">
        {payload.map((entry) => (
          <div key={entry.dataKey} className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ background: entry.color || entry.payload?.fill }} />
            <span className="text-dark/55 capitalize">{entry.name}</span>
            <span className="ml-auto pl-3 font-bold text-dark">
              {String(entry.dataKey).toLowerCase().includes('revenue') ? inr(entry.value) : entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

const axis = { fontSize: 10, fill: '#9CA3AF' }
const grid = { stroke: 'rgba(27,27,27,0.05)', vertical: false }

export function WeeklyRevenueChart() {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={weeklyRevenue} margin={{ top: 6, right: 6, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2E7D32" stopOpacity={0.28} />
            <stop offset="100%" stopColor="#2E7D32" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" {...grid} />
        <XAxis dataKey="day" tick={axis} axisLine={false} tickLine={false} dy={8} />
        <YAxis tick={axis} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${Math.round(v / 1000)}k`} width={46} />
        <Tooltip content={<PremiumTooltip />} cursor={{ stroke: 'rgba(46,125,50,0.15)' }} />
        <Area type="monotone" dataKey="revenue" stroke="#2E7D32" strokeWidth={2.5} fill="url(#revGrad)" activeDot={{ r: 5, strokeWidth: 0 }} />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export function MonthlyRevenueChart() {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <AreaChart data={monthlyRevenue} margin={{ top: 6, right: 6, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="monGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF9800" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#FF9800" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" {...grid} />
        <XAxis dataKey="month" tick={axis} axisLine={false} tickLine={false} dy={8} />
        <YAxis tick={axis} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${Math.round(v / 100000)}L`} width={46} />
        <Tooltip content={<PremiumTooltip />} cursor={{ stroke: 'rgba(255,152,0,0.18)' }} />
        <Area type="monotone" dataKey="revenue" stroke="#FF9800" strokeWidth={2.5} fill="url(#monGrad)" activeDot={{ r: 5, strokeWidth: 0 }} />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export function OrdersTrendChart() {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={ordersTrend} margin={{ top: 6, right: 6, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" {...grid} />
        <XAxis dataKey="date" tick={axis} axisLine={false} tickLine={false} dy={8} />
        <YAxis tick={axis} axisLine={false} tickLine={false} width={36} />
        <Tooltip content={<PremiumTooltip />} cursor={{ stroke: 'rgba(46,125,50,0.12)' }} />
        <Line type="monotone" dataKey="orders" name="Orders" stroke="#2E7D32" strokeWidth={2.5} dot={false} activeDot={{ r: 5, strokeWidth: 0 }} />
        <Line type="monotone" dataKey="delivered" name="Delivered" stroke="#81C784" strokeWidth={2} dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}

export function SalesOverviewChart() {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={salesOverview} barGap={6} margin={{ top: 6, right: 6, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" {...grid} />
        <XAxis dataKey="name" tick={axis} axisLine={false} tickLine={false} dy={8} />
        <YAxis tick={axis} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${Math.round(v / 100000)}L`} width={46} />
        <Tooltip content={<PremiumTooltip />} cursor={{ fill: 'rgba(27,27,27,0.03)' }} />
        <Bar dataKey="current" name="This month" fill="#2E7D32" radius={[8, 8, 0, 0]} maxBarSize={34} />
        <Bar dataKey="previous" name="Last month" fill="#E8F0E8" radius={[8, 8, 0, 0]} maxBarSize={34} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export function CategoryDistributionChart() {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie
          data={categoryDistribution}
          dataKey="value"
          nameKey="category"
          cx="50%"
          cy="50%"
          innerRadius={62}
          outerRadius={88}
          paddingAngle={3}
          cornerRadius={6}
          stroke="none"
        >
          {categoryDistribution.map((entry) => <Cell key={entry.category} fill={entry.color} />)}
        </Pie>
        <Tooltip content={<PremiumTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  )
}
