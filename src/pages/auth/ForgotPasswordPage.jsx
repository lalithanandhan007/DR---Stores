import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Smartphone, ArrowRight } from 'lucide-react'
import AuthShell from '../../components/auth/AuthShell'
import AuthHeader from '../../components/auth/AuthHeader'
import { Field } from '../../components/auth/Field'
import { LoadingButton } from '../../components/auth/GoogleButton'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/CartContext'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function ForgotPasswordPage() {
  const { sendOtp } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()

  const [value, setValue] = useState('')
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)

  const isPhone = /^[6-9]\d{9}$/.test(value.trim())
  const isEmail = emailRegex.test(value.trim())

  const handleSubmit = () => {
    if (!isPhone && !isEmail) {
      setErrors({ value: 'Enter a valid email address or 10-digit mobile number' })
      return
    }
    setBusy(true)
    setTimeout(() => {
      const identifier = isEmail ? value.trim().toLowerCase() : `+91 ${value.trim()}`
      sendOtp(identifier, 'reset')
      addToast(`Reset OTP sent to ${identifier}`, 'info', 3000)
      setBusy(false)
      navigate('/verify-otp', { state: { identifier, purpose: 'reset' } })
    }, 1200)
  }

  return (
    <AuthShell>
      <AuthHeader
        eyebrow="Reset password"
        title="Forgot your password?"
        subtitle="No worries — enter your email or mobile number and we'll send you a one-time code to reset it."
      />

      <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-card">
        <div className="space-y-4">
          <Field
            label="Email or Mobile Number"
            icon={isPhone ? Smartphone : Mail}
            inputMode={isPhone ? 'numeric' : 'email'}
            placeholder="you@example.com  or  +91 98765 43210"
            value={value}
            onChange={(e) => { setValue(e.target.value); setErrors({}) }}
            error={errors.value}
            valid={isPhone || isEmail}
          />
          <div className="rounded-xl bg-primary/5 border border-primary/10 px-4 py-3 flex items-center gap-3">
            <span className="text-xl">🔒</span>
            <p className="text-xs text-dark/55 leading-relaxed">You'll receive a 6-digit verification code. It expires in 5 minutes.</p>
          </div>
          <LoadingButton loading={busy} loadingText="Sending code…" onClick={handleSubmit}>
            Send OTP <ArrowRight className="w-4 h-4" />
          </LoadingButton>
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-dark/45">
        Remembered it?{' '}
        <Link to="/login" className="font-bold text-primary hover:text-primary-dark transition-colors">Back to sign in</Link>
      </p>
    </AuthShell>
  )
}
