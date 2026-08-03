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
    // Only treat a 401 as an expired session when we actually had a token.
    // A guest hitting an admin-gated endpoint (no token) is expected and must
    // not trigger a logout/redirect.
    const hadToken = !!localStorage.getItem('dr-token')
    if (status === 401 && hadToken && !isAuthCall) {
      localStorage.removeItem('dr-token')
      localStorage.removeItem('dr-user')
      localStorage.removeItem('dr-role')
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(err)
  },
)

export const getErrorMessage = (err, fallback = 'Something went wrong') =>
  err.response?.data?.message || err.message || fallback

export default api
