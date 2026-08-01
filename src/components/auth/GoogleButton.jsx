import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

/* Google "G" mark (lucide-react no longer ships brand icons) */
export function GoogleG({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 48 48" className={className}>
      <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3l5.7-5.7C34.3 6.1 29.4 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.6-.4-3.9z" />
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3l5.7-5.7C34.3 6.1 29.4 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C36.9 39.2 44 34 44 24c0-1.3-.1-2.6-.4-3.9z" />
    </svg>
  )
}

export default function GoogleButton({ onLogin, label = 'Continue with Google' }) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.97 }}
      onClick={onLogin}
      className="w-full h-12 rounded-2xl bg-white border border-black/8 text-sm font-bold text-dark/80 flex items-center justify-center gap-3 hover:border-black/15 hover:shadow-soft transition-all duration-300"
    >
      <GoogleG />
      {label}
    </motion.button>
  )
}

/* Generic loading spinner button — reused across auth screens */
export function LoadingButton({ loading, children, loadingText = 'Please wait…', className = '', ...props }) {
  return (
    <motion.button
      whileTap={loading ? undefined : { scale: 0.97 }}
      disabled={loading}
      {...props}
      className={`relative w-full h-13 rounded-2xl bg-gradient-to-r from-primary to-primary-dark text-white text-sm font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden ${className}`}
    >
      <AnimatePresenceInline loading={loading} loadingText={loadingText}>{children}</AnimatePresenceInline>
    </motion.button>
  )
}

function AnimatePresenceInline({ loading, loadingText, children }) {
  return (
    <span className="relative flex items-center justify-center gap-2">
      {loading ? (
        <motion.span
          key="loading"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2"
        >
          <Loader2 className="w-4.5 h-4.5 animate-spin" />
          {loadingText}
        </motion.span>
      ) : (
        <motion.span key="idle" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-2">
          {children}
        </motion.span>
      )}
    </span>
  )
}
