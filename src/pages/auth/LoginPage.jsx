import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Smartphone, Mail, ArrowRight, Check, UserRound } from 'lucide-react'
import AuthShell from '../../components/auth/AuthShell'
import AuthHeader from '../../components/auth/AuthHeader'
import { Field, PasswordField } from '../../components/auth/Field'
import GoogleButton from '../../components/auth/GoogleButton'
import { LoadingButton } from '../../components/auth/GoogleButton'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/CartContext'
import { ROLES } from '../../context/AuthContext'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function LoginPage() {
  const { login, sendOtp, findAccount, continueAsGuest } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/'

  const [mode, setMode] = useState('otp')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState(() => localStorage.getItem('dr-remember-email') || '')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(() => !!localStorage.getItem('dr-remember-email'))
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)
  const [success, setSuccess] = useState(false)

  const finishLogin = (user, userRole = ROLES.CUSTOMER) => {
    login(user, userRole)
    addToast(`Welcome back, ${user.name.split(' ')[0]}! 👋`, 'success', 3500)
    setSuccess(true)
    setTimeout(() => navigate(from, { replace: true }), 1200)
  }

  /* ---------- Mobile + OTP ---------- */
  const handleSendOtp = () => {
    const errs = {}
    if (!/^[6-9]\d{9}$/.test(phone)) errs.phone = 'Enter a valid 10-digit mobile number'
    setErrors(errs)
    if (Object.keys(errs).length) return
    setBusy(true)
    setTimeout(() => {
      sendOtp(`+91 ${phone}`, 'login')
      addToast(`OTP sent to +91 ${phone}`, 'info', 3000)
      setBusy(false)
      navigate('/verify-otp', { state: { identifier: `+91 ${phone}`, purpose: 'login' } })
    }, 1200)
  }

  /* ---------- Email + Password ---------- */
  const handleEmailLogin = () => {
    const errs = {}
    if (!email) errs.email = 'Email is required'
    else if (!emailRegex.test(email)) errs.email = 'Enter a valid email address'
    if (!password) errs.password = 'Password is required'
    setErrors(errs)
    if (Object.keys(errs).length) return

    setBusy(true)
    setTimeout(() => {
      const account = findAccount(email)
      if (!account) {
        setErrors({ email: 'No account found. Please register first.' })
        addToast('Account not found', 'info')
        setBusy(false)
        return
      }
      if (account.password !== password) {
        setErrors({ password: 'Incorrect password. Please try again.' })
        setBusy(false)
        return
      }
      if (remember) localStorage.setItem('dr-remember-email', email)
      else localStorage.removeItem('dr-remember-email')
      setBusy(false)
      finishLogin({ id: 'usr_' + email.replace(/[^a-z0-9]/gi, ''), name: account.name, email: account.email, phone: account.phone, memberSince: account.memberSince })
    }, 1200)
  }

  /* ---------- Google (simulated) ---------- */
  const handleGoogle = () => {
    setBusy(true)
    setTimeout(() => {
      setBusy(false)
      finishLogin({
        id: 'usr_google_demo',
        name: 'Google Customer',
        email: 'google.user@example.com',
        phone: '',
        avatar: null,
        memberSince: new Date().toISOString(),
      })
    }, 1400)
  }

  const handleGuest = () => {
    continueAsGuest()
    addToast('Browsing as guest — sign in anytime to sync your account', 'info', 4000)
    navigate('/')
  }

  return (
    <AuthShell>
      {/* Success overlay */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-cream/90 backdrop-blur flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 220, damping: 15 }}
              className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-2xl shadow-primary/30"
            >
              <Check className="w-12 h-12 text-white" strokeWidth={3} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AuthHeader
        eyebrow="Welcome back"
        title={<>Sign in to <span className="text-gradient">D.R.STORES</span></>}
        subtitle="Fresh groceries are one tap away. Choose how you'd like to continue."
      />

      <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-card">
        {/* Mode tabs */}
        <div className="grid grid-cols-2 gap-1 p-1 rounded-2xl bg-black/5 mb-6">
          {[
            { id: 'otp', label: 'Mobile + OTP', icon: Smartphone },
            { id: 'email', label: 'Email & Password', icon: Mail },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => { setMode(t.id); setErrors({}) }}
              className={`relative flex items-center justify-center gap-2 h-10 rounded-xl text-[13px] font-semibold transition-all duration-300 ${
                mode === t.id ? 'text-white' : 'text-dark/50 hover:text-dark/70'
              }`}
            >
              {mode === t.id && (
                <motion.span
                  layoutId="auth-tab"
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary to-primary-dark shadow-md shadow-primary/25"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
              <t.icon className="w-4 h-4 relative z-10" />
              <span className="relative z-10">{t.label}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {mode === 'otp' ? (
            <motion.div key="otp" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }} className="space-y-4">
              <Field
                label="Mobile Number"
                icon={Smartphone}
                leftAddon="+91"
                inputMode="numeric"
                maxLength={10}
                placeholder="98765 43210"
                value={phone}
                onChange={(e) => { setPhone(e.target.value.replace(/\D/g, '').slice(0, 10)); setErrors((s) => ({ ...s, phone: null })) }}
                error={errors.phone}
                valid={/^[6-9]\d{9}$/.test(phone)}
              />
              <LoadingButton loading={busy} loadingText="Sending OTP…" onClick={handleSendOtp}>
                Send OTP <ArrowRight className="w-4 h-4" />
              </LoadingButton>
              <p className="text-[11px] text-dark/35 text-center">We'll send a 6-digit verification code to this number.</p>
            </motion.div>
          ) : (
            <motion.div key="email" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }} className="space-y-4">
              <Field
                label="Email Address"
                icon={Mail}
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrors((s) => ({ ...s, email: null })) }}
                error={errors.email}
                valid={!!email && emailRegex.test(email)}
              />
              <PasswordField
                icon={Mail}
                placeholder="••••••••"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrors((s) => ({ ...s, password: null })) }}
                error={errors.password}
                valid={password.length >= 6}
              />
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="w-4 h-4 rounded accent-[#2E7D32]"
                  />
                  <span className="text-xs text-dark/55">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-xs font-semibold text-primary hover:text-primary-dark transition-colors">
                  Forgot password?
                </Link>
              </div>
              <LoadingButton loading={busy} loadingText="Signing in…" onClick={handleEmailLogin}>
                Sign In <ArrowRight className="w-4 h-4" />
              </LoadingButton>
              <div className="rounded-xl bg-primary/5 border border-primary/10 px-3 py-2.5 text-center">
                <span className="text-[11px] text-dark/50">Demo: <b className="text-primary">demo@drstores.com</b> / <b className="text-primary">demo123</b></span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <span className="flex-1 h-px bg-black/8" />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-dark/30">or continue with</span>
          <span className="flex-1 h-px bg-black/8" />
        </div>

        <GoogleButton onLogin={handleGoogle} />
        <button onClick={handleGuest} className="mt-3 w-full h-11 rounded-2xl text-sm font-semibold text-dark/55 hover:text-primary border border-dashed border-black/15 hover:border-primary/40 transition-all duration-300 flex items-center justify-center gap-2">
          <UserRound className="w-4 h-4" /> Continue as Guest
        </button>
      </div>

      <p className="mt-6 text-center text-sm text-dark/45">
        New to D.R.STORES?{' '}
        <Link to="/register" className="font-bold text-primary hover:text-primary-dark transition-colors">
          Create an account
        </Link>
      </p>
    </AuthShell>
  )
}
