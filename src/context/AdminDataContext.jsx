import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react'
import { adminApi, notificationApi, orderApi, settingsApi } from '../api'
import { useAuth } from './AuthContext'

/* ====================================================================
   ADMIN DATA CONTEXT — MongoDB-backed admin dashboard data.
   Fetches live stats, chart series, activity & notifications from the
   API and maps them to the exact shapes the dashboard UI already uses.
   ==================================================================== */

const AdminDataCtx = createContext(null)

const BASE_STATCARDS = [
  { id: 'revenue', label: "Today's Revenue", value: 0, prefix: '₹', delta: 0, trend: 'neutral', icon: 'wallet' },
  { id: 'orders', label: "Today's Orders", value: 0, delta: 0, trend: 'neutral', icon: 'basket' },
  { id: 'pending', label: 'Pending Orders', value: 0, delta: 0, trend: 'neutral', icon: 'clock' },
  { id: 'delivered', label: 'Delivered Today', value: 0, delta: 0, trend: 'neutral', icon: 'truck' },
  { id: 'customers', label: 'Total Customers', value: 0, delta: 0, trend: 'neutral', icon: 'users' },
  { id: 'lowStock', label: 'Low Stock Items', value: 0, delta: 0, trend: 'neutral', icon: 'box' },
  { id: 'aov', label: 'Average Order Value', value: 0, prefix: '₹', delta: 0, trend: 'neutral', icon: 'coins' },
  { id: 'conversion', label: 'Conversion Rate', value: '—', suffix: '', delta: 0, trend: 'neutral', icon: 'target' },
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
  const [storeSettings, setStoreSettings] = useState(null)
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
    settingsApi.get().then(setStoreSettings).catch(() => { /* store settings surface via Settings page */ })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  const refreshNotifications = useCallback(() => {
    notificationApi
      .list()
      .then((list) => setNotifications(list || []))
      .catch(() => setError('Could not load notifications'))
  }, [])

  const statCards = useMemo(() => {
    if (!stats) return BASE_STATCARDS
    const map = {
      revenue: stats.todayRevenue,
      orders: stats.todayOrders,
      pending: stats.pendingOrders,
      delivered: stats.deliveredToday,
      customers: stats.totalCustomers,
      lowStock: stats.lowStockItems,
      aov: stats.avgOrderValue,
    }
    return BASE_STATCARDS.map((c) => ({ ...c, value: map[c.id] ?? c.value }))
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
      store: storeSettings?.storeName || 'D.R.STORES',
    }
  }, [user, storeSettings])

  const storeStatus = useMemo(() => {
    if (!storeSettings?.businessHours) {
      return { open: false, statusLabel: 'Closed', hours: '—', day: new Date().toLocaleDateString('en-IN', { weekday: 'long' }).toUpperCase() }
    }
    const now = new Date()
    const dayKey = now.toLocaleDateString('en-IN', { weekday: 'long' }).toLowerCase()
    const today = storeSettings.businessHours[dayKey]
    if (!today?.active) {
      return { open: false, statusLabel: 'Closed', hours: '—', day: dayKey.toUpperCase() }
    }
    const [openH, openM] = (today.open || '00:00').split(':').map(Number)
    const [closeH, closeM] = (today.close || '00:00').split(':').map(Number)
    const openMinutes = openH * 60 + openM
    const closeMinutes = closeH * 60 + closeM
    const nowMinutes = now.getHours() * 60 + now.getMinutes()
    const open = nowMinutes >= openMinutes && nowMinutes < closeMinutes
    return {
      open,
      statusLabel: open ? 'Open Now' : 'Closed',
      hours: `${today.open} – ${today.close}`,
      day: dayKey.toUpperCase(),
    }
  }, [storeSettings])

  const value = useMemo(() => ({
    loading,
    error,
    statCards,
    stats,
    adminProfile,
    storeStatus,
    storeSettings,
    weeklyRevenue, monthlyRevenue, ordersTrend, categoryDistribution,
    topProducts, lowStock, activity, notifications, analytics, recentOrders,
    refresh: load,
    refreshNotifications,
  }), [
    loading, error, statCards, stats, adminProfile, storeStatus, storeSettings, weeklyRevenue, monthlyRevenue,
    ordersTrend, categoryDistribution, topProducts, lowStock, activity,
    notifications, analytics, recentOrders, load, refreshNotifications,
  ])

  return <AdminDataCtx.Provider value={value}>{children}</AdminDataCtx.Provider>
}

export function useAdminData() {
  const ctx = useContext(AdminDataCtx)
  if (!ctx) throw new Error('useAdminData must be used within AdminDataProvider')
  return ctx
}