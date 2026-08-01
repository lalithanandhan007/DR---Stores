import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { UserRound, Package, Heart, MapPin, Settings, LogOut, ChevronDown } from 'lucide-react'
import Avatar from './Avatar'
import { useAuth, ROLE_LABELS } from '../../context/AuthContext'
import { useToast } from '../../context/CartContext'

const items = [
  { to: '/profile', label: 'My Profile', icon: UserRound },
  { to: '/orders', label: 'Orders', icon: Package },
  { to: '/wishlist', label: 'Wishlist', icon: Heart },
  { to: '/addresses', label: 'Addresses', icon: MapPin },
  { to: '/settings', label: 'Settings', icon: Settings },
]

/* Avatar button + animated dropdown for the logged-in navbar state */
export default function AccountMenu() {
  const { user, role, logout } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  const handleLogout = () => {
    setOpen(false)
    logout()
    addToast('You have been logged out', 'info', 3000)
    navigate('/')
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-primary/8 transition-colors duration-300"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <Avatar name={user?.name} avatar={user?.avatar} size={38} ring />
        <ChevronDown className={`w-4 h-4 text-dark/40 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-[calc(100%+12px)] w-64 glass-card rounded-3xl p-3 shadow-lift"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-2 py-2 mb-1 border-b border-black/5">
              <Avatar name={user?.name} avatar={user?.avatar} size={40} />
              <div className="min-w-0">
                <p className="text-sm font-bold text-dark truncate">{user?.name || 'Customer'}</p>
                <p className="text-[10px] text-dark/40 truncate">{user?.email || user?.phone || (ROLE_LABELS[role] || 'Customer')}</p>
              </div>
            </div>

            {items.map((item, i) => (
              <motion.div key={item.to} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.04 * i }}>
                <Link
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold text-dark/70 hover:bg-primary/8 hover:text-primary transition-colors"
                >
                  <item.icon className="w-4 h-4" /> {item.label}
                </Link>
              </motion.div>
            ))}

            <div className="h-px bg-black/5 my-1.5" />
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold text-red-500/80 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
