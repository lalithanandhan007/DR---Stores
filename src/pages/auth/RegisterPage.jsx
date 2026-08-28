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
  const { stageRegistration, sendOtp } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()

  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' })
  const [accepted, setAccepted] = useState(false)
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)
  const [showTerms, setShowTerms] = useState(false)
  const [showPrivacy, setShowPrivacy] = useState(false)

  const set = (k, v) => { setForm((f) => ({ ...f, [k]: v })); setErrors((s) => ({ ...s, [k]: null })) }

  const handleSubmit = () => {
    const errs = {}
    if (form.name.trim().length < 3) errs.name = 'Please enter your full name'
    if (!form.email) errs.email = 'Email is required'
    else if (!emailRegex.test(form.email)) errs.email = 'Enter a valid email address'
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

<div className="flex items-start gap-2.5 select-none">
  <input
    type="checkbox"
    checked={accepted}
    onChange={(e) => {
      setAccepted(e.target.checked)
      setErrors((s) => ({ ...s, terms: null }))
    }}
    className="w-4 h-4 mt-0.5 rounded accent-[#2E7D32] cursor-pointer"
  />

  <span className="text-xs text-dark/55 leading-relaxed">
    I agree to the{' '}

    <button
      type="button"
      onClick={() => setShowTerms(true)}
      className="font-semibold text-primary hover:text-primary-dark transition-colors"
    >
      Terms & Conditions
    </button>

    {' '}and{' '}

    <button
      type="button"
      onClick={() => setShowPrivacy(true)}
      className="font-semibold text-primary hover:text-primary-dark transition-colors"
    >
      Privacy Policy
    </button>
  </span>
</div>
          {errors.terms && <p className="text-[11px] font-medium text-red-500 -mt-2">{errors.terms}</p>}

          <LoadingButton loading={busy} loadingText="Creating account…" onClick={handleSubmit}>
            Create Account <ArrowRight className="w-4 h-4" />
          </LoadingButton>
        </div>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-6 text-center text-sm text-dark/45"
      >
        Already have an account?{' '}
        <Link
          to="/login"
          className="font-bold text-primary hover:text-primary-dark transition-colors"
        >
          Sign in
        </Link>
      </motion.p>

      {showTerms && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setShowTerms(false)}
        >
          <div
            className="w-full max-w-lg max-h-[80vh] overflow-y-auto rounded-3xl bg-white p-6 sm:p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-2xl font-bold text-dark">
                Terms & Conditions
              </h2>

              <button
                type="button"
                onClick={() => setShowTerms(false)}
                className="text-2xl text-dark/50 hover:text-dark"
              >
                ×
              </button>
            </div>

            <div className="space-y-4 text-sm leading-relaxed text-dark/65">
              <p>
                Welcome to D.R Stores. By creating an account and using our
                services, you agree to these Terms & Conditions.
              </p>

              <div>
                <h3 className="font-bold text-dark mb-1">1. Account Usage</h3>
                <p>
                  You are responsible for providing accurate information and
                  keeping your account details secure.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-dark mb-1">2. Orders & Delivery</h3>
                <p>
                  Orders are subject to product availability and delivery
                  availability in your selected location.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-dark mb-1">3. Payments</h3>
                <p>
                  All applicable charges must be paid using the available
                  payment methods during checkout.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-dark mb-1">4. Changes</h3>
                <p>
                  D.R Stores may update these Terms & Conditions when required.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowTerms(false)}
              className="mt-6 w-full rounded-xl bg-primary py-3 font-bold text-white hover:bg-primary-dark transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showPrivacy && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setShowPrivacy(false)}
        >
          <div
            className="w-full max-w-lg max-h-[80vh] overflow-y-auto rounded-3xl bg-white p-6 sm:p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-2xl font-bold text-dark">
                Privacy Policy
              </h2>

              <button
                type="button"
                onClick={() => setShowPrivacy(false)}
                className="text-2xl text-dark/50 hover:text-dark"
              >
                ×
              </button>
            </div>

            <div className="space-y-4 text-sm leading-relaxed text-dark/65">
              <p>
                At D.R Stores, we respect your privacy and take reasonable
                measures to protect your personal information.
              </p>

              <div>
                <h3 className="font-bold text-dark mb-1">
                  Information We Collect
                </h3>

                <p>
                  We may collect your name, email address, phone number,
                  delivery address and order information.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-dark mb-1">
                  How We Use Your Information
                </h3>

                <p>
                  Your information is used to manage your account, process
                  orders, provide deliveries and improve our services.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-dark mb-1">
                  Data Protection
                </h3>

                <p>
                  We take appropriate steps to protect your personal
                  information from unauthorized access or misuse.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-dark mb-1">
                  Contact
                </h3>

                <p>
                  If you have questions about your privacy, please contact
                  D.R Stores.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowPrivacy(false)}
              className="mt-6 w-full rounded-xl bg-primary py-3 font-bold text-white hover:bg-primary-dark transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </AuthShell>
  )
}
