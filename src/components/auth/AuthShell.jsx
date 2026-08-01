import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Leaf, Truck, Star, ShieldCheck, Clock } from 'lucide-react'

/* Premium split-layout shell used by all auth pages.
   Left: animated form card. Right: brand illustration panel (desktop only). */
export default function AuthShell({ children }) {
  return (
    <div className="relative min-h-screen bg-cream pt-28 lg:pt-32 pb-16 overflow-hidden">
      {/* Ambient background */}
      <div className="ambient-orb w-[420px] h-[420px] -top-24 -left-24 green-blob" />
      <div className="ambient-orb w-[380px] h-[380px] bottom-0 -right-24 orange-blob" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* ---------- Form panel ---------- */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md mx-auto lg:mx-0"
        >
          {children}
        </motion.div>

        {/* ---------- Illustration panel ---------- */}
        <motion.div
          initial={{ opacity: 0, x: 48 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          className="hidden lg:block relative"
        >
          <div className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-primary-dark via-primary to-secondary p-10 lg:p-14 shadow-lift min-h-[560px] flex flex-col justify-between">
            {/* decorative rings */}
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.25) 0%, transparent 50%)' }} />
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full border border-white/15 spin-slow" />
            <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full border border-white/10 spin-slow-reverse" />

            {/* Brand */}
            <div className="relative">
              <div className="inline-flex items-center gap-2.5">
                <span className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center">
                  <Leaf className="w-5.5 h-5.5 text-white" />
                </span>
                <span className="font-serif-display font-extrabold text-xl text-white tracking-tight">
                  D.R<span className="text-accent-light">.</span>STORES
                </span>
              </div>

              <h2 className="mt-8 font-serif-display text-4xl xl:text-5xl font-bold text-white leading-[1.1] tracking-tight">
                Fresh from our farms to your doorstep.
              </h2>
              <p className="mt-4 text-white/70 text-base font-light leading-relaxed max-w-md">
                Hand-picked premium vegetables, delivered in under 40 minutes. Join 10,000+ happy households.
              </p>
            </div>

            {/* Floating produce */}
            <div className="relative h-40 my-8">
              <div className="absolute left-6 top-0 w-16 h-16 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center text-3xl float-slow rotate-6">🥕</div>
              <div className="absolute left-28 top-6 w-14 h-14 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center text-2xl float-med -rotate-3">🍅</div>
              <div className="absolute left-48 top-0 w-12 h-12 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center text-xl float-fast">🥦</div>
              <div className="absolute right-16 top-4 w-16 h-16 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center text-3xl float-med rotate-3">🥑</div>
              <div className="absolute right-0 top-0 w-12 h-12 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center text-xl float-slow -rotate-6">🌽</div>
            </div>

            {/* Stats row */}
            <div className="relative grid grid-cols-3 gap-3">
              {[
                { icon: Truck, value: '40 min', label: 'Delivery' },
                { icon: Star, value: '4.8★', label: 'Rating' },
                { icon: ShieldCheck, value: '100%', label: 'Freshness' },
              ].map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.12, duration: 0.6 }}
                  className="bg-white/10 backdrop-blur rounded-2xl p-4 text-center border border-white/10"
                >
                  <s.icon className="w-5 h-5 text-accent-light mx-auto mb-1.5" />
                  <p className="text-white font-extrabold text-base leading-none">{s.value}</p>
                  <p className="text-white/60 text-[11px] mt-1">{s.label}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Floating trust card */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -bottom-8 -left-8 glass-card rounded-2xl p-4 shadow-card flex items-center gap-3"
          >
            <span className="w-11 h-11 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </span>
            <div>
              <p className="text-sm font-bold text-dark">Express Delivery</p>
              <p className="text-xs text-dark/45">Get it in 40 minutes</p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Back to home */}
      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 mt-10">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-dark/40 hover:text-primary transition-colors">
          <Leaf className="w-4 h-4" /> Back to Home
        </Link>
      </div>
    </div>
  )
}
