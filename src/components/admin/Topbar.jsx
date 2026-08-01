import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Bell, Mail, Plus, Calendar, Menu, ChevronRight, ShoppingBag,
  TicketPercent, Box, UserRound, Settings2, LogOut, ChevronDown,
} from 'lucide-react'
import { useAdmin } from '../../context/AdminContext'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/CartContext'
import { useOrders } from '../../context/OrdersContext'
import { inr } from '../../utils/format'
import { adminProfile, notifications } from '../../data/adminData'
import Avatar from '../account/Avatar'
import NotificationPanel from './NotificationPanel'

const quickAddItems = [
  { label: 'Add Product', icon: ShoppingBag, mod: 'products' },
  { label: 'Create Coupon', icon: TicketPercent, mod: 'coupons' },
  { label: 'Restock Item', icon: Box, mod: 'inventory' },
  { label: 'New Customer', icon: UserRound, mod: 'customers' },
]

function SearchBar() {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const navigate = useNavigate()
  const { orders } = useOrders()

  useEffect(() => {
    const onDown = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  const q = query.trim().toLowerCase()
  const orderHits = q
    ? orders
        .filter((o) => o._id.toLowerCase().includes(q) || o.customer.name.toLowerCase().includes(q) || o.customer.phone.replace(/\s+/g, '').includes(q.replace(/\s+/g, '')))
        .slice(0, 4)
    : []
  const hasHits = orderHits.length > 0

  return (
    <div ref={ref} className="relative flex-1 max-w-md">
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark/30" />
        <input
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          placeholder="Search orders, products, customers…"
          className="w-full h-10 pl-10 pr-14 rounded-2xl bg-black/4 border border-transparent text-sm text-dark placeholder:text-dark/30 focus:outline-none focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all"
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-dark/30 bg-white border border-black/8 rounded-md px-1.5 py-0.5 hidden sm:block">⌘K</kbd>
      </div>

      <AnimatePresence>
        {open && q && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="absolute top-[calc(100%+8px)] right-0 left-0 glass-card rounded-2xl p-2 shadow-lift z-50"
          >
            {!hasHits ? (
              <p className="px-3 py-4 text-center text-xs text-dark/40">No results for “{query}”</p>
            ) : (
              orderHits.map((o) => (
                <button
                  key={o._id}
                  onClick={() => { setOpen(false); navigate(`/admin/orders/${o._id}`) }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-primary/8 transition-colors text-left"
                >
                  <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">{o.customer.avatar}</span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-xs font-bold text-dark">{o.customer.name}</span>
                    <span className="block text-[10px] text-dark/40">{o._id} · {inr(o.grandTotal)} · {o.items.reduce((s, it) => s + it.qty, 0)} items</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-dark/25" />
                </button>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const BREADCRUMB_MAP = {
  dashboard: 'Dashboard',
  products: 'Products',
  categories: 'Categories',
  orders: 'Orders',
  customers: 'Customers',
  inventory: 'Inventory',
  delivery: 'Delivery Partners',
  coupons: 'Coupons',
  analytics: 'Analytics',
  reports: 'Reports',
  settings: 'Store Settings',
  activity: 'Activity Logs',
  'products/new': 'Add Product',
}

function getBreadcrumb(pathname) {
  if (pathname === '/admin' || pathname === '/admin/') return 'Dashboard'
  const segments = pathname.replace('/admin/', '').split('/')
  if (segments[0] === 'products' && segments[1] === 'new') return 'Add Product'
  if (segments[0] === 'products' && segments[1] === 'edit') return 'Edit Product'
  if (segments[0] === 'orders' && segments[1]) return 'Order Details'
  if (segments[0] === 'customers' && segments[1]) return 'Customer Details'
  return BREADCRUMB_MAP[segments[0]] || 'Dashboard'
}

export default function Topbar() {
  const { setMobileOpen, notificationsOpen, setNotificationsOpen, openModule } = useAdmin()
  const { logout } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const breadcrumb = getBreadcrumb(pathname)
  const [quickOpen, setQuickOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const quickRef = useRef(null)
  const profileRef = useRef(null)
  const notifRef = useRef(null)

  useEffect(() => {
    const onDown = (e) => {
      if (quickRef.current && !quickRef.current.contains(e.target)) setQuickOpen(false)
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false)
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotificationsOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [setNotificationsOpen])

  const unread = notifications.filter((n) => !n.read).length

  const handleLogout = () => {
    logout()
    addToast('You have been logged out', 'info', 3000)
    navigate('/')
  }

  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })

  const iconBtn = 'relative w-10 h-10 rounded-2xl flex items-center justify-center text-dark/45 hover:text-primary hover:bg-primary/8 transition-colors duration-300'

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/75 backdrop-blur-xl">
      <div className="flex items-center gap-3 px-4 sm:px-6 h-16">
        {/* Mobile menu */}
        <button onClick={() => setMobileOpen(true)} className={`${iconBtn} lg:hidden`} aria-label="Open menu">
          <Menu className="w-5 h-5" />
        </button>

        {/* Breadcrumb (desktop) */}
        <div className="hidden lg:flex items-center gap-1.5 text-sm min-w-0">
          <span className="text-dark/40">Admin</span>
          <ChevronRight className="w-3.5 h-3.5 text-dark/25" />
          <span className="font-semibold text-dark truncate">{breadcrumb}</span>
        </div>
        <span className="lg:hidden text-sm font-semibold text-dark">{today}</span>

        <SearchBar />

        <div className="ml-auto flex items-center gap-1.5">
          {/* Calendar */}
          <button className={`${iconBtn} hidden md:flex`} title={today} aria-label="Calendar">
            <Calendar className="w-[18px] h-[18px]" />
          </button>

          {/* Messages */}
          <button className={`${iconBtn} hidden sm:flex`} aria-label="Messages">
            <Mail className="w-[18px] h-[18px]" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-accent" />
          </button>

          {/* Notifications */}
          <div ref={notifRef} className="relative">
            <button onClick={() => setNotificationsOpen((o) => !o)} className={`${iconBtn} ${notificationsOpen ? 'bg-primary/8 text-primary' : ''}`} aria-label="Notifications">
              <Bell className="w-[18px] h-[18px]" />
              {unread > 0 && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                  {unread}
                </motion.span>
              )}
            </button>
            <AnimatePresence>
              {notificationsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.97 }}
                  transition={{ duration: 0.18 }}
                  className="absolute right-0 top-[calc(100%+10px)] w-[340px] z-50"
                >
                  <NotificationPanel />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Quick add */}
          <div ref={quickRef} className="relative">
            <button
              onClick={() => setQuickOpen((o) => !o)}
              className="ml-1 h-10 px-3 sm:px-4 rounded-2xl bg-gradient-to-r from-primary to-primary-dark text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-primary/20 hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Quick Add</span>
            </button>
            <AnimatePresence>
              {quickOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.97 }}
                  transition={{ duration: 0.18 }}
                  className="absolute right-0 top-[calc(100%+10px)] w-56 glass-card rounded-2xl p-2 shadow-lift z-50"
                >
                  {quickAddItems.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => { setQuickOpen(false); openModule(item.mod) }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold text-dark/70 hover:bg-primary/8 hover:text-primary transition-colors"
                    >
                      <span className="w-8 h-8 rounded-lg bg-primary/8 text-primary flex items-center justify-center"><item.icon className="w-4 h-4" /></span>
                      {item.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Admin avatar dropdown */}
          <div ref={profileRef} className="relative">
            <button onClick={() => setProfileOpen((o) => !o)} className="flex items-center gap-1.5 pl-1.5 pr-1 py-1 rounded-full hover:bg-black/5 transition-colors" aria-label="Admin menu">
              <Avatar name={adminProfile.name} avatar={adminProfile.avatar} size={34} ring />
              <ChevronDown className="w-3.5 h-3.5 text-dark/35" />
            </button>
            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.97 }}
                  transition={{ duration: 0.18 }}
                  className="absolute right-0 top-[calc(100%+10px)] w-60 glass-card rounded-2xl p-3 shadow-lift z-50"
                >
                  <div className="flex items-center gap-3 px-2 py-2 border-b border-black/5 mb-1">
                    <Avatar name={adminProfile.name} avatar={adminProfile.avatar} size={40} />
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-dark truncate">{adminProfile.name}</p>
                      <p className="text-[10px] text-dark/40 truncate">{adminProfile.email}</p>
                    </div>
                  </div>
                  {[
                    { label: 'Admin Profile', icon: UserRound, mod: 'profile' },
                    { label: 'Store Settings', icon: Settings2, mod: 'settings' },
                  ].map((i) => (
                    <button key={i.label} onClick={() => { setProfileOpen(false); openModule(i.mod) }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold text-dark/70 hover:bg-primary/8 hover:text-primary transition-colors">
                      <i.icon className="w-4 h-4" /> {i.label}
                    </button>
                  ))}
                  <div className="h-px bg-black/5 my-1.5" />
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold text-red-500/80 hover:bg-red-50 hover:text-red-600 transition-colors">
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  )
}
