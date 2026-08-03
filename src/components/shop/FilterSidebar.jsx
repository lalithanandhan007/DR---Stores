import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Search, X, SlidersHorizontal } from 'lucide-react'
import { useProducts } from '../../context/ProductsContext'

function FilterGroup({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-black/5 pb-4 mb-4 last:border-0 last:mb-0 last:pb-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-between w-full text-sm font-bold text-dark mb-3"
      >
        {title}
        <ChevronDown className={`w-4 h-4 text-dark/40 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Checkbox({ label, checked, onChange, count }) {
  return (
    <label onClick={(e) => { e.preventDefault(); onChange() }} className="flex items-center gap-2.5 py-1.5 cursor-pointer group">
      <span className={`w-4.5 h-4.5 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
        checked ? 'bg-primary border-primary' : 'border-black/20 group-hover:border-primary/50'
      }`}>
        {checked && (
          <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 6l3 3 5-6" />
          </svg>
        )}
      </span>
      <span className="text-sm text-dark/70 group-hover:text-dark transition-colors flex-1">{label}</span>
      {count !== undefined && <span className="text-xs text-dark/35">{count}</span>}
    </label>
  )
}

export default function FilterSidebar({ filters, setFilters }) {
  const { products, categories: catDocs } = useProducts()
  const categories = catDocs?.length
    ? catDocs.map((c) => c.name)
    : [...new Set(products.map((p) => p.category))]
  const set = (key, val) => setFilters((f) => ({ ...f, [key]: val }))
  const toggleArr = (key, val) => {
    setFilters((f) => {
      const arr = f[key] || []
      return { ...f, [key]: arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val] }
    })
  }

  return (
    <div className="w-full">
      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark/35" />
        <input
          type="text"
          value={filters.search}
          onChange={(e) => set('search', e.target.value)}
          placeholder="Search vegetables..."
          className="w-full h-10 pl-10 pr-9 rounded-xl bg-cream border border-black/8 text-sm text-dark placeholder:text-dark/35 focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all"
        />
        {filters.search && (
          <button
            onClick={() => set('search', '')}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-black/10 flex items-center justify-center text-dark/40 hover:text-dark"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Categories */}
      <FilterGroup title="Categories">
        <div className="flex flex-col gap-0.5">
          {categories.map((cat) => (
            <Checkbox
              key={cat}
              label={cat}
              checked={filters.category === cat}
              onChange={() => set('category', filters.category === cat ? '' : cat)}
            />
          ))}
        </div>
      </FilterGroup>

      {/* Price Range */}
      <FilterGroup title="Price Range">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              value={filters.priceMin}
              onChange={(e) => set('priceMin', e.target.value)}
              placeholder="Min"
              className="w-full h-9 px-3 rounded-lg bg-cream border border-black/8 text-sm text-dark placeholder:text-dark/35 focus:outline-none focus:border-primary/40 transition-all"
            />
            <span className="text-dark/30">–</span>
            <input
              type="number"
              min="0"
              value={filters.priceMax}
              onChange={(e) => set('priceMax', e.target.value)}
              placeholder="Max"
              className="w-full h-9 px-3 rounded-lg bg-cream border border-black/8 text-sm text-dark placeholder:text-dark/35 focus:outline-none focus:border-primary/40 transition-all"
            />
          </div>
        </div>
      </FilterGroup>

      {/* Availability */}
      <FilterGroup title="Availability">
        <Checkbox label="In Stock" checked={filters.inStock} onChange={() => set('inStock', !filters.inStock)} />
      </FilterGroup>

      {/* Badges */}
      <FilterGroup title="Badges">
        {['organic', 'fresh', 'new', 'popular'].map((b) => (
          <Checkbox
            key={b}
            label={b.charAt(0).toUpperCase() + b.slice(1)}
            checked={(filters.badges || []).includes(b)}
            onChange={() => toggleArr('badges', b)}
          />
        ))}
      </FilterGroup>

      {/* Rating */}
      <FilterGroup title="Rating">
        {[4, 3, 2].map((r) => (
          <Checkbox
            key={r}
            label={`${r}+ stars`}
            checked={filters.minRating === r}
            onChange={() => set('minRating', filters.minRating === r ? 0 : r)}
          />
        ))}
      </FilterGroup>
    </div>
  )
}
