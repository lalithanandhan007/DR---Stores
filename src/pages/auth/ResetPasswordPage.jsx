import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { KeyRound, ArrowRight, Check, ShieldCheck } from 'lucide-react'
import AuthShell from '../../components/auth/AuthShell'
import AuthHeader from '../../components/auth/AuthHeader'
import { PasswordField } from '../../components/auth/Field'
import { LoadingButton } from '../../components/auth/GoogleButton'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/CartContext'

export default function ResetPasswordPage() {
  const { resetPassword } = useAuth()
  const { addToast } = useToast()
  const location = useLocation()
  const identifier = location.state?.identifier || ''

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)

  const handleSubmit = async () => {
    const errs = {}
    if (password.length < 6) errs.password = 'Password must be at least 6 characters'
    if (confirm !== password) errs.confirm = 'Passwords do not match'
    setErrors(errs)
    if (Object.keys(errs).length) return

    setBusy(true)
    const result = await resetPassword(identifier, password)
    setBusy(false)
    if (result.success) {
      addToast('Password updated successfully!', 'success', 3000)
      setDone(true)
    } else {
      setErrors({ password: result.message })
    }
  }

  if (done) {
    return (
      <AuthShell>
        <div className="glass-card rounded-3xl p-8 sm:p-10 shadow-card text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
            className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-2xl shadow-primary/30"
          >
            <Check className="w-12 h-12 text-white" strokeWidth={3} />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="font-serif-display text-3xl font-bold text-dark mt-6"
          >
            All set!
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-3 text-dark/50 text-sm font-light"
          >
            Your password has been reset successfully. Sign in with your new password.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="mt-8">
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 w-full h-13 rounded-2xl bg-gradient-to-r from-primary to-primary-dark text-white text-sm font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-300"
            >
              Back to Sign In <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </AuthShell>
    )
  }

  return (
    <AuthShell>
      <AuthHeader
        eyebrow="New password"
        title="Set a new password"
        subtitle="Choose a strong password you haven't used before."
      />

      <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-card">
        <div className="space-y-4">
          <div className="rounded-2xl bg-primary/5 border border-primary/10 px-4 py-3 flex items-center gap-3 mb-2">
            <ShieldCheck className="w-4.5 h-4.5 text-primary shrink-0" />
            <p className="text-xs text-dark/55">Verifying for <b className="text-dark">{identifier}</b></p>
          </div>
          <PasswordField
            label="New Password"
            icon={KeyRound}
            placeholder="Min 6 characters"
            autoComplete="new-password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setErrors((s) => ({ ...s, password: null })) }}
            error={errors.password}
            valid={password.length >= 6}
          />
          <PasswordField
            label="Confirm New Password"
            icon={KeyRound}
            placeholder="Re-enter new password"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => { setConfirm(e.target.value); setErrors((s) => ({ ...s, confirm: null })) }}
            error={errors.confirm}
            valid={!!confirm && confirm === password}
          />
          <LoadingButton loading={busy} loadingText="Updating…" onClick={handleSubmit}>
            Reset Password <ArrowRight className="w-4 h-4" />
          </LoadingButton>
        </div>
      </div>
    </AuthShell>
  )
}
