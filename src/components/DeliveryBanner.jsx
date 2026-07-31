import { motion } from 'framer-motion'
import { Bike, Clock3, MapPin, PackageCheck } from 'lucide-react'
import { Reveal, Stagger, StaggerItem, Magnetic, scrollToId } from './ui'

function Scooter() {
  return (
    <svg viewBox="0 0 320 180" className="w-full h-auto" fill="none">
      {/* Motion lines */}
      <g className="drift-line opacity-40">
        <path d="M8 150h36M20 162h52M14 138h28" stroke="#2E7D32" strokeWidth="3" strokeLinecap="round" />
      </g>
      <g className="drift-line opacity-30" style={{ animationDelay: '0.6s' }}>
        <path d="M8 150h36M20 162h52M14 138h28" stroke="#FF9800" strokeWidth="3" strokeLinecap="round" />
      </g>

      {/* Delivery box on back */}
      <g>
        <rect x="70" y="34" width="66" height="56" rx="10" fill="#2E7D32" />
        <rect x="70" y="34" width="66" height="56" rx="10" fill="url(#box-grad)" />
        <path d="M70 46h66" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
        <path d="M88 34v56M118 34v56" stroke="rgba(255,255,255,0.18)" strokeWidth="2" />
        <text x="103" y="72" textAnchor="middle" fill="white" fontSize="15" fontWeight="800" fontFamily="Inter, sans-serif">DR</text>
        <path d="M40 62h30M40 74h22" stroke="#2E7D32" strokeWidth="5" strokeLinecap="round" />
      </g>

      {/* Body */}
      <path d="M120 96c-6-22 6-40 26-46" stroke="#2E7D32" strokeWidth="7" strokeLinecap="round" fill="none" />
      <path d="M172 118l22-8 4 12-24 8z" fill="#FF9800" />
      <path d="M58 118h90" stroke="#2E7D32" strokeWidth="5" strokeLinecap="round" />
      <path d="M110 62c-8-6-18-8-28-6" stroke="#1B5E20" strokeWidth="6" strokeLinecap="round" fill="none" />
      <path d="M82 56c-4 0-7 2-8 6" stroke="#1B5E20" strokeWidth="6" strokeLinecap="round" fill="none" />

      {/* Rider */}
      <circle cx="150" cy="44" r="17" fill="#F4B183" />
      <path d="M150 61v20M150 81l-14 22M150 81l14 22" stroke="#2E7D32" strokeWidth="6" strokeLinecap="round" fill="none" />
      <circle cx="150" cy="44" r="17" fill="#F4B183" />
      <path d="M143 38c-2 3 0 6 4 6M154 36l4 2" stroke="#7B4A2B" strokeWidth="3" strokeLinecap="round" />
      <path d="M136 60c-6 2-8 8-8 14 0 3-1 5-4 6" stroke="#FF9800" strokeWidth="7" strokeLinecap="round" fill="none" />

      {/* Handlebar */}
      <path d="M186 118c4-6 12-6 18-2" stroke="#2E7D32" strokeWidth="5" strokeLinecap="round" fill="none" />

      {/* Wheels */}
      <g className="scooter-bounce">
        <g>
          <circle cx="84" cy="130" r="26" fill="#1B1B1B" />
          <circle cx="84" cy="130" r="18" fill="#333" />
          <g className="wheel-spin">
            <path d="M84 112v12M84 136v12M66 130h12M90 130h12M71 117l8 8M89 135l8 8M97 117l-8 8M79 135l-8 8" stroke="#666" strokeWidth="2.5" strokeLinecap="round" />
          </g>
          <circle cx="84" cy="130" r="5" fill="#666" />
        </g>
        <g>
          <circle cx="222" cy="132" r="26" fill="#1B1B1B" />
          <circle cx="222" cy="132" r="18" fill="#333" />
          <g className="wheel-spin" style={{ animationDirection: 'reverse' }}>
            <path d="M222 114v12M222 138v12M204 132h12M228 132h12M209 119l8 8M227 137l8 8M235 119l-8 8M217 137l-8 8" stroke="#666" strokeWidth="2.5" strokeLinecap="round" />
          </g>
          <circle cx="222" cy="132" r="5" fill="#666" />
        </g>
      </g>

      <defs>
        <linearGradient id="box-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4CAF50" />
          <stop offset="100%" stopColor="#1B5E20" />
        </linearGradient>
      </defs>
    </svg>
  )
}

