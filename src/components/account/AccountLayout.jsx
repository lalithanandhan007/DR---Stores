import { NavLink, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  UserRound, Package, Heart, MapPin, Settings, LogOut, ChevronRight, Leaf,
} from 'lucide-react'
import Avatar from './Avatar'
import { useAuth, ROLE_LABELS } from '../../context/AuthContext'
import { useToast } from '../../context/CartContext'
import Footer from '../Footer'

const navItems = [
  { to: '/profile', label: 'My Profile', icon: UserRound },
  { to: '/orders', label: 'My Orders', icon: Package },
  { to: '/wishlist', label: 'Wishlist', icon: Heart },
  { to: '/addresses', label: 'Addresses', icon: MapPin },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export default function AccountLayout({ children, title, subtitle }) {
  const { user, role, logout } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()

  const memberSince = user?.memberSince
    ? new Date(user.memberSince).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
    : '—'

  const handleLogout = () => {
    logout()
    addToast('You have been logged out', 'info', 3000)
    navigate('/')
  }

  const sidebarLinkClass = ({ isActive }) =>
    `group flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 ${
      isActive ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-md shadow-primary/20' : 'text-dark/60 hover:bg-primary/8 hover:text-primary'
    }`

  return (
    <div className="min-h-screen bg-cream pt-28 pb-10 overflow-hidden relative">
      <div className="ambient-orb w-[360px] h-[360px] -top-20 -right-24 green-blob" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        {/* Page header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-2 text-sm text-dark/40 mb-2">
            <Leaf className="w-4 h-4 text-primary" />
            <span>My Account</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-dark/65 font-medium">{title}</span>
          </div>
          <h1 className="font-serif-display text-3xl sm:text-4xl font-bold text-dark tracking-tight">{title}</h1>
          {subtitle && <p className="mt-2 text-dark/50 text-sm font-light">{subtitle}</p>}
        </motion.div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-8 items-start">
          {/* ---------- Sidebar ---------- */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="lg:sticky lg:top-28"
          >
            {/* Profile card */}
            <div className="glass-card rounded-3xl p-6 shadow-card mb-5">
              <div className="flex items-center gap-4">
                <Avatar name={user?.name} avatar={user?.avatar} size={56} ring />
                <div className="min-w-0">
                  <p className="font-bold text-dark truncate">{user?.name || 'Customer'}</p>
                  <p className="text-xs text-dark/45 truncate">{user?.email || user?.phone}</p>
                  <span className="inline-flex items-center gap-1 mt-1.5 text-[10px] font-bold uppercase tracking-wide text-primary bg-primary/8 px-2 py-0.5 rounded-full">
                    {ROLE_LABELS[role] || 'Customer'}
                  </span>
                </div>
              </div>
              <p className="mt-4 pt-4 border-t border-black/5 text-[11px] text-dark/40 flex items-center gap-1.5">
                <span className="text-base">🌱</span> Member since {memberSince}
              </p>
            </div>

            {/* Nav */}
            <nav className="glass-card rounded-3xl p-3 shadow-card">
              {navItems.map((item) => (
                <NavLink key={item.to} to={item.to} className={sidebarLinkClass}>
                  <item.icon className="w-4.5 h-4.5 shrink-0" />
                  {item.label}
                  <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-60 transition-opacity" />
                </NavLink>
              ))}
              <div className="h-px bg-black/5 my-2" />
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-red-500/80 hover:bg-red-50 hover:text-red-600 transition-all duration-300">
                <LogOut className="w-4.5 h-4.5 shrink-0" />
                Logout
              </button>
            </nav>
          </motion.aside>

          {/* ---------- Mobile tab bar ---------- */}
          <div className="lg:hidden -mx-5 px-5 overflow-x-auto mb-6 pb-1">
            <div className="flex gap-2 w-max">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold whitespace-nowrap border transition-all ${
                      isActive ? 'bg-primary text-white border-primary shadow-md shadow-primary/20' : 'bg-white text-dark/55 border-black/8'
                    }`
                  }
                >
                  <item.icon className="w-4 h-4" /> {item.label}
                </NavLink>
              ))}
            </div>
          </div>

          {/* ---------- Content ---------- */}
          <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
            className="min-w-0"
          >
            {children}
          </motion.main>
        </div>
      </div>
      <div className="mt-16"><Footer /></div>
    </div>
  )
}
