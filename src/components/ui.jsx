import { motion } from 'framer-motion'
import { useRef, useState, useCallback } from 'react'

/* Scroll-reveal wrapper used across sections */
export function Reveal({ children, delay = 0, y = 32, className = '', once = true }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-80px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

/* Staggered container + item */
export const Stagger = ({ children, className = '', stagger = 0.12, delay = 0 }) => (
  <motion.div
    className={className}
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, margin: '-80px' }}
    variants={{
      hidden: {},
      show: { transition: { staggerChildren: stagger, delayChildren: delay } },
    }}
  >
    {children}
  </motion.div>
)

export const StaggerItem = ({ children, className = '', y = 36 }) => (
  <motion.div
    className={className}
    variants={{
      hidden: { opacity: 0, y },
      show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
    }}
  >
    {children}
  </motion.div>
)

/* Magnetic hover button — content pulls toward cursor */
export function Magnetic({ children, strength = 0.3, className = '' }) {
  const ref = useRef(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })

  const onMove = useCallback((e) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    setPos({
      x: (e.clientX - rect.left - rect.width / 2) * strength,
      y: (e.clientY - rect.top - rect.height / 2) * strength,
    })
  }, [strength])

  const onLeave = useCallback(() => setPos({ x: 0, y: 0 }), [])

  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: 'spring', stiffness: 220, damping: 18, mass: 0.6 }}
      style={{ display: 'inline-block' }}
    >
      {children}
    </motion.div>
  )
}

/* Smooth scroll to a section id via Lenis */
export function scrollToId(id) {
  const el = document.querySelector(id)
  if (!el) return
  if (window.__lenis) {
    window.__lenis.scrollTo(el, { offset: -80, duration: 1.4 })
  } else {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}

/* Section heading eyebrow + title */
export function SectionHeader({ eyebrow, title, subtitle, center = true, className = '' }) {
  return (
    <Stagger className={`${center ? 'text-center mx-auto max-w-2xl' : ''} mb-14 md:mb-20 ${className}`}>
      <StaggerItem>
        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-primary bg-primary/8 border border-primary/15 px-4 py-2 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
          {eyebrow}
        </span>
      </StaggerItem>
      <StaggerItem>
        <h2 className="font-serif-display text-4xl md:text-5xl lg:text-[3.4rem] font-bold text-dark mt-5 leading-[1.1] tracking-tight">
          {title}
        </h2>
      </StaggerItem>
      {subtitle && (
        <StaggerItem>
          <p className="text-dark/60 text-base md:text-lg mt-5 leading-relaxed font-light">
            {subtitle}
          </p>
        </StaggerItem>
      )}
    </Stagger>
  )
}
