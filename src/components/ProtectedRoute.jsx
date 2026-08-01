import { Navigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock } from 'lucide-react'
import { useAuth, ROLES } from '../context/AuthContext'

/* Route guard: redirects unauthenticated visitors to /login (remembering where
   they were headed). Supports an optional minimum role for future phases. */
export default function ProtectedRoute({ children, role }) {
  const { user, role: userRole } = useAuth()
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  if (role && userRole !== role) {
    return (
      <div className="min-h-screen bg-cream pt-28 flex items-center justify-center px-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border border-black/5 shadow-soft p-10 text-center max-w-sm"
        >
          <span className="w-16 h-16 mx-auto rounded-full bg-primary/8 flex items-center justify-center">
            <Lock className="w-7 h-7 text-primary/50" />
          </span>
          <h2 className="mt-5 font-serif-display text-2xl font-bold text-dark">Restricted access</h2>
          <p className="mt-2 text-sm text-dark/45">This area requires a different account role. Contact support if you believe this is a mistake.</p>
          <a href="/" className="mt-6 inline-block px-6 py-3 rounded-full bg-gradient-to-r from-primary to-primary-dark text-white text-sm font-bold">Back to Home</a>
        </motion.div>
      </div>
    )
  }

  return children
}

/* Roles available for gating future admin/delivery dashboards */
export { ROLES }
