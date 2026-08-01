import { Navigate, useLocation } from 'react-router-dom'
import { useAuth, ROLES } from '../context/AuthContext'
import Unauthorized from './admin/Unauthorized'

/* Route guard: redirects unauthenticated visitors to /login (remembering where
   they were headed). Supports an optional role requirement (e.g. "admin"). */
export default function ProtectedRoute({ children, role }) {
  const { user, role: userRole } = useAuth()
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  if (role && userRole !== role) {
    return <Unauthorized />
  }

  return children
}

/* Roles available for gating future admin/delivery dashboards */
export { ROLES }
