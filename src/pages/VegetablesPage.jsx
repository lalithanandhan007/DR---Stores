import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, X, ArrowRight, Leaf, SlidersHorizontal, Grid3X3, List, Search, Sparkles } from 'lucide-react'
import products from '../data/products'
import ProductCard from '../components/shop/ProductCard'
import FilterSidebar from '../components/shop/FilterSidebar'
import Footer from '../components/Footer'

const defaultFilters = {
  search: '', category: '', priceMin: '', priceMax: '',
  inStock: false, badges: [], minRating: 0, sort: 'newest',
}

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-low', label: 'Price: Low → High' },
  { value: 'price-high', label: 'Price: High → Low' },
  { value: 'popularity', label: 'Most Popular' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'name-asc', label: 'A → Z' },
]

/* ---------- Floating decorative leaf ---------- */
function FloatingLeaf({ style, delay = 0 }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={style}
      animate={{ y: [0, -15, 0], rotate: [0, 10, -5, 0] }}
      transition={{ duration: 6 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
    >
      <Leaf className="w-5 h-5 text-primary/15" />
    </motion.div>
  )
}

export default function VegetablesPage() {
  const [filters, setFilters] = useState(defaultFilters)
  const [viewMode, setViewMode] = useState('grid')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const filtered = useMemo(() => {
    let list = [...products]
    if (filters.search) {
      const q = filters.search.toLowerCase()
      list = list.filter((p) =>
        p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.tags.some((t) => t.includes(q))
      )
    }
    if (filters.category && filters.category !== 'All Vegetables') {
      list = list.filter((p) => p.category === filters.category)
    }
    if (filters.priceMin) list = list.filter((p) => p.price >= Number(filters.priceMin))
    if (filters.priceMax) list = list.filter((p) => p.price <= Number(filters.priceMax))
    if (filters.inStock) list = list.filter((p) => p.stock > 0)
    if (filters.badges.length > 0) list = list.filter((p) => filters.badges.some((b) => p.badges.includes(b)))
    if (filters.minRating) list = list.filter((p) => p.rating >= filters.minRating)
    switch (filters.sort) {
      case 'price-low': list.sort((a, b) => a.price - b.price); break
      case 'price-high': list.sort((a, b) => b.price - a.price); break
      case 'popularity': list.sort((a, b) => b.reviews - a.reviews); break
      case 'rating': list.sort((a, b) => b.rating - a.rating); break
      case 'name-asc': list.sort((a, b) => a.name.localeCompare(b.name)); break
      default: break
    }
    return list
  }, [filters])

  const activeFilterCount = [
    filters.category, filters.priceMin, filters.priceMax,
    filters.inStock, filters.badges.length > 0, filters.minRating > 0,
  ].filter(Boolean).length

  return (
    <div className="relative min-h-screen pt-28">
      {/* Premium background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-[#f4f8f2] via-cream to-white" />
        <div className="ambient-orb w-[600px] h-[600px] -top-40 -right-60 green-blob opacity-40" />
        <div className="ambient-orb w-[500px] h-[500px] top-1/3 -left-60 orange-blob opacity-30" />
        <div className="ambient-orb w-[400px] h-[400px] bottom-20 right-1/4 green-blob opacity-20" />
        {/* Floating leaves */}
        <FloatingLeaf style={{ top: '15%', left: '5%' }} delay={0} />
        <FloatingLeaf style={{ top: '40%', right: '8%' }} delay={1.5} />
        <FloatingLeaf style={{ top: '65%', left: '12%' }} delay={3} />
        <FloatingLeaf style={{ top: '80%', right: '15%' }} delay={4.5} />
        <FloatingLeaf style={{ top: '25%', left: '50%' }} delay={2} />
        <FloatingLeaf style={{ bottom: '10%', left: '35%' }} delay={5} />
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm text-dark/40 mb-6"
        >
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-dark/65 font-medium">Vegetables</span>
        </motion.nav>

        {/* Page header */}
        <div className="mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-primary bg-primary/8 border border-primary/12 px-4 py-2 rounded-full mb-4"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Farm Fresh Collection
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif-display text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-dark tracking-tight leading-[1.1]"
          >
            Fresh <span className="text-gradient">Vegetables</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 text-dark/45 text-[15px] font-light max-w-lg leading-relaxed"
          >
            Handpicked daily from trusted local farms. Each vegetable is selected for peak freshness, natural flavour, and premium quality.
          </motion.p>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-28">
              <div className="glass-card rounded-3xl p-6 border border-black/5 shadow-soft">
                <FilterSidebar filters={filters} setFilters={setFilters} />
                {activeFilterCount > 0 && (
                  <button
                    onClick={() => setFilters(defaultFilters)}
                    className="mt-5 w-full h-10 rounded-xl bg-primary/8 text-primary text-sm font-semibold hover:bg-primary/15 transition-colors"
                  >
                    Clear All ({activeFilterCount})
                  </button>
                )}
              </div>
            </div>
          </aside>

          {/* Mobile filter drawer */}
          <AnimatePresence>
            {mobileFiltersOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-dark/30 backdrop-blur-sm z-50 lg:hidden"
                  onClick={() => setMobileFiltersOpen(false)}
                />
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className="fixed left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white z-[55] shadow-2xl overflow-y-auto p-6 lg:hidden"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-dark">Filters</h3>
                    <button onClick={() => setMobileFiltersOpen(false)} className="w-9 h-9 rounded-full bg-black/5 flex items-center justify-center">
                      <X className="w-5 h-5 text-dark/50" />
                    </button>
                  </div>
                  <FilterSidebar filters={filters} setFilters={setFilters} />
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="mt-4 w-full h-12 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white font-bold text-sm"
                  >
                    Show {filtered.length} Results
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Top bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
              {/* Mobile search */}
              <div className="relative flex-1 sm:hidden w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-dark/30" />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
                  placeholder="Search vegetables..."
                  className="w-full h-12 pl-11 pr-10 rounded-2xl bg-white/80 backdrop-blur border border-black/8 text-sm text-dark placeholder:text-dark/30 focus:outline-none focus:border-primary/30 focus:ring-4 focus:ring-primary/8 transition-all shadow-soft"
                />
                {filters.search && (
                  <button onClick={() => setFilters((f) => ({ ...f, search: '' }))} className="absolute right-3.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/8 flex items-center justify-center text-dark/40">
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Mobile filter */}
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden inline-flex items-center gap-2 h-11 px-5 rounded-2xl bg-white/80 backdrop-blur border border-black/8 text-sm font-semibold text-dark/70 hover:border-primary/30 transition-colors shadow-soft"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">{activeFilterCount}</span>
                )}
              </button>

              {/* Sort */}
              <div className="relative">
                <select
                  value={filters.sort}
                  onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value }))}
                  className="h-11 pl-4 pr-11 rounded-2xl bg-white/80 backdrop-blur border border-black/8 text-sm font-medium text-dark/65 appearance-none focus:outline-none focus:border-primary/30 focus:ring-4 focus:ring-primary/8 transition-all cursor-pointer shadow-soft"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <svg className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark/35 pointer-events-none" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
              </div>

              <span className="text-sm text-dark/40 font-medium hidden sm:block ml-1">{filtered.length} products</span>

              <div className="flex-1" />

              {/* View toggle */}
              <div className="flex items-center border border-black/8 rounded-2xl overflow-hidden bg-white/80 backdrop-blur shadow-soft">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`w-11 h-11 flex items-center justify-center transition-all duration-300 ${viewMode === 'grid' ? 'bg-dark text-white' : 'text-dark/35 hover:text-dark/55'}`}
                >
                  <Grid3X3 className="w-4.5 h-4.5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`w-11 h-11 flex items-center justify-center transition-all duration-300 ${viewMode === 'list' ? 'bg-dark text-white' : 'text-dark/35 hover:text-dark/55'}`}
                >
                  <List className="w-4.5 h-4.5" />
                </button>
              </div>

              <span className="text-sm text-dark/40 font-medium sm:hidden">{filtered.length} products</span>
            </div>

            {/* Active filter chips */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {filters.category && <Chip label={filters.category} onRemove={() => setFilters((f) => ({ ...f, category: '' }))} />}
                {filters.priceMin && <Chip label={`Min ₹${filters.priceMin}`} onRemove={() => setFilters((f) => ({ ...f, priceMin: '' }))} />}
                {filters.priceMax && <Chip label={`Max ₹${filters.priceMax}`} onRemove={() => setFilters((f) => ({ ...f, priceMax: '' }))} />}
                {filters.inStock && <Chip label="In Stock" onRemove={() => setFilters((f) => ({ ...f, inStock: false }))} />}
                {filters.badges.map((b) => (
                  <Chip key={b} label={b.charAt(0).toUpperCase() + b.slice(1)} onRemove={() => setFilters((f) => ({ ...f, badges: f.badges.filter((x) => x !== b) }))} />
                ))}
                {filters.minRating > 0 && <Chip label={`${filters.minRating}+ stars`} onRemove={() => setFilters((f) => ({ ...f, minRating: 0 }))} />}
                <button onClick={() => setFilters(defaultFilters)} className="text-xs font-semibold text-primary hover:text-primary-dark transition-colors">Clear all</button>
              </div>
            )}

            {/* Product grid — 2 cols large, 3 XL, 1 mobile */}
            {filtered.length === 0 ? (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center py-24 text-center">
                <span className="text-7xl mb-5 block">🥬</span>
                <h3 className="text-2xl font-bold text-dark/65">No vegetables found</h3>
                <p className="text-sm text-dark/40 mt-2 max-w-sm">Try adjusting your filters or search for something else.</p>
                <button onClick={() => setFilters(defaultFilters)} className="mt-6 inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-primary to-primary-dark text-white text-sm font-bold hover:shadow-cta transition-all">
                  Clear Filters <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            ) : (
              <div className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-7'
                  : 'flex flex-col gap-5'
              }>
                {filtered.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

function Chip({ label, onRemove }) {
  return (
    <motion.span
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="inline-flex items-center gap-1.5 text-[11px] font-bold text-primary bg-primary/8 border border-primary/15 px-3 py-1.5 rounded-full"
    >
      {label}
      <button onClick={onRemove} className="w-4 h-4 rounded-full bg-primary/15 flex items-center justify-center hover:bg-primary/25 transition-colors">
        <X className="w-2.5 h-2.5" />
      </button>
    </motion.span>
  )
}
