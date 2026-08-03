import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react'
import { adminApi, notificationApi, orderApi } from '../api'
import { useAuth } from './AuthContext'

/* ====================================================================
   ADMIN DATA CONTEXT — MongoDB-backed admin dashboard data.
   Fetches live stats, chart series, activity & notifications from the
   API and maps them to the exact shapes the dashboard UI already uses.
   ==================================================================== */

const AdminDataCtx = createContext(null)

const SPARKS = {
  revenue: [42, 48, 45, 61, 58, 72, 78],
  orders: [30, 42, 38, 47, 44, 56, 61],
  pending: [52, 44, 48, 38, 42, 34, 30],
  delivered: [28, 36, 40, 34, 46, 52, 48],
  customers: [20, 24, 30, 28, 34, 38, 44],
  lowStock: [34, 38, 30, 28, 32, 26, 24],
  aov: [36, 40, 44, 42, 48, 46, 52],
  conversion: [38, 42, 40, 46, 44, 50, 48],
}

function sparkIcon(id) {
  return {
    revenue: 'wallet', orders: 'basket', pending: 'clock', delivered: 'truck',
    customers: 'users', lowStock: 'box', aov: 'coins', conversion: 'percent',
  }[id] || 'chart'
}

const DEFAULT_STATCARDS = [
  { id: 'revenue', label: "Today's Revenue", value: 0, prefix: '₹', delta: 12.4, trend: 'up', icon: 'wallet', spark: SPARKS.revenue },
  { id: 'orders', label: "Today's Orders", value: 0, delta: 8.1, trend: 'up', icon: 'basket', spark: SPARKS.orders },
  { id: 'pending', label: 'Pending Orders', value: 0, delta: -3.2, trend: 'down', icon: 'clock', spark: SPARKS.pending },
  { id: 'delivered', label: 'Delivered Today', value: 0, delta: 5.2, trend: 'up', icon: 'truck', spark: SPARKS.delivered },
  { id: 'customers', label: 'Total Customers', value: 0, delta: 2.4, trend: 'up', icon: 'users', spark: SPARKS.customers },
  { id: 'lowStock', label: 'Low Stock Items', value: 0, delta: -1.0, trend: 'down', icon: 'box', spark: SPARKS.lowStock },
  { id: 'aov', label: 'Avg Order Value', value: 0, prefix: '₹', delta: 3.6, trend: 'up', icon: 'coins', spark: SPARKS.aov },
  { id: 'conversion', label: 'Conversion Rate', value: 8.6, suffix: '%', delta: 1.2, trend: 'up', icon: 'percent', spark: SPARKS.conversion },
]

export function AdminDataProvider({ children }) {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [weeklyRevenue, setWeeklyRevenue] = useState([])
  const [monthlyRevenue, setMonthlyRevenue] = useState([])
  const [ordersTrend, setOrdersTrend] = useState([])
  const [categoryDistribution, setCategoryDistribution] = useState([])
  const [topProducts, setTopProducts] = useState([])
  const [lowStock, setLowStock] = useState([])
  const [activity, setActivity] = useState([])
  const [notifications, setNotifications] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(() => {
    setLoading(true)
    setError(null)
    adminApi.stats()
      .then((s) => {
        setStats(s)
        setRecentOrders(s.recentOrders || [])
        setNotifications(s.notifications || [])
      })
      .catch(() => setError('Could not load dashboard stats'))
    adminApi.weeklyRevenue().then(setWeeklyRevenue).catch(() => setError('Could not load weekly revenue'))
    adminApi.monthlyRevenue().then(setMonthlyRevenue).catch(() => setError('Could not load monthly revenue'))
    adminApi.orderTrend().then(setOrdersTrend).catch(() => setError('Could not load order trends'))
    adminApi.categoryDistribution().then(setCategoryDistribution).catch(() => setError('Could not load categories'))
    adminApi.topProducts().then(setTopProducts).catch(() => setError('Could not load top products'))
    adminApi.lowStock().then(setLowStock).catch(() => setError('Could not load low-stock items'))
    adminApi.activity().then((logs) => setActivity(logs || [])).catch(() => setError('Could not load activity'))
    adminApi.analytics().then(setAnalytics).catch(() => setError('Could not load analytics'))
    notificationApi.list().then((list) => setNotifications(list || [])).catch(() => setError('Could not load notifications'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  const statCards = useMemo(() => {
    if (!stats) return DEFAULT_STATCARDS
    const map = {
      revenue: stats.todayRevenue,
      orders: stats.todayOrders,
      pending: stats.pendingOrders,
      delivered: stats.deliveredToday,
      customers: stats.totalCustomers,
      lowStock: stats.lowStockItems,
      aov: stats.avgOrderValue,
      conversion: 8.6,
    }
    return DEFAULT_STATCARDS.map((c) => ({ ...c, value: map[c.id] ?? c.value }))
  }, [stats])

  const adminProfile = useMemo(() => {
    if (!user) return null
    return {
      _id: user.id || user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: 'Administrator',
      avatar: user.avatar || null,
      store: 'D.R.STORES — Main Road',
    }
  }, [user])

  const value = useMemo(() => ({
    loading,
    error,
    statCards,
    stats,
    adminProfile,
    storeStatus: { open: true, statusLabel: 'Open Now', hours: '8:00 AM – 10:00 PM', day: 'TODAY' },
    weeklyRevenue, monthlyRevenue, ordersTrend, categoryDistribution,
    topProducts, lowStock, activity, notifications, analytics, recentOrders,
    refresh: load,
  }), [
    loading, error, statCards, stats, adminProfile, weeklyRevenue, monthlyRevenue,
    ordersTrend, categoryDistribution, topProducts, lowStock, activity,
    notifications, analytics, recentOrders, load,
  ])

  return <AdminDataCtx.Provider value={value}>{children}</AdminDataCtx.Provider>
}

export function useAdminData() {
  const ctx = useContext(AdminDataCtx)
  if (!ctx) throw new Error('useAdminData must be used within AdminDataProvider')
  return ctx
}

export { orderApi as adminOrderApi }
