import { useEffect, useState, useCallback, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldCheck, RefreshCw, Check, Smartphone, Mail } from 'lucide-react'
import AuthShell from '../../components/auth/AuthShell'
import AuthHeader from '../../components/auth/AuthHeader'
import OtpInput from '../../components/auth/OtpInput'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/CartContext'

const OTP_EXPIRY_SECONDS = 30

export default function VerifyOtpPage() {
  const { verifyOtp, sendOtp, consumeRegistration, register, loginWithOtp, pendingOtpPreview } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  const state = location.state || {}
  const identifier = state.identifier || ''
  const purpose = state.purpose || 'login'
  const from = state.from || '/'

  const [countdown, setCountdown] = useState(OTP_EXPIRY_SECONDS)
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [verifying, setVerifying] = useState(false)
  const [success, setSuccess] = useState(false)
  const [sending, setSending] = useState(false)
  const timer = useRef(null)

  /* Keep the countdown timer cleaned up on unmount */
  useEffect(() => {
    return () => clearInterval(timer.current)
  }, [])

  const startTimer = useCallback(() => {
    setCountdown(OTP_EXPIRY_SECONDS)
    clearInterval(timer.current)
    timer.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) { clearInterval(timer.current); return 0 }
        return c - 1
      })
    }, 1000)
  }, [])

  useEffect(() => { startTimer() }, [startTimer])

  const handleResend = () => {
    if (sending) return
    setSending(true)
    setTimeout(() => {
      sendOtp(identifier, purpose)
      startTimer()
      setError('')
      setCode('')
      setSending(false)
      addToast('New OTP sent', 'info', 2500)
    }, 1000)
  }

  /* ---------- Post-verification routing by purpose ---------- */
  const complete = useCallback(async () => {
    const dest = (user) => (user?.role === 'admin' ? '/admin/dashboard' : from)
    if (purpose === 'register') {
      const pending = consumeRegistration()
      if (pending) {
        // Creates a real User document in MongoDB via the API
        const res = await register(pending)
        if (!res.success) {
          addToast(res.message, 'error', 3500)
          navigate('/login', { replace: true })
          return
        }
      }
      navigate('/profile', { replace: true })
    } else if (purpose === 'reset') {
      navigate('/reset-password', { replace: true, state: { identifier } })
    } else {
      // login via phone OTP — MongoDB-backed session
      const res = await loginWithOtp(identifier)
      if (!res.success) {
        addToast(res.message, 'error', 3500)
        navigate('/login', { replace: true })
        return
      }
      addToast(`Welcome back, ${res.user.name.split(' ')[0]}! 👋`, 'success', 3000)
      navigate(dest(res.user), { replace: true })
    }
  }, [purpose, consumeRegistration, register, loginWithOtp, identifier, navigate, from, addToast])

  const handleComplete = async (value) => {
    if (verifying) return
    setVerifying(true)
    const result = await verifyOtp(identifier, value, purpose)
    if (result.success) {
      addToast('Verified successfully! 🎉', 'success', 3000)
      setSuccess(true)
      setTimeout(complete, 1300)
    } else {
      setError(result.message)
      setCode('')
      setVerifying(false)
    }
  }

  const Icon = purpose === 'reset' ? Mail : Smartphone

  return (
    <AuthShell>
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
        eyebrow="Verify it's you"
        title="Enter verification code"
        subtitle={<>We've sent a 6-digit code to <b className="text-dark font-semibold">{identifier || 'your device'}</b></>}
      />

      <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-card">
        <div className="rounded-2xl bg-primary/5 border border-primary/10 px-4 py-3 flex items-center justify-center gap-2.5 mb-6">
          <ShieldCheck className="w-4.5 h-4.5 text-primary shrink-0" />
          <p className="text-xs text-dark/55">This code helps keep your account secure.</p>
        </div>

        {/* Demo message preview */}
        {pendingOtpPreview && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-2xl border border-dashed border-accent/40 bg-accent/5 px-4 py-3 text-center"
          >
            <p className="text-[11px] font-semibold uppercase tracking-wider text-accent mb-1 flex items-center justify-center gap-1.5">
              <span className="relative flex w-2 h-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" /><span className="relative inline-flex rounded-full w-2 h-2 bg-accent" /></span>
              Demo message
            </p>
            <p className="text-sm text-dark/70">
              Your D.R.STORES OTP is <b className="text-xl font-black text-dark tracking-[0.2em]">{pendingOtpPreview}</b>
            </p>
          </motion.div>
        )}

        <OtpInput
          length={6}
          value={code}
          onChange={setCode}
          onComplete={handleComplete}
          error={error}
        />

        {/* Countdown / resend */}
        <div className="mt-5 text-center">
          {countdown > 0 ? (
            <p className="text-xs text-dark/45 flex items-center justify-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5" />
              Resend code in <b className="text-dark font-bold tabular-nums">0:{String(countdown).padStart(2, '0')}</b>
            </p>
          ) : (
            <button onClick={handleResend} disabled={sending} className="text-xs font-bold text-primary hover:text-primary-dark transition-colors flex items-center gap-1.5 mx-auto">
              <RefreshCw className={`w-3.5 h-3.5 ${sending ? 'animate-spin' : ''}`} />
              {sending ? 'Sending…' : 'Resend OTP'}
            </button>
          )}
        </div>

        {/* Verify button (also triggered on 6th digit) */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => code.length === 6 && handleComplete(code)}
          disabled={code.length !== 6 || verifying}
          className="mt-6 w-full h-13 rounded-2xl bg-gradient-to-r from-primary to-primary-dark text-white text-sm font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {verifying ? (
            <span className="inline-flex items-center gap-2">
              <span className="w-4.5 h-4.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Verifying…
            </span>
          ) : (
            <>Verify & Continue <Icon className="w-4 h-4" /></>
          )}
        </motion.button>
      </div>

      <p className="mt-6 text-center text-sm text-dark/45">
        Wrong number?{' '}
        <Link to={purpose === 'register' ? '/register' : purpose === 'reset' ? '/forgot-password' : '/login'} className="font-bold text-primary hover:text-primary-dark transition-colors">
          Go back
        </Link>
      </p>
    </AuthShell>
  )
}
