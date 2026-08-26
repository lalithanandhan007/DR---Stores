import { motion } from 'framer-motion'
import { ArrowUpRight, Leaf, Salad, ShoppingBasket, CookingPot } from 'lucide-react'
import { SectionHeader, Stagger, StaggerItem, Magnetic } from './ui'
import { useNavigate } from 'react-router-dom'
import { SpinachLeaf, Carrot, Tomato, Onion } from './vegetables'

const categories = [
  {
      title: 'Leafy Vegetables',
      category: 'Leafy & Flowering',
    count: '24+ varieties',
    desc: 'Spinach, coriander, methi & more — plucked at sunrise, in your kitchen by sunset.',
    icon: Leaf,
    art: SpinachLeaf,
    gradient: 'from-secondary/25 to-primary/10',
    accent: 'from-secondary to-primary',
    artClass: 'text-primary',
  },
  {
    title: 'Root Vegetables',
    category: 'Root Vegetables',
    count: '18+ varieties',
    desc: 'Carrots, beets, potatoes & yams — earth-fresh and grown for real flavour.',
    icon: Salad,
    art: Carrot,
    gradient: 'from-accent/20 to-accent/5',
    accent: 'from-accent to-orange-500',
    artClass: 'text-orange-500',
  },
  {
    title: 'Daily Grocery',
    category: 'Daily Grocery',
    count: '200+ items',
    desc: 'Dals, rice, oils, spices and pantry staples your kitchen runs on, every single day.',
    icon: ShoppingBasket,
    art: Tomato,
    gradient: 'from-primary/15 to-primary/5',
    accent: 'from-primary to-primary-dark',
    artClass: 'text-primary',
  },
  {
    title: 'Cooking Essentials',
    category: 'Cooking Essentials',
    count: '50+ items',
    desc: 'Fresh eggs, curd, paneer, dairy & daily essentials — the little things that matter.',
    icon: CookingPot,
    art: Onion,
    gradient: 'from-amber-200/30 to-amber-100/10',
    accent: 'from-amber-500 to-orange-500',
    artClass: 'text-amber-600',
  },
]

export default function Categories() {
  const navigate = useNavigate()
  return (
    <section id="categories" className="relative section-padding overflow-hidden bg-white">
      <div className="ambient-orb w-[420px] h-[420px] -left-48 top-1/3 orange-blob" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 relative">
        <SectionHeader
          eyebrow="Our Categories"
          title={<>Fresh picks, <span className="text-gradient">every aisle</span></>}
          subtitle="From leafy greens to pantry essentials — everything fresh, everything local, everything you need."
        />

        <Stagger className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6" stagger={0.1}>
          {categories.map((c) => (
            <StaggerItem key={c.title} y={40}>
              <motion.button
                whileHover={{ y: -10 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                onClick={() => navigate(`/vegetables?category=${encodeURIComponent(c.category)}`)}
                className="group relative w-full text-left rounded-3xl border border-black/5 overflow-hidden bg-cream p-6 shadow-soft hover:shadow-lift transition-shadow duration-500"
              >
                {/* art backdrop */}
                <div className={`absolute inset-0 bg-gradient-to-br ${c.gradient}`} />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_15%,rgba(255,255,255,0.6),transparent_45%)]" />

                <div className="relative flex flex-col min-h-[300px]">
                  <div className="flex items-start justify-between">
                    <div className={`w-13 h-13 rounded-2xl bg-white/80 backdrop-blur flex items-center justify-center shadow-soft ${c.artClass}`}>
                      <c.icon className="w-6.5 h-6.5" strokeWidth={2} />
                    </div>
                    <Magnetic strength={0.35}>
                      <span className="w-10 h-10 rounded-full bg-white/80 backdrop-blur flex items-center justify-center text-dark/60 group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-primary-dark group-hover:text-white transition-all duration-500 shadow-soft">
                        <ArrowUpRight className="w-4.5 h-4.5 transition-transform duration-300 group-hover:rotate-45" />
                      </span>
                    </Magnetic>
                  </div>

                  {/* veggie art */}
                  <div className="flex-1 flex items-center justify-center py-8">
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                      className="w-28 h-28 group-hover:scale-110 transition-transform duration-500"
                    >
                      <c.art className="w-full h-full" />
                    </motion.div>
                  </div>

                  <div>
                    <span className={`inline-block text-[10px] font-bold uppercase tracking-widest text-white bg-gradient-to-r ${c.accent} px-2.5 py-1 rounded-full`}>
                      {c.count}
                    </span>
                    <h3 className="mt-3 text-lg font-bold text-dark tracking-tight group-hover:text-primary transition-colors duration-300">
                      {c.title}
                    </h3>
                    <p className="mt-2 text-[13px] text-dark/50 leading-relaxed font-light">{c.desc}</p>
                  </div>
                </div>
              </motion.button>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
