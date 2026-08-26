import { motion } from 'framer-motion'
import { ArrowRight, Truck, Sparkles, Star, Clock3, MapPin } from 'lucide-react'
import { Magnetic, scrollToId } from './ui'
import { useNavigate } from 'react-router-dom'
import { Tomato, Carrot, Capsicum, Broccoli, Onion, Leaf, LeafBig, SpinachLeaf } from './vegetables'

const ease = [0.22, 1, 0.36, 1]

function FloatingVeg({ className, delay = 0, animClass = 'float-med', children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.7 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1, delay, ease }}
      className={`absolute ${className}`}
    >
      <div className={animClass} style={{ animationDelay: `${delay}s` }}>
        {children}
      </div>
    </motion.div>
  )
}

function Particle({ className, delay = 0 }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: [0, 0.9, 0], scale: [0.4, 1, 0.6], y: [0, -60, -120] }}
      transition={{ duration: 5 + delay, delay, repeat: Infinity, ease: 'easeOut' }}
      className={`absolute ${className}`}
    >
      <Leaf className="w-full h-full" />
    </motion.span>
  )
}

export default function Hero() {
  const navigate = useNavigate()
  return (
    <section id="home" className="relative min-h-screen overflow-hidden flex items-center pt-28 pb-16">
      {/* Ambient background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-[#F2F8F0] via-cream to-cream" />
        <div className="ambient-orb w-[520px] h-[520px] -top-40 -right-40 green-blob" />
        <div className="ambient-orb w-[420px] h-[420px] top-1/2 -left-48 orange-blob" />
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-cream to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 grid lg:grid-cols-2 gap-14 lg:gap-8 items-center w-full">
        {/* ---------- Left: Copy ---------- */}
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease }}
            className="inline-flex items-center gap-2 bg-white/80 backdrop-blur border border-primary/15 rounded-full pl-2 pr-4 py-1.5 shadow-soft"
          >
            <span className="bg-gradient-to-r from-secondary to-primary text-white text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full">
              Locally Sourced
            </span>
            <span className="text-xs font-medium text-dark/60">Trusted family store since 1998</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease }}
            className="mt-6 font-serif-display text-[2.7rem] leading-[1.05] sm:text-6xl lg:text-[4.1rem] xl:text-[4.6rem] font-extrabold tracking-tight text-dark"
          >
            Farm Fresh
            <br />
            Vegetables <span className="text-gradient">&</span>
            <br />
            <span className="text-gradient">Daily Grocery</span> Essentials
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.48, ease }}
            className="mt-6 text-base sm:text-lg text-dark/60 leading-relaxed font-light max-w-lg"
          >
            Fresh vegetables sourced daily from trusted local markets and delivered with care.
            Straight from the farm to your kitchen — always crisp, always honest.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <Magnetic strength={0.25}>
              <button
                onClick={() => navigate('/vegetables')}
                className="group inline-flex items-center gap-2.5 text-base font-bold text-white bg-gradient-to-r from-primary to-primary-dark px-8 py-4 rounded-full shadow-cta hover:shadow-lift hover:-translate-y-0.5 transition-all duration-300"
              >
                Shop Vegetables
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </Magnetic>
            <Magnetic strength={0.2}>
              <button
                onClick={() => scrollToId('#categories')}
                className="inline-flex items-center gap-2.5 text-base font-semibold text-dark/80 hover:text-primary bg-white/70 backdrop-blur border border-black/8 px-7 py-4 rounded-full hover:border-primary/30 transition-all duration-300 hover:-translate-y-0.5"
              >
                <Sparkles className="w-5 h-5 text-accent" />
                Browse Categories
              </button>
            </Magnetic>
          </motion.div>

          {/* Trust row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.85 }}
            className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-4"
          >
            <div className="flex items-center gap-2.5">
              <div className="flex -space-x-2.5">
                {['#4CAF50', '#FF9800', '#2E7D32', '#FFB74D'].map((c, i) => (
                  <span key={i} className="w-8 h-8 rounded-full border-2 border-white shadow-soft" style={{ background: `linear-gradient(135deg, ${c}, ${c}cc)` }} />
                ))}
              </div>
              <span className="text-xs text-dark/55 font-medium max-w-[8rem] leading-tight">
                4.9 rated by 2,000+ happy families
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-accent fill-accent" />
              ))}
            </div>
          </motion.div>
        </div>

        {/* ---------- Right: Floating composition ---------- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.4, ease }}
          className="relative h-[440px] sm:h-[520px] lg:h-[600px] w-full"
        >
          {/* Sun glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] sm:w-[520px] sm:h-[520px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(255,200,120,0.5) 0%, rgba(255,183,77,0.18) 45%, transparent 70%)' }} />

          {/* Slow rotating ring */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] sm:w-[480px] sm:h-[480px] rounded-full border border-primary/10 spin-slow" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[440px] h-[440px] sm:w-[560px] sm:h-[560px] rounded-full border border-dashed border-primary/15 spin-slow-reverse" />

          {/* Veggies */}
          <FloatingVeg className="top-6 left-1/2 -translate-x-1/2 w-28 sm:w-32" delay={0.7} animClass="float-slow">
            <Broccoli className="w-full drop-shadow-[0_18px_24px_rgba(46,125,50,0.35)]" />
          </FloatingVeg>

          <FloatingVeg className="top-1/2 left-2 -translate-y-1/2 w-24 sm:w-28" delay={0.9} animClass="float-fast">
            <Tomato className="w-full drop-shadow-[0_18px_24px_rgba(244,67,54,0.3)]" />
          </FloatingVeg>

          <FloatingVeg className="top-1/2 right-0 -translate-y-1/2 w-20 sm:w-24" delay={0.8} animClass="float-med">
            <Capsicum className="w-full drop-shadow-[0_18px_24px_rgba(46,125,50,0.35)]" />
          </FloatingVeg>

          <FloatingVeg className="bottom-2 left-1/3 w-20 sm:w-24" delay={1.0} animClass="float-slow">
            <Carrot className="w-full drop-shadow-[0_18px_24px_rgba(251,140,0,0.3)]" />
          </FloatingVeg>

          <FloatingVeg className="bottom-6 right-[12%] w-24 sm:w-28" delay={1.1} animClass="float-med">
            <Onion className="w-full drop-shadow-[0_18px_24px_rgba(171,124,54,0.3)]" />
          </FloatingVeg>

          {/* Floating leaves */}
          <div className="absolute inset-0">
            <div className="absolute top-[18%] left-[16%] w-6 h-6 text-secondary/70"><Leaf className="w-full h-full" /></div>
            <div className="absolute top-[28%] right-[14%] w-5 h-5 text-primary/50"><SpinachLeaf className="w-full h-full" /></div>
            <div className="absolute bottom-[24%] left-[6%] w-7 h-7 text-primary/60"><LeafBig className="w-full h-full" /></div>
            <div className="absolute bottom-[8%] right-[34%] w-5 h-5 text-accent/60"><Leaf className="w-full h-full" /></div>
            <div className="absolute top-[8%] right-[36%] w-4 h-4 text-secondary/60"><SpinachLeaf className="w-full h-full" /></div>
          </div>

          {/* Rising leaf particles */}
          <Particle className="bottom-[6%] left-[28%] w-4 h-4 text-primary/45" delay={0} />
          <Particle className="bottom-[2%] left-[48%] w-3.5 h-3.5 text-secondary/45" delay={1.4} />
          <Particle className="bottom-[8%] right-[24%] w-4 h-4 text-accent/40" delay={2.8} />
          <Particle className="bottom-[4%] right-[42%] w-3 h-3 text-primary/40" delay={4} />

          {/* Floating glass chips */}
          <FloatingVeg className="top-[12%] left-[8%] w-auto" delay={1.2} animClass="float-fast">
            <div className="glass-card rounded-2xl px-3.5 py-2.5 flex items-center gap-2 shadow-card">
              <Truck className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold text-dark/75 whitespace-nowrap">40 min delivery</span>
            </div>
          </FloatingVeg>

          <FloatingVeg className="bottom-[16%] right-[4%] w-auto" delay={1.3} animClass="float-slow">
            <div className="glass-card rounded-2xl px-3.5 py-2.5 flex items-center gap-2 shadow-card">
              <Clock3 className="w-4 h-4 text-accent" />
              <span className="text-xs font-bold text-dark/75 whitespace-nowrap">5 KM radius</span>
            </div>
          </FloatingVeg>

          <FloatingVeg className="top-[10%] right-[30%] w-auto" delay={1.4} animClass="float-med">
            <div className="glass-card rounded-2xl px-3.5 py-2.5 flex items-center gap-2 shadow-card">
              <MapPin className="w-4 h-4 text-secondary" />
              <span className="text-xs font-bold text-dark/75 whitespace-nowrap">Local market sourced</span>
            </div>
          </FloatingVeg>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute bottom-7 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-dark/40"
      >
        <span className="text-[10px] font-semibold uppercase tracking-[0.3em]">Scroll</span>
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="w-5 h-9 rounded-full border-2 border-dark/25 flex justify-center pt-1.5"
        >
          <span className="w-1 h-2 rounded-full bg-primary" />
        </motion.span>
      </motion.div>
    </section>
  )
}
