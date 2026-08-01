import { createContext, useContext, useCallback, useState } from 'react'

/* ====================================================================
   D.R.STORES — Auth, Roles & Wishlist
   Frontend-only simulation. No backend yet. All state persisted to
   localStorage so behaviour survives page reloads.
   ==================================================================== */

/* ========== ROLE SYSTEM ==========
   Architecture prepared for customer / admin / delivery.
   Admin dashboard is intentionally NOT built yet — roles are stored
   so future phases can gate routes (e.g. <ProtectedRoute role="admin">).
   ========================================== */
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

/* ====================================================================
   AUTH CONTEXT
   ==================================================================== */
const AuthCtx = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readJson(STORAGE_KEYS.user, null))
  const [role, setRole] = useState(() => localStorage.getItem(STORAGE_KEYS.role) || ROLES.CUSTOMER)

  const persistUser = useCallback((nextUser, nextRole) => {
    setUser(nextUser)
    setRole(nextRole)
    if (nextUser) writeJson(STORAGE_KEYS.user, nextUser)
    else localStorage.removeItem(STORAGE_KEYS.user)
    if (nextRole) localStorage.setItem(STORAGE_KEYS.role, nextRole)
    else localStorage.removeItem(STORAGE_KEYS.role)
  }, [])

  /* ---------- Session ---------- */
  const login = useCallback((userData, userRole = ROLES.CUSTOMER) => {
    persistUser(userData, userRole)
  }, [persistUser])

  const logout = useCallback(() => {
    persistUser(null, null)
  }, [persistUser])

  const updateProfile = useCallback((patch) => {
    setUser((prev) => {
      const next = { ...prev, ...patch }
      writeJson(STORAGE_KEYS.user, next)
      return next
    })
  }, [])

  /* ---------- Accounts (email + password) ---------- */
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

  const resetPassword = useCallback((identifier, newPassword) => {
    const accounts = getAccounts() // includes seeded demo account
    const idx = accounts.findIndex((a) =>
      a.email.toLowerCase() === String(identifier).toLowerCase() ||
      String(a.phone || '').replace(/\D/g, '') === String(identifier).replace(/\D/g, ''),
    )
    if (idx === -1) return { success: false, message: 'No account found for this identifier' }
    accounts[idx] = { ...accounts[idx], password: newPassword }
    writeJson(STORAGE_KEYS.accounts, accounts)
    return { success: true, account: accounts[idx] }
  }, [getAccounts])

  /* ---------- Registration (pending until OTP verified) ---------- */
  const stageRegistration = useCallback((data) => {
    writeJson(STORAGE_KEYS.pendingRegistration, data)
  }, [])

  const consumeRegistration = useCallback(() => {
    const pending = readJson(STORAGE_KEYS.pendingRegistration, null)
    localStorage.removeItem(STORAGE_KEYS.pendingRegistration)
    return pending
  }, [])

  /* ---------- OTP simulation ---------- */
  const sendOtp = useCallback((identifier, purpose) => {
    const otp = String(Math.floor(100000 + Math.random() * 900000))
    const pending = { otp, identifier, purpose, expiresAt: Date.now() + 5 * 60 * 1000 }
    writeJson(STORAGE_KEYS.pendingOtp, pending)
    return pending
  }, [])

  const verifyOtp = useCallback((code) => {
    const pending = readJson(STORAGE_KEYS.pendingOtp, null)
    if (!pending) return { success: false, message: 'No OTP requested. Please request a new one.' }
    if (Date.now() > pending.expiresAt) {
      localStorage.removeItem(STORAGE_KEYS.pendingOtp)
      return { success: false, message: 'OTP expired. Please request a new one.' }
    }
    if (code !== pending.otp) return { success: false, message: 'Incorrect OTP. Please try again.' }
    localStorage.removeItem(STORAGE_KEYS.pendingOtp)
    return { success: true, purpose: pending.purpose, identifier: pending.identifier }
  }, [])

  /* Guest — no account created, just browsing */
  const continueAsGuest = useCallback(() => {}, [])

  const value = {
    user,
    role,
    isAuthenticated: !!user,
    login,
    logout,
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
   WISHLIST CONTEXT
   ==================================================================== */
const WishlistCtx = createContext(null)

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => readJson(STORAGE_KEYS.wishlist, []))

  const persist = useCallback((next) => {
    setWishlist(next)
    writeJson(STORAGE_KEYS.wishlist, next)
  }, [])

  const toggleWishlist = useCallback((product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id)
      const next = exists ? prev.filter((p) => p.id !== product.id) : [{ ...product, addedAt: Date.now() }, ...prev]
      writeJson(STORAGE_KEYS.wishlist, next)
      return next
    })
  }, [])

  const removeFromWishlist = useCallback((id) => {
    setWishlist((prev) => {
      const next = prev.filter((p) => p.id !== id)
      writeJson(STORAGE_KEYS.wishlist, next)
      return next
    })
  }, [])

  const clearWishlist = useCallback(() => persist([]), [persist])

  const isWishlisted = useCallback((id) => wishlist.some((p) => p.id === id), [wishlist])

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
  }, [])

  return <SettingsCtx.Provider value={{ settings, updateSettings }}>{children}</SettingsCtx.Provider>
}

export function useSettings() {
  const ctx = useContext(SettingsCtx)
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider')
  return ctx
}
