import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Leaf, LogOut, X, ChevronLeft } from 'lucide-react'
import { useAdmin } from '../../context/AdminContext'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/CartContext'
import { adminModules, adminProfile } from '../../data/adminData'
import { AdminIcon } from './ui'
import Avatar from '../account/Avatar'

function NavItem({ module, collapsed, onSelect }) {
  const { activeModule } = useAdmin()
  const active = activeModule === module.id
  return (
    <button
      onClick={() => onSelect(module)}
      title={collapsed ? module.label : undefined}
      className={`group relative flex items-center gap-3 w-full rounded-2xl text-[13px] font-semibold transition-all duration-300 ${
        collapsed ? 'justify-center px-0 py-3' : 'px-3.5 py-3'
      } ${active ? 'text-white' : 'text-dark/55 hover:text-primary hover:bg-primary/8'}`}
    >
      {active && (
        <motion.span
          layoutId="admin-nav-active"
          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
          className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary to-primary-dark shadow-md shadow-primary/25"
        />
      )}
      <span className={`relative z-10 shrink-0 ${active ? '' : 'group-hover:scale-110'} transition-transform duration-300`}>
        <AdminIcon name={module.icon} className="w-[18px] h-[18px]" />
      </span>
      {!collapsed && <span className="relative z-10 truncate">{module.label}</span>}
      {!collapsed && active && (
        <motion.span layoutId="admin-nav-dot" className="relative z-10 ml-auto w-1.5 h-1.5 rounded-full bg-accent-light" />
      )}
    </button>
  )
}

export default function Sidebar({ mobile = false }) {
  const { collapsed, setCollapsed, mobileOpen, setMobileOpen, openModule } = useAdmin()
  const { logout } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()

  const handleSelect = (module) => {
    openModule(module.id)
    if (module.id === 'dashboard') navigate('/admin/dashboard')
  }

  const handleLogout = () => {
    logout()
    addToast('You have been logged out', 'info', 3000)
    navigate('/')
  }

  const isCollapsed = !mobile && collapsed
  const content = (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className={`flex items-center gap-3 px-5 pt-6 pb-5 ${isCollapsed ? 'justify-center px-0' : ''}`}>
        <span className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
          <Leaf className="w-5 h-5 text-white" />
        </span>
        {!isCollapsed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p className="font-serif-display font-extrabold text-base text-dark leading-none tracking-tight">D.R<span className="text-primary">.</span>STORES</p>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary/70 mt-1">Admin Panel</p>
          </motion.div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1 admin-scroll">
        {adminModules.map((m) => (
          <NavItem key={m.id} module={m} collapsed={isCollapsed} onSelect={handleSelect} />
        ))}
      </nav>

      {/* Admin profile */}
      <div className="px-3 pb-3">
        <button
          onClick={() => { openModule('profile'); navigate('/admin/dashboard') }}
          className={`group w-full flex items-center gap-3 rounded-2xl border border-black/5 bg-white shadow-soft hover:border-primary/20 transition-all ${isCollapsed ? 'justify-center p-2.5' : 'p-2.5'}`}
        >
          <Avatar name={adminProfile.name} avatar={adminProfile.avatar} size={36} ring />
          {!isCollapsed && (
            <div className="min-w-0 text-left">
              <p className="text-xs font-bold text-dark truncate">{adminProfile.name}</p>
              <p className="text-[10px] text-dark/40 truncate">{adminProfile.role}</p>
            </div>
          )}
        </button>
        <button
          onClick={handleLogout}
          className={`mt-2 w-full flex items-center gap-3 rounded-2xl text-[13px] font-semibold text-red-500/80 hover:bg-red-50 hover:text-red-600 transition-colors ${isCollapsed ? 'justify-center py-3' : 'px-3.5 py-3'}`}
        >
          <LogOut className="w-[18px] h-[18px] shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  )

  return mobile ? (
    <AnimatePresence>
      {mobileOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileOpen(false)} className="fixed inset-0 z-[60] bg-dark/40 backdrop-blur-sm lg:hidden" />
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', stiffness: 300, damping: 32 }}
            className="fixed top-0 left-0 bottom-0 z-[70] w-72 glass-card rounded-r-3xl shadow-lift lg:hidden"
          >
            <button onClick={() => setMobileOpen(false)} className="absolute top-5 right-4 w-8 h-8 rounded-full flex items-center justify-center text-dark/40 hover:bg-black/5">
              <X className="w-4 h-4" />
            </button>
            {content}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  ) : (
    <motion.aside
      animate={{ width: isCollapsed ? 80 : 260 }}
      transition={{ type: 'spring', stiffness: 260, damping: 30 }}
      className="hidden lg:flex sticky top-0 self-start h-screen flex-col border-r border-black/5 bg-white/70 backdrop-blur-xl shrink-0 relative z-30"
    >
      <button
        onClick={() => setCollapsed(!isCollapsed)}
        className="absolute -right-3 top-24 w-7 h-7 rounded-full bg-white border border-black/10 shadow-soft flex items-center justify-center text-dark/50 hover:text-primary hover:border-primary/30 transition-all z-10"
        aria-label="Toggle sidebar"
      >
        <motion.span animate={{ rotate: isCollapsed ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronLeft className="w-4 h-4" />
        </motion.span>
      </button>
      {content}
    </motion.aside>
  )
}
