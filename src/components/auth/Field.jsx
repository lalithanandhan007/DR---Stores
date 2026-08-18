import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, AlertCircle, Check } from 'lucide-react'

const baseFieldClass =
  'w-full h-12 pl-4 rounded-2xl bg-white border text-sm text-dark placeholder:text-dark/25 ' +
  'focus:outline-none transition-all duration-300'

function fieldBorder(error, valid) {
  if (error) return 'border-red-400/60 focus:border-red-400 focus:ring-4 focus:ring-red-100'
  if (valid) return 'border-primary/40 focus:border-primary focus:ring-4 focus:ring-primary/10'
  return 'border-black/8 focus:border-primary/40 focus:ring-4 focus:ring-primary/10'
}

/* ---------- Validation feedback ---------- */
export function FieldError({ error }) {
  return (
    <AnimatePresence mode="wait">
      {error && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="flex items-center gap-1.5 text-[11px] font-medium text-red-500 mt-1.5 overflow-hidden"
        >
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  )
}

/* ---------- Text / email / phone input ---------- */
export function Field({
  label, icon: Icon, error, valid, leftAddon, className = '', children, ...props
}) {
  return (
    <div className={`${className}`}>
      {label && <label className="block text-[13px] font-semibold text-dark/70 mb-1.5">{label}</label>}
      <div className="relative">
        {Icon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-dark/30 pointer-events-none">
            <Icon className="w-4.5 h-4.5" />
          </span>
        )}
        {leftAddon && (
  <span
    className={`absolute top-1/2 -translate-y-1/2 flex items-center gap-2 text-dark/45 text-sm font-semibold pointer-events-none ${
      Icon ? 'left-11' : 'left-4'
    }`}
  >
    {leftAddon}
    <span className="w-px h-5 bg-black/10" />
  </span>
)}
        <input
          {...props}
          className={`${baseFieldClass} ${
            leftAddon
              ? Icon
                ? 'pl-[6.5rem]'
                : 'pl-[5rem]'
              : Icon
                ? 'pl-11'
                : ''
          } ${fieldBorder(error, valid)}`}
        />
        {children}
        {valid && !error && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary pointer-events-none">
            <Check className="w-4 h-4" />
          </span>
        )}
      </div>
      <FieldError error={error} />
    </div>
  )
}

/* ---------- Password with show/hide ---------- */
export function PasswordField({ label = 'Password', icon: Icon, error, valid, ...props }) {
  const [show, setShow] = useState(false)
  return (
    <Field label={label} icon={Icon} error={error} valid={valid} type={show ? 'text' : 'password'} {...props}>
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-dark/30 hover:text-primary transition-colors"
        aria-label={show ? 'Hide password' : 'Show password'}
      >
        {show ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
      </button>
    </Field>
  )
}
