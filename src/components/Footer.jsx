import { motion } from 'framer-motion'
import { Leaf, Phone, MapPin, Clock, Mail, MessageCircle, ArrowUp } from 'lucide-react'
import { scrollToId } from './ui'

function Instagram({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

function Facebook({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

const quickLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Vegetables', href: '#categories' },
  { label: 'Groceries', href: '#categories' },
  { label: 'About', href: '#why-us' },
  { label: 'Contact', href: '#contact' },
]

const categories = ['Leafy Vegetables', 'Root Vegetables', 'Daily Grocery', 'Cooking Essentials']

export default function Footer() {
  return (
    <footer id="contact" className="relative bg-dark text-white overflow-hidden">
      {/* ambient */}
      <div className="ambient-orb w-[420px] h-[420px] -top-40 -left-40" style={{ background: 'rgba(46,125,50,0.35)' }} />
      <div className="ambient-orb w-[380px] h-[380px] bottom-0 -right-32" style={{ background: 'rgba(255,152,0,0.16)' }} />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 pt-16 lg:pt-20 pb-8">
        <div className="grid gap-12 lg:gap-8 lg:grid-cols-12">
          {/* Brand */}
          <div className="lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3"
            >
              <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center shadow-cta">
                <Leaf className="w-6 h-6 text-white" strokeWidth={2.2} />
              </span>
              <span className="leading-none">
                <span className="block font-serif-display font-extrabold text-xl tracking-tight">
                  D.R<span className="text-secondary">.</span>STORES
                </span>
                <span className="block text-[10px] font-semibold uppercase tracking-[0.28em] text-white/40 mt-1.5">
                  Fresh • Trusted • Local
                </span>
              </span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-6 text-sm text-white/55 leading-relaxed font-light max-w-sm"
            >
              A family-run fresh vegetable &amp; grocery store serving our neighbourhood for over
              two decades. Farm fresh, honestly priced, delivered with love.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.18 }}
              className="mt-7 flex items-center gap-3"
            >
              {[
                { icon: Instagram, label: 'Instagram' },
                { icon: Facebook, label: 'Facebook' },
                { icon: MessageCircle, label: 'WhatsApp' },
              ].map((s) => (
                <a
                  key={s.label}
                  href="#contact"
                  onClick={(e) => e.preventDefault()}
                  aria-label={s.label}
                  className="w-11 h-11 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-gradient-to-br hover:from-secondary hover:to-primary hover:border-transparent transition-all duration-300 hover:-translate-y-1"
                >
                  <s.icon className="w-5 h-5" />
                </a>
              ))}
            </motion.div>
          </div>

          {/* Quick links */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">Quick Links</h4>
            <ul className="mt-5 space-y-3">
              {quickLinks.map((l) => (
                <li key={l.label}>
                  <button
                    onClick={() => scrollToId(l.href)}
                    className="group text-sm text-white/60 hover:text-secondary transition-colors duration-300 flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary/50 group-hover:bg-secondary transition-colors" />
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">What We Deliver</h4>
            <ul className="mt-5 space-y-3">
              {categories.map((c) => (
                <li key={c}>
                  <button
                    onClick={() => scrollToId('#categories')}
                    className="group text-sm text-white/60 hover:text-secondary transition-colors duration-300 flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary/50 group-hover:bg-secondary transition-colors" />
                    {c}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">Reach Us</h4>
            <ul className="mt-5 space-y-4">
              <li className="flex items-start gap-3 text-sm text-white/60">
                <MapPin className="w-4.5 h-4.5 text-secondary shrink-0 mt-0.5" />
                <span className="font-light">Main Market Road, Your City — 600 001</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/60">
                <Phone className="w-4.5 h-4.5 text-secondary shrink-0" />
                <a href="tel:+919000000000" className="font-light hover:text-secondary transition-colors">+91 90000 00000</a>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/60">
                <Mail className="w-4.5 h-4.5 text-secondary shrink-0" />
                <a href="mailto:hello@drstores.in" className="font-light hover:text-secondary transition-colors">hello@drstores.in</a>
              </li>
              <li className="flex items-start gap-3 text-sm text-white/60">
                <Clock className="w-4.5 h-4.5 text-secondary shrink-0 mt-0.5" />
                <span className="font-light">Open all days<br />6:00 AM — 10:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40 font-light">
            © {new Date().getFullYear()} D.R.STORES. All rights reserved. Family grown, locally loved.
          </p>

          <div className="flex items-center gap-5">
            <button
              onClick={() => scrollToId('#home')}
              className="inline-flex items-center gap-2 text-xs text-white/50 hover:text-secondary transition-colors"
            >
              Back to top
              <span className="w-8 h-8 rounded-full bg-white/8 border border-white/10 flex items-center justify-center">
                <ArrowUp className="w-3.5 h-3.5" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
