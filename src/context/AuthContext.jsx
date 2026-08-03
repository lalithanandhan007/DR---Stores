import { createContext, useContext, useCallback, useState, useEffect } from 'react'
import { authApi, wishlistApi } from '../api'
import { getErrorMessage } from '../api/client'

/* ====================================================================
   D.R.STORES — Auth, Roles & Wishlist
   Sessions are now backed by the Express + MongoDB API (JWT). The OTP
   "SMS" is simulated (no SMS provider) but the OTP is generated &
   verified by the backend for login/reset flows, and registration
   writes a real User document to MongoDB.
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
  accounts: 'dr-accounts',
  pendingOtp: 'dr-pending-otp',
  pendingRegistration: 'dr-pending-registration',
  settings: 'dr-settings',
  wishlist: 'dr-wishlist',
}

/* Demo account so email+password login works out of the box */
const DEMO_ACCOUNT = { name: 'Demo Customer', email: 'demo@drstores.com', phone: '9876543210', password: 'demo123' }

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

  const persistUser = useCallback((nextUser, nextRole) => {
    const normalized = normalizeUser(nextUser)
    setUser(normalized)
    setRole(nextRole)
    if (normalized) writeJson(STORAGE_KEYS.user, normalized)
    else localStorage.removeItem(STORAGE_KEYS.user)
    if (nextRole) localStorage.setItem(STORAGE_KEYS.role, nextRole)
    else localStorage.removeItem(STORAGE_KEYS.role)
  }, [])

  const persistSession = useCallback((nextUser, token) => {
    persistUser(nextUser, nextUser?.role || ROLES.CUSTOMER)
    if (token) localStorage.setItem(STORAGE_KEYS.token, token)
  }, [persistUser])

  /* Hydrate a real session from the JWT on first load */
  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.token)
    if (token && !user) {
      authApi.getMe()
        .then(({ user: fetched }) => {
          persistUser(fetched, fetched.role)
        })
        .catch(() => {
          localStorage.removeItem(STORAGE_KEYS.token)
          persistUser(null, null)
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* ---------- Session ---------- */
  const login = useCallback((userData, userRole = ROLES.CUSTOMER) => {
    persistUser(userData, userRole)
  }, [persistUser])

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

  const updateProfile = useCallback((patch) => {
    setUser((prev) => {
      const next = { ...prev, ...patch }
      writeJson(STORAGE_KEYS.user, next)
      return next
    })
    authApi.updateProfile(patch)
      .then(({ user: fetched }) => { persistUser(fetched, fetched.role) })
      .catch(() => {})
  }, [persistUser])

  /* ---------- Accounts (local mirror for the demo/simulation UX) ---------- */
  const getAccounts = useCallback(() => {
    const accounts = readJson(STORAGE_KEYS.accounts, [])
    if (!accounts.some((a) => a.email === DEMO_ACCOUNT.email)) accounts.unshift(DEMO_ACCOUNT)
    return accounts
  }, [])

  const saveAccount = useCallback((account) => {
    const accounts = readJson(STORAGE_KEYS.accounts, [])
    const idx = accounts.findIndex((a) => a.email === account.email)
    if (idx >= 0) accounts[idx] = account
    else accounts.push(account)
    writeJson(STORAGE_KEYS.accounts, accounts)
  }, [])

  const findAccount = useCallback((email) => {
    return getAccounts().find((a) => a.email.toLowerCase() === email.toLowerCase()) || null
  }, [getAccounts])

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
    writeJson(STORAGE_KEYS.pendingRegistration, data)
  }, [])

  const consumeRegistration = useCallback(() => {
    const pending = readJson(STORAGE_KEYS.pendingRegistration, null)
    localStorage.removeItem(STORAGE_KEYS.pendingRegistration)
    return pending
  }, [])

  /* ---------- OTP ----------
     No real SMS provider, so the code is shown as a "demo OTP". For
     login/reset the backend also generates & stores a real OTP on the
     user document so verification is database-backed. */
  const sendOtp = useCallback((identifier, purpose) => {
    const otp = String(Math.floor(100000 + Math.random() * 900000))
    const pending = { otp, identifier, purpose, expiresAt: Date.now() + 5 * 60 * 1000 }
    writeJson(STORAGE_KEYS.pendingOtp, pending)
    if (purpose !== 'register') {
      authApi.forgotPassword(identifier)
        .then((res) => {
          if (res?.otp) {
            pending.otp = res.otp
            writeJson(STORAGE_KEYS.pendingOtp, pending)
          }
        })
        .catch(() => {})
    }
    return pending
  }, [])

  const verifyOtp = useCallback(async (identifier, code, purpose = 'login') => {
    if (purpose === 'register') {
      const pending = readJson(STORAGE_KEYS.pendingOtp, null)
      if (!pending) return { success: false, message: 'No OTP requested. Please request a new one.' }
      if (Date.now() > pending.expiresAt) return { success: false, message: 'OTP expired. Please request a new one.' }
      if (code !== pending.otp) return { success: false, message: 'Incorrect OTP. Please try again.' }
      localStorage.removeItem(STORAGE_KEYS.pendingOtp)
      return { success: true }
    }
    try {
      await authApi.verifyOtp(identifier, code, purpose)
      localStorage.removeItem(STORAGE_KEYS.pendingOtp)
      return { success: true }
    } catch (err) {
      return { success: false, message: getErrorMessage(err, 'Verification failed') }
    }
  }, [])

  /* Guest — no account created, just browsing */
  const continueAsGuest = useCallback(() => {}, [])

  const value = {
    user,
    role,
    isAuthenticated: !!user,
    login,
    logout,
    loginWithPassword,
    loginWithOtp,
    register,
    updateProfile,
    getAccounts,
    saveAccount,
    findAccount,
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
  const [wishlist, setWishlist] = useState(() => readJson(STORAGE_KEYS.wishlist, []))

  /* Load from backend whenever the session changes */
  useEffect(() => {
    if (!isAuthenticated) return
    wishlistApi.get()
      .then((items) => {
        setWishlist(items || [])
        writeJson(STORAGE_KEYS.wishlist, items || [])
      })
      .catch(() => {})
  }, [isAuthenticated])

  const toggleWishlist = useCallback(async (product) => {
    const productId = product.id || product._id
    try {
      const items = await wishlistApi.toggle(productId)
      setWishlist(items || [])
      writeJson(STORAGE_KEYS.wishlist, items || [])
    } catch {
      // fall back to optimistic local toggle
      setWishlist((prev) => {
        const exists = prev.some((p) => (p.id || p._id) === productId)
        const next = exists ? prev.filter((p) => (p.id || p._id) !== productId) : [{ ...product, addedAt: Date.now() }, ...prev]
        writeJson(STORAGE_KEYS.wishlist, next)
        return next
      })
    }
  }, [])

  const removeFromWishlist = useCallback(async (id) => {
    setWishlist((prev) => {
      const next = prev.filter((p) => (p.id || p._id) !== id)
      writeJson(STORAGE_KEYS.wishlist, next)
      return next
    })
    try { await wishlistApi.remove(id) } catch { /* ignore */ }
  }, [])

  const clearWishlist = useCallback(async () => {
    setWishlist([])
    writeJson(STORAGE_KEYS.wishlist, [])
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
  const { isAuthenticated } = useAuth()
  const [settings, setSettings] = useState(() => readJson(STORAGE_KEYS.settings, {
    notifications: { orders: true, offers: true, email: false },
    darkMode: false,
    language: 'en',
  }))

  const updateSettings = useCallback((patch) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch }
      writeJson(STORAGE_KEYS.settings, next)
      return next
    })
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
