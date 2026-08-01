import { motion } from 'framer-motion'
import { LayoutDashboard, ClipboardList, Plus, Boxes, UserRound } from 'lucide-react'
import { AdminProvider, useAdmin } from '../../context/AdminContext'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import ModulePlaceholder from './ModulePlaceholder'
import { useNavigate } from 'react-router-dom'

/* Mobile bottom quick-action bar */
function MobileQuickBar() {
  const { activeModule, openModule } = useAdmin()
  const navigate = useNavigate()
  const items = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders', icon: ClipboardList },
    { id: 'add', label: 'Add', icon: Plus, accent: true },
    { id: 'inventory', label: 'Inventory', icon: Boxes },
    { id: 'profile', label: 'Profile', icon: UserRound },
  ]

  const go = (item) => {
    if (item.id === 'add') { openModule('products'); return }
    if (item.id === 'dashboard') navigate('/admin/dashboard')
    openModule(item.id)
  }

  return (
    <div className="fixed bottom-0 inset-x-0 z-[55] lg:hidden">
      <div className="glass-card border-t border-black/5 rounded-none px-2 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        <div className="flex items-center justify-around">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => go(item)}
              className={`relative flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-colors ${
                item.accent ? 'text-primary' : activeModule === item.id ? 'text-primary' : 'text-dark/40'
              }`}
            >
              {activeModule === item.id && !item.accent && (
                <motion.span layoutId="admin-mobile-active" className="absolute inset-0 rounded-xl bg-primary/10" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />
              )}
              <span className="relative z-10">
                {item.accent ? (
                  <span className="w-11 h-11 -mt-5 rounded-full bg-gradient-to-r from-primary to-primary-dark text-white flex items-center justify-center shadow-lg shadow-primary/30 border-4 border-white">
                    <item.icon className="w-5 h-5" />
                  </span>
                ) : (
                  <item.icon className="w-5 h-5" />
                )}
              </span>
              <span className="relative z-10 text-[9px] font-bold">{item.accent ? 'Add' : item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function AdminShell({ children }) {
  const { activeModule } = useAdmin()
  return (
    <div className="min-h-screen bg-[#F5F7F5] text-dark">
      {/* ambient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full bg-primary/6 blur-3xl" />
        <div className="absolute bottom-0 -left-40 w-[420px] h-[420px] rounded-full bg-accent/6 blur-3xl" />
      </div>

      <div className="relative flex">
        {/* Mobile drawer + desktop sidebar */}
        <Sidebar mobile />
        <Sidebar />

        <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-0">
          <Topbar />
          <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-[1500px] w-full mx-auto">
            {activeModule === 'dashboard' ? children : <ModulePlaceholder />}
          </main>
        </div>
      </div>

      <MobileQuickBar />
    </div>
  )
}

export default function AdminLayout({ children }) {
  return (
    <AdminProvider>
      <AdminShell>{children}</AdminShell>
    </AdminProvider>
  )
}
