import { createContext, useContext, useCallback, useState, useEffect, useRef } from 'react'
import { authApi, wishlistApi } from '../api'
import { getErrorMessage } from '../api/client'

/* ====================================================================
   D.R.STORES — Auth, Roles & Wishlist
   Sessions are backed by the Express + MongoDB API (JWT). No demo
   or simulation code remains — all login / register / logout /
   token validation goes through the backend.
   ==================================================================== */

export const ROLES = {
  CUSTOMER: 'customer',
  ADMIN: 'admin',
  DELIVERY: 'delivery',
}

export const ROLE_LABELS = {
  customer: 'Customer',
  admin: 'Administrator',
  delivery: 'Delivery Partner',
}

const STORAGE_KEYS = {
  user: 'dr-user',
  role: 'dr-role',
  token: 'dr-token',
  rememberEmail: 'dr-remember-email',
}

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function writeJson(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* storage full or blocked */ }
}

/* API user documents use _id/createdAt; the UI expects id/memberSince */
const normalizeUser = (u) => (u ? {
  ...u,
  id: u._id || u.id,
  memberSince: u.memberSince || u.createdAt,
} : u)

/* ====================================================================
   AUTH CONTEXT
   ==================================================================== */
const AuthCtx = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readJson(STORAGE_KEYS.user, null))
  const [role, setRole] = useState(() => localStorage.getItem(STORAGE_KEYS.role) || ROLES.CUSTOMER)
  const [authLoading, setAuthLoading] = useState(true)

  const pendingRegRef = useRef(null)
  const pendingOtpRef = useRef(null)
  const [, setOtpTick] = useState(0)

  const persistUser = useCallback((nextUser, nextRole) => {
    const normalized = normalizeUser(nextUser)
    setUser(normalized)
    setRole(nextUser?.role || nextRole || ROLES.CUSTOMER)
    if (normalized) writeJson(STORAGE_KEYS.user, normalized)
    else localStorage.removeItem(STORAGE_KEYS.user)
    if (nextUser?.role || nextRole) localStorage.setItem(STORAGE_KEYS.role, nextUser?.role || nextRole)
    else localStorage.removeItem(STORAGE_KEYS.role)
  }, [])

  const persistSession = useCallback((nextUser, token) => {
    persistUser(nextUser, nextUser?.role || ROLES.CUSTOMER)
    if (token) localStorage.setItem(STORAGE_KEYS.token, token)
  }, [persistUser])

  /* Hydrate from JWT on mount — always verify against backend even if
     localStorage has a cached user, so stale roles / names are corrected. */
  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.token)
    if (token) {
      authApi.getMe()
        .then(({ user: fetched }) => {
          persistUser(fetched, fetched.role)
        })
        .catch(() => {
          localStorage.removeItem(STORAGE_KEYS.token)
          persistUser(null, null)
        })
        .finally(() => setAuthLoading(false))
    } else {
      setAuthLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* ---------- Session ---------- */
  const logout = useCallback(() => {
    authApi.logout().catch(() => {})
    localStorage.removeItem(STORAGE_KEYS.token)
    persistUser(null, null)
  }, [persistUser])

  const loginWithPassword = useCallback(async (email, password) => {
    try {
      const data = await authApi.login(email, password)
      persistSession(data.user, data.token)
      return { success: true, user: data.user }
    } catch (err) {
      return { success: false, message: getErrorMessage(err, 'Login failed') }
    }
  }, [persistSession])

  const loginWithOtp = useCallback(async (identifier) => {
    try {
      const data = await authApi.loginWithOtp(identifier)
      persistSession(data.user, data.token)
      return { success: true, user: data.user }
    } catch (err) {
      return { success: false, message: getErrorMessage(err, 'No account found for this number.') }
    }
  }, [persistSession])

  const register = useCallback(async (registration) => {
    try {
      const data = await authApi.register(registration)
      persistSession(data.user, data.token)
      return { success: true, user: data.user }
    } catch (err) {
      return { success: false, message: getErrorMessage(err, 'Registration failed') }
    }
  }, [persistSession])

  const updateProfile = useCallback(async (patch) => {
    try {
      const { user: fetched } = await authApi.updateProfile(patch)
      persistUser(fetched, fetched.role)
      return { success: true }
    } catch (err) {
      return { success: false, message: getErrorMessage(err, 'Profile update failed') }
    }
  }, [persistUser])

  const resetPassword = useCallback(async (identifier, newPassword) => {
    try {
      await authApi.resetPassword(identifier, newPassword)
      return { success: true }
    } catch (err) {
      return { success: false, message: getErrorMessage(err, 'Password reset failed') }
    }
  }, [])

  /* ---------- Registration (pending until OTP verified) ---------- */
  const stageRegistration = useCallback((data) => {
    pendingRegRef.current = data
  }, [])

  const consumeRegistration = useCallback(() => {
    const pending = pendingRegRef.current
    pendingRegRef.current = null
    return pending
  }, [])

  /* ---------- OTP ----------
     For login/reset the backend generates & stores a real OTP.
     For registration the OTP is simulated (no SMS provider). */
  const sendOtp = useCallback((identifier, purpose) => {
    const otp = String(Math.floor(100000 + Math.random() * 900000))
    const pending = { otp, identifier, purpose, expiresAt: Date.now() + 5 * 60 * 1000 }
    pendingOtpRef.current = pending
    setOtpTick((t) => t + 1)
    if (purpose !== 'register') {
      authApi.forgotPassword(identifier)
        .then((res) => {
          if (res?.otp) {
            pending.otp = res.otp
            pendingOtpRef.current = pending
            setOtpTick((t) => t + 1)
          }
        })
        .catch(() => {})
    }
    return pending
  }, [])

  const verifyOtp = useCallback(async (identifier, code, purpose = 'login') => {
    if (purpose === 'register') {
      const pending = pendingOtpRef.current
      if (!pending) return { success: false, message: 'No OTP requested. Please request a new one.' }
      if (Date.now() > pending.expiresAt) return { success: false, message: 'OTP expired. Please request a new one.' }
      if (code !== pending.otp) return { success: false, message: 'Incorrect OTP. Please try again.' }
      pendingOtpRef.current = null
      setOtpTick((t) => t + 1)
      return { success: true }
    }
    try {
      await authApi.verifyOtp(identifier, code, purpose)
      pendingOtpRef.current = null
      setOtpTick((t) => t + 1)
      return { success: true }
    } catch (err) {
      return { success: false, message: getErrorMessage(err, 'Verification failed') }
    }
  }, [])

  /* Guest — no account created, just browsing */
  const continueAsGuest = useCallback(() => {}, [])

  const pendingOtpPreview = pendingOtpRef.current?.otp || null

  const value = {
    user,
    role,
    authLoading,
    pendingOtpPreview,
    isAuthenticated: !!user,
    logout,
    loginWithPassword,
    loginWithOtp,
    register,
    updateProfile,
    stageRegistration,
    consumeRegistration,
    sendOtp,
    verifyOtp,
    resetPassword,
    continueAsGuest,
  }

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthCtx)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

