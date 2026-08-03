import { Navigate, useLocation } from 'react-router-dom'
import { useAuth, ROLES } from '../context/AuthContext'

/* Route guard: shows a loading spinner while JWT hydrates, redirects
   unauthenticated visitors to /login, and blocks role mismatches
   with an Access Denied page. */
export default function ProtectedRoute({ children, role }) {
  const { user, role: userRole, authLoading } = useAuth()
  const location = useLocation()

  /* Still hydrating — prevent flash-redirect to /login */
  if (authLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname + location.search }} replace />
  }

  if (role && userRole !== role) {
    return <Navigate to="/access-denied" state={{ from: location.pathname + location.search }} replace />
  }

  return children
}

export { ROLES }
