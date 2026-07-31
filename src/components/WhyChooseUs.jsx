import { motion } from 'framer-motion'
import { Sprout, Zap, Wallet, BadgeCheck } from 'lucide-react'
import { SectionHeader, Stagger, StaggerItem } from './ui'

const features = [
  {
    icon: Sprout,
    title: 'Farm Fresh',
    desc: 'Handpicked every morning from trusted local farms & markets — never stored for days.',
    gradient: 'from-secondary to-primary',
    soft: 'bg-secondary/10',
    iconColor: 'text-primary',
  },
  {
    icon: Zap,
    title: 'Fast Delivery',
    desc: 'Your order at your doorstep in 40 minutes or less. Crisp, cold and carefully packed.',
    gradient: 'from-accent to-orange-500',
    soft: 'bg-accent/10',
    iconColor: 'text-accent',
  },
  {
    icon: Wallet,
    title: 'Affordable Price',
    desc: 'Honest everyday prices, direct from the market. Premium freshness without the premium.',
    gradient: 'from-emerald-500 to-primary',
    soft: 'bg-primary/10',
    iconColor: 'text-primary',
  },
  {
    icon: BadgeCheck,
    title: 'Trusted Quality',
    desc: 'Three generations of the same family, the same promise — quality you can rely on.',
    gradient: 'from-primary to-primary-dark',
    soft: 'bg-primary/10',
    iconColor: 'text-primary-dark',
  },
]

export default function WhyChooseUs() {
  return (
    <section id="why-us" className="relative section-padding overflow-hidden">
      <div className="ambient-orb w-[380px] h-[380px] top-20 -right-40 green-blob" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 relative">
        <SectionHeader
          eyebrow="Why Choose Us"
          title={<>The local advantage, <span className="text-gradient">reimagined</span></>}
          subtitle="Everything you love about your neighbourhood store — crafted with the care of a premium brand."
        />

        <Stagger className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6" stagger={0.1}>
          {features.map((f) => (
            <StaggerItem key={f.title}>
              <motion.div
                whileHover={{ y: -10 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                className="group relative h-full rounded-3xl bg-white border border-black/5 p-7 shadow-soft hover:shadow-lift transition-shadow duration-500 overflow-hidden"
              >
                {/* hover wash */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${f.soft}`} />
                {/* corner glow */}
                <div className={`absolute -top-16 -right-16 w-40 h-40 rounded-full bg-gradient-to-br ${f.gradient} opacity-0 group-hover:opacity-15 transition-opacity duration-500 blur-2xl`} />

                <div className="relative">
                  <motion.div
                    whileHover={{ rotate: -8, scale: 1.08 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 14 }}
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.gradient} flex items-center justify-center shadow-soft group-hover:scale-105 transition-transform duration-500`}
                  >
                    <f.icon className="w-7 h-7 text-white" strokeWidth={2} />
                  </motion.div>

                  <h3 className="mt-6 text-lg font-bold text-dark tracking-tight">{f.title}</h3>
                  <p className="mt-2.5 text-sm text-dark/55 leading-relaxed font-light">{f.desc}</p>
                </div>

                {/* bottom accent line */}
                <span className={`absolute bottom-0 left-7 right-7 h-[3px] rounded-full bg-gradient-to-r ${f.gradient} scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500`} />
              </motion.div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