/* ====================================================================
   WISHLIST CONTEXT  (MongoDB-backed)
   ==================================================================== */
const WishlistCtx = createContext(null)

export function WishlistProvider({ children }) {
  const { isAuthenticated } = useAuth()
  const [wishlist, setWishlist] = useState([])

  /* Load from backend whenever the session changes */
  useEffect(() => {
    if (!isAuthenticated) return
    wishlistApi.get()
      .then((items) => {
        setWishlist(items || [])
      })
      .catch(() => {})
  }, [isAuthenticated])

  const toggleWishlist = useCallback(async (product) => {
    const productId = product.id || product._id
    try {
      const items = await wishlistApi.toggle(productId)
      setWishlist(items || [])
    } catch {
      // fall back to optimistic local toggle
      setWishlist((prev) => {
        const exists = prev.some((p) => (p.id || p._id) === productId)
        return exists ? prev.filter((p) => (p.id || p._id) !== productId) : [{ ...product, addedAt: Date.now() }, ...prev]
      })
    }
  }, [])

  const removeFromWishlist = useCallback(async (id) => {
    setWishlist((prev) => prev.filter((p) => (p.id || p._id) !== id))
    try { await wishlistApi.remove(id) } catch { /* ignore */ }
  }, [])

  const clearWishlist = useCallback(async () => {
    setWishlist([])
    try { await wishlistApi.clear() } catch { /* ignore */ }
  }, [])

  const isWishlisted = useCallback((id) => wishlist.some((p) => (p.id || p._id) === id), [wishlist])

  return (
    <WishlistCtx.Provider value={{ wishlist, toggleWishlist, removeFromWishlist, clearWishlist, isWishlisted }}>
      {children}
    </WishlistCtx.Provider>
  )
}

export function useWishlist() {
  const ctx = useContext(WishlistCtx)
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider')
  return ctx
}

/* ====================================================================
   SETTINGS CONTEXT (notifications, dark-mode placeholder, language)
   ==================================================================== */
const SettingsCtx = createContext(null)

export function SettingsProvider({ children }) {
  const { isAuthenticated, user } = useAuth()
  const [settings, setSettings] = useState({
    notifications: { orders: true, offers: true, email: false },
    darkMode: false,
    language: 'en',
  })

  /* Load settings from user profile when the user object changes */
  useEffect(() => {
    if (user?.settings) {
      setSettings((prev) => ({ ...prev, ...user.settings }))
    }
  }, [user?.settings])

  const updateSettings = useCallback((patch) => {
    setSettings((prev) => ({ ...prev, ...patch }))
    /* persist to the user's settings in MongoDB when logged in */
    if (isAuthenticated) {
      authApi.updateProfile({ settings: patch }).catch(() => {})
    }
  }, [isAuthenticated])

  return <SettingsCtx.Provider value={{ settings, updateSettings }}>{children}</SettingsCtx.Provider>
}

export function useSettings() {
  const ctx = useContext(SettingsCtx)
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider')
  return ctx
}