const stats = [
  { icon: MapPin, label: 'Delivery Radius', value: '5 KM', color: 'text-primary bg-primary/10' },
  { icon: Clock3, label: 'Average Delivery', value: '40 Min', color: 'text-accent bg-accent/10' },
  { icon: PackageCheck, label: 'Orders Delivered', value: '10K+', color: 'text-secondary bg-secondary/10' },
  { icon: Bike, label: 'Own Fleet', value: '24/7', color: 'text-primary-dark bg-primary/10' },
]

export default function DeliveryBanner() {
  return (
    <section className="relative section-padding overflow-hidden">
      <div className="ambient-orb w-[460px] h-[460px] -right-52 top-0 green-blob" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 relative">
        <div className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-primary-dark via-primary to-secondary shadow-lift">
          {/* texture + glows */}
          <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.35), transparent 40%), radial-gradient(circle at 85% 85%, rgba(255,183,77,0.4), transparent 45%)' }} />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.15),transparent_60%)]" />

          <div className="relative grid lg:grid-cols-2 gap-10 items-center px-6 py-12 sm:px-12 lg:px-16 lg:py-16">
            {/* Left copy */}
            <div className="text-white">
              <Reveal>
                <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/80 bg-white/10 border border-white/20 px-4 py-2 rounded-full">
                  <Bike className="w-4 h-4" />
                  Lightning Delivery
                </span>
              </Reveal>
              <Reveal delay={0.1}>
                <h2 className="mt-5 font-serif-display text-3xl sm:text-4xl lg:text-[2.9rem] font-bold leading-[1.15] tracking-tight">
                  From our store to
                  <br />
                  <span className="text-accent-light">your door in 40 minutes.</span>
                </h2>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="mt-5 text-white/70 text-base lg:text-lg font-light max-w-md leading-relaxed">
                  We deliver fresh across a 5 KM radius — hot, cold or crisp, exactly how it should be.
                  Every order packed with care and delivered with a smile.
                </p>
              </Reveal>

              <Stagger delay={0.25} className="mt-8 grid grid-cols-2 gap-4 max-w-md" stagger={0.08}>
                {stats.map((s) => (
                  <StaggerItem key={s.label}>
                    <div className="flex items-center gap-3 bg-white/10 backdrop-blur rounded-2xl px-4 py-3.5 border border-white/15 hover:bg-white/15 transition-colors duration-300">
                      <span className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color} bg-white/15`}>
                        <s.icon className="w-5 h-5" />
                      </span>
                      <span>
                        <span className="block text-lg font-extrabold leading-none">{s.value}</span>
                        <span className="block text-[11px] text-white/60 mt-1 font-medium">{s.label}</span>
                      </span>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>

              <Reveal delay={0.35} className="mt-8">
                <Magnetic strength={0.25}>
                  <button
                    onClick={() => scrollToId('#contact')}
                    className="inline-flex items-center gap-2.5 text-base font-bold text-primary-dark bg-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <MapPin className="w-5 h-5" />
                    Check Delivery in Your Area
                  </button>
                </Magnetic>
              </Reveal>
            </div>

            {/* Right scooter */}
            <Reveal delay={0.2} y={50} className="relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full bg-accent/20 blur-3xl" />
              <div className="relative">
                <Scooter />
              </div>
              {/* floating mini badges */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-4 left-4 glass rounded-2xl px-4 py-2.5 shadow-card flex items-center gap-2"
              >
                <Clock3 className="w-4.5 h-4.5 text-primary" />
                <span className="text-sm font-bold text-dark/80">40 min</span>
              </motion.div>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
                className="absolute bottom-6 right-2 glass rounded-2xl px-4 py-2.5 shadow-card flex items-center gap-2"
              >
                <PackageCheck className="w-4.5 h-4.5 text-accent" />
                <span className="text-sm font-bold text-dark/80">Fresh &amp; sealed</span>
              </motion.div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
