import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Mail, Smartphone, ArrowRight } from 'lucide-react'
import AuthShell from '../../components/auth/AuthShell'
import AuthHeader from '../../components/auth/AuthHeader'
import { Field, PasswordField } from '../../components/auth/Field'
import { LoadingButton } from '../../components/auth/GoogleButton'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/CartContext'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function RegisterPage() {
  const { stageRegistration, sendOtp, findAccount } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()

  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' })
  const [accepted, setAccepted] = useState(false)
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)

  const set = (k, v) => { setForm((f) => ({ ...f, [k]: v })); setErrors((s) => ({ ...s, [k]: null })) }

  const handleSubmit = () => {
    const errs = {}
    if (form.name.trim().length < 3) errs.name = 'Please enter your full name'
    if (!form.email) errs.email = 'Email is required'
    else if (!emailRegex.test(form.email)) errs.email = 'Enter a valid email address'
    else if (findAccount(form.email)) errs.email = 'An account already exists with this email'
    if (!/^[6-9]\d{9}$/.test(form.phone)) errs.phone = 'Enter a valid 10-digit mobile number'
    if (form.password.length < 6) errs.password = 'Password must be at least 6 characters'
    if (form.confirm !== form.password) errs.confirm = 'Passwords do not match'
    if (!accepted) errs.terms = 'Please accept the Terms & Conditions'
    setErrors(errs)
    if (Object.keys(errs).length) return

    setBusy(true)
    setTimeout(() => {
      stageRegistration({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone,
        password: form.password,
      })
      sendOtp(`+91 ${form.phone}`, 'register')
      addToast('Account created! Verify your mobile to activate it', 'success', 3500)
      setBusy(false)
      navigate('/verify-otp', { state: { identifier: `+91 ${form.phone}`, purpose: 'register' } })
    }, 1400)
  }

  return (
    <AuthShell>
      <AuthHeader
        eyebrow="Join us"
        title={<>Create your <span className="text-gradient">account</span></>}
        subtitle="Get ₹100 off your first order when you sign up today."
      />

      <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-card">
        <div className="space-y-4">
          <Field
            label="Full Name"
            icon={User}
            placeholder="Priya Sharma"
            autoComplete="name"
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            error={errors.name}
            valid={form.name.trim().length >= 3}
          />
          <Field
            label="Email Address"
            icon={Mail}
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            value={form.email}
            onChange={(e) => set('email', e.target.value)}
            error={errors.email}
            valid={!!form.email && emailRegex.test(form.email)}
          />
          <Field
            label="Mobile Number"
            icon={Smartphone}
            leftAddon="+91"
            inputMode="numeric"
            maxLength={10}
            placeholder="98765 43210"
            autoComplete="tel"
            value={form.phone}
            onChange={(e) => set('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
            error={errors.phone}
            valid={/^[6-9]\d{9}$/.test(form.phone)}
          />
          <div className="grid sm:grid-cols-2 gap-4">
            <PasswordField
              label="Password"
              placeholder="Min 6 characters"
              autoComplete="new-password"
              value={form.password}
              onChange={(e) => set('password', e.target.value)}
              error={errors.password}
              valid={form.password.length >= 6}
            />
            <PasswordField
              label="Confirm Password"
              placeholder="Re-enter password"
              autoComplete="new-password"
              value={form.confirm}
              onChange={(e) => set('confirm', e.target.value)}
              error={errors.confirm}
              valid={!!form.confirm && form.confirm === form.password}
            />
          </div>

          {/* Strength meter */}
          {form.password && (
            <div>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4].map((i) => {
                  const score = Math.min(form.password.replace(/[^A-Za-z0-9]/g, '').length > 4 ? 1 : 0 + (form.password.length > 6 ? 1 : 0) + (/[A-Z]|\d/.test(form.password) ? 1 : 0) + (form.password.length > 10 ? 1 : 0), 4)
                  const color = score <= 1 ? 'bg-red-400' : score === 2 ? 'bg-accent' : score === 3 ? 'bg-secondary' : 'bg-primary'
                  return <span key={i} className={`h-1 flex-1 rounded-full transition-all duration-500 ${i < score ? color : 'bg-black/8'}`} />
                })}
              </div>
              <p className="text-[11px] text-dark/35 mt-1.5">Use a mix of letters, numbers & symbols for a strong password.</p>
            </div>
          )}

          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => { setAccepted(e.target.checked); setErrors((s) => ({ ...s, terms: null })) }}
              className="w-4 h-4 mt-0.5 rounded accent-[#2E7D32]"
            />
            <span className="text-xs text-dark/55 leading-relaxed">
              I agree to the{' '}
              <span className="font-semibold text-primary cursor-pointer">Terms & Conditions</span> and{' '}
              <span className="font-semibold text-primary cursor-pointer">Privacy Policy</span>
            </span>
          </label>
          {errors.terms && <p className="text-[11px] font-medium text-red-500 -mt-2">{errors.terms}</p>}

          <LoadingButton loading={busy} loadingText="Creating account…" onClick={handleSubmit}>
            Create Account <ArrowRight className="w-4 h-4" />
          </LoadingButton>
        </div>
      </div>

      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-6 text-center text-sm text-dark/45">
        Already have an account?{' '}
        <Link to="/login" className="font-bold text-primary hover:text-primary-dark transition-colors">Sign in</Link>
      </motion.p>
    </AuthShell>
  )
}
