import { useEffect, useRef } from 'react'
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion'
import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react'
import { AdminIcon } from './ui'

/* Animated count-up number */
function CountUp({ value, prefix = '', suffix = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const mv = useMotionValue(0)
  const rounded = useTransform(mv, (v) => Math.round(v))
  const text = useTransform(rounded, (v) => `${prefix}${v.toLocaleString('en-IN')}${suffix}`)

  useEffect(() => {
    if (inView) {
      const controls = animate(mv, value, { duration: 1.4, ease: [0.22, 1, 0.36, 1] })
      return () => controls.stop()
    }
  }, [inView, value, mv])

  return <motion.span ref={ref}>{text}</motion.span>
}

/* Lightweight inline-SVG sparkline */
function Sparkline({ data, color }) {
  const w = 96
  const h = 32
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const pts = data.map((d, i) => `${(i / (data.length - 1)) * w},${h - ((d - min) / range) * (h - 4) - 2}`).join(' ')
  const id = `spark-${color.replace('#', '')}-${data.length}-${data[0]}`
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-24 h-8" aria-hidden>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${h} ${pts} ${w},${h}`} fill={`url(#${id})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const ICON_TINTS = {
  wallet: 'bg-primary/10 text-primary',
  basket: 'bg-emerald-50 text-emerald-600',
  clock: 'bg-amber-50 text-amber-600',
  check: 'bg-secondary/10 text-secondary',
  users: 'bg-blue-50 text-blue-600',
  alert: 'bg-red-50 text-red-500',
  receipt: 'bg-violet-50 text-violet-600',
  target: 'bg-accent/10 text-accent',
}

export default function StatCard({ stat, index }) {
  const delta = stat.delta
  const deltaColor = stat.trend === 'up' ? 'text-emerald-600 bg-emerald-50' : stat.trend === 'down' ? 'text-red-500 bg-red-50' : 'text-accent bg-accent/10'
  const DeltaIcon = stat.trend === 'up' ? TrendingUp : stat.trend === 'down' ? TrendingDown : AlertTriangle

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="group bg-white rounded-3xl border border-black/5 shadow-soft p-5 hover:shadow-card hover:-translate-y-1 transition-all duration-300"
    >
      <div className="flex items-start justify-between">
        <span className={`w-11 h-11 rounded-2xl flex items-center justify-center ${ICON_TINTS[stat.icon] || 'bg-primary/10 text-primary'}`}>
          <AdminIcon name={stat.icon} className="w-5 h-5" />
        </span>
        <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-full ${deltaColor}`}>
          <DeltaIcon className="w-3 h-3" />
          {Math.abs(delta)}%
        </span>
      </div>

      <p className="mt-4 text-2xl sm:text-[26px] font-black text-dark tracking-tight leading-none">
        <CountUp value={stat.value} prefix={stat.prefix || ''} suffix={stat.suffix || ''} />
      </p>
      <p className="mt-1.5 text-xs text-dark/45 font-medium">{stat.label}</p>

      <div className="mt-3 -mx-1 opacity-70 group-hover:opacity-100 transition-opacity">
        <Sparkline data={stat.spark} color={stat.trend === 'down' ? '#EF4444' : stat.trend === 'warn' ? '#FF9800' : '#2E7D32'} />
      </div>
    </motion.div>
  )
}
