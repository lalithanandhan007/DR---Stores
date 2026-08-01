import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShieldAlert, ArrowLeft, Store, Sparkles, Lock } from 'lucide-react'
import { useAuth, ROLE_LABELS } from '../../context/AuthContext'
import { useToast } from '../../context/CartContext'

/* Premium access-denied page shown when a non-admin user reaches admin routes.
   Includes a demo switch (frontend-only) so the dashboard can be explored. */
export default function Unauthorized() {
  const { role } = useAuth()
  const { addToast } = useToast()

  const switchToAdminDemo = () => {
    try {
      localStorage.setItem('dr-role', 'admin')
      localStorage.setItem('dr-user', JSON.stringify({
        id: 'usr_admin_demo',
        name: 'Store Admin',
        email: 'admin@drstores.com',
        phone: '9876543210',
        avatar: null,
        memberSince: new Date().toISOString(),
      }))
    } catch { /* storage blocked */ }
    addToast('Switched to Admin demo account', 'success', 3000)
    setTimeout(() => window.location.reload(), 600)
  }

  return (
    <div className="min-h-screen bg-cream pt-28 flex items-center justify-center px-5 overflow-hidden relative">
      <div className="ambient-orb w-[400px] h-[400px] -top-20 -left-20 green-blob" />
      <div className="ambient-orb w-[360px] h-[360px] bottom-0 -right-24 orange-blob" />

      <div className="relative w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="glass-card rounded-[2rem] p-8 sm:p-10 shadow-card text-center"
        >
          <div className="relative inline-flex">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 220, damping: 16, delay: 0.15 }}
              className="w-20 h-20 rounded-3xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-2xl shadow-red-500/25"
            >
              <ShieldAlert className="w-9 h-9 text-white" />
            </motion.div>
            <motion.span
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-accent text-white flex items-center justify-center"
            >
              <Lock className="w-3.5 h-3.5" />
            </motion.span>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mt-6 font-serif-display text-3xl font-bold text-dark tracking-tight"
          >
            Restricted Area
          </motion.h1>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
            <p className="mt-3 text-sm text-dark/50 font-light leading-relaxed">
              This section is reserved for the <b className="text-primary font-semibold">D.R.STORES admin team</b>.
              Your current role is{' '}
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/8 text-primary text-xs font-bold">
                {ROLE_LABELS[role] || 'Customer'}
              </span>.
            </p>

            <div className="mt-6 rounded-2xl bg-primary/4 border border-primary/10 p-4 text-left">
              <p className="text-xs font-bold text-primary flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Frontend demo
              </p>
              <p className="text-[11px] text-dark/50 mt-1 leading-relaxed">
                This project has no backend yet. You can explore the admin dashboard instantly with the demo admin account.
              </p>
            </div>

            <div className="mt-6 grid gap-3">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={switchToAdminDemo}
                className="w-full h-13 rounded-2xl bg-gradient-to-r from-primary to-primary-dark text-white text-sm font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 transition-all"
              >
                Continue as Admin (Demo)
              </motion.button>
              <div className="grid grid-cols-2 gap-3">
                <Link to="/" className="inline-flex items-center justify-center gap-2 h-12 rounded-2xl border border-black/10 text-sm font-bold text-dark/60 hover:border-primary/30 hover:text-primary transition-all">
                  <ArrowLeft className="w-4 h-4" /> Back to Store
                </Link>
                <Link to="/profile" className="inline-flex items-center justify-center gap-2 h-12 rounded-2xl border border-black/10 text-sm font-bold text-dark/60 hover:border-primary/30 hover:text-primary transition-all">
                  <Store className="w-4 h-4" /> My Account
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
