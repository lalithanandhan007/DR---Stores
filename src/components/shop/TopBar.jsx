import { Search, SlidersHorizontal, Grid3X3, List, X } from 'lucide-react'
import { sortOptions } from '../../data/productConfig'

export default function TopBar({ filters, setFilters, viewMode, setViewMode, resultCount, onOpenFilters }) {
  const set = (key, val) => setFilters((f) => ({ ...f, [key]: val }))

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-6">
      {/* Search (mobile-visible) */}
      <div className="relative flex-1 sm:hidden w-full">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark/35" />
        <input
          type="text"
          value={filters.search}
          onChange={(e) => set('search', e.target.value)}
          placeholder="Search vegetables..."
          className="w-full h-10 pl-10 pr-9 rounded-xl bg-white border border-black/8 text-sm text-dark placeholder:text-dark/35 focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all"
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

      {/* Mobile filter button */}
      <button
        onClick={onOpenFilters}
        className="lg:hidden inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-white border border-black/8 text-sm font-semibold text-dark/70 hover:border-primary/30 transition-colors"
      >
        <SlidersHorizontal className="w-4 h-4" />
        Filters
      </button>

      {/* Sort */}
      <div className="relative">
        <select
          value={filters.sort}
          onChange={(e) => set('sort', e.target.value)}
          className="h-10 pl-4 pr-10 rounded-xl bg-white border border-black/8 text-sm font-medium text-dark/70 appearance-none focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all cursor-pointer"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark/40 pointer-events-none" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </div>

      {/* Results count */}
      <span className="text-sm text-dark/45 font-medium hidden sm:block">
        {resultCount} product{resultCount !== 1 ? 's' : ''}
      </span>

      {/* Spacer */}
      <div className="flex-1" />

      {/* View toggle */}
      <div className="flex items-center border border-black/8 rounded-xl overflow-hidden bg-white">
        <button
          onClick={() => setViewMode('grid')}
          className={`w-10 h-10 flex items-center justify-center transition-colors ${
            viewMode === 'grid' ? 'bg-primary text-white' : 'text-dark/40 hover:text-dark/60'
          }`}
        >
          <Grid3X3 className="w-4.5 h-4.5" />
        </button>
        <button
          onClick={() => setViewMode('list')}
          className={`w-10 h-10 flex items-center justify-center transition-colors ${
            viewMode === 'list' ? 'bg-primary text-white' : 'text-dark/40 hover:text-dark/60'
          }`}
        >
          <List className="w-4.5 h-4.5" />
        </button>
      </div>

      {/* Mobile result count */}
      <span className="text-sm text-dark/45 font-medium sm:hidden">
        {resultCount} product{resultCount !== 1 ? 's' : ''}
      </span>
    </div>
  )
}
