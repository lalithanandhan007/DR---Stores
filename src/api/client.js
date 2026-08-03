import axios from 'axios'

/* ====================================================================
   D.R.STORES — Axios API client
   Base URL is proxied by Vite (vite.config.js → server) so the browser
   only ever talks to the same origin. JWT is attached automatically.
   ==================================================================== */

const api = axios.create({
  baseURL: '/api',
  withCredentials: true, // send the httpOnly cookie too (cookie + Bearer both supported)
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('dr-token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status
    const isAuthCall = err.config?.url?.includes('/auth/')
    const hadToken = !!localStorage.getItem('dr-token')
    if (status === 401 && hadToken && !isAuthCall) {
      localStorage.removeItem('dr-token')
      localStorage.removeItem('dr-user')
      localStorage.removeItem('dr-role')
      // Preserve the current path so the user can be sent back after re-login
      const currentPath = window.location.pathname + window.location.search
      const isOnAdminRoute = currentPath.startsWith('/admin')
      const target = isOnAdminRoute ? '/' : '/login'
      if (!currentPath.includes('/login') && !currentPath.includes('/access-denied')) {
        window.location.href = `${target}${target === '/login' ? `?expired=1` : ''}`
      }
    }
    return Promise.reject(err)
  },
)

export const getErrorMessage = (err, fallback = 'Something went wrong') =>
  err.response?.data?.message || err.message || fallback

export default api
