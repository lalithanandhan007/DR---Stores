import { productApi } from '../../api'
import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Plus, Filter, ArrowUpDown, Download, Upload, Trash2, Eye, Pencil,
  Copy, Archive, EyeOff, ChevronLeft, ChevronRight, X, ChevronDown,
  MoreHorizontal, AlertTriangle, ShoppingCart,
} from 'lucide-react'
import { productStatuses } from '../../data/productsData'
import { useProducts } from '../../context/ProductsContext'

const PAGE_SIZE = 10

/* ================= STATUS BADGE ================= */
function StatusBadge({ status }) {
  const meta = { published: 'bg-emerald-50 text-emerald-600 border-emerald-200', draft: 'bg-amber-50 text-amber-600 border-amber-200', archived: 'bg-gray-100 text-gray-500 border-gray-200', hidden: 'bg-red-50 text-red-500 border-red-200' }
  const labels = { published: 'Published', draft: 'Draft', archived: 'Archived', hidden: 'Hidden' }
  return <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full border ${meta[status] || meta.draft}`}>{labels[status] || status}</span>
}

/* ================= ROW ACTION DROPDOWN ================= */
function RowActions({ product, onAction }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    const fn = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  const actions = [
    { id: 'view', label: 'View', icon: Eye, color: 'text-blue-600' },
    { id: 'edit', label: 'Edit', icon: Pencil, color: 'text-primary' },
    { id: 'duplicate', label: 'Duplicate', icon: Copy, color: 'text-amber-600' },
    { id: 'hide', label: product.status === 'hidden' ? 'Unhide' : 'Hide', icon: EyeOff, color: 'text-orange-500' },
    { id: 'archive', label: 'Archive', icon: Archive, color: 'text-gray-500' },
    { id: 'delete', label: 'Delete', icon: Trash2, color: 'text-red-500' },
  ]

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen((o) => !o)} className="w-8 h-8 rounded-xl flex items-center justify-center text-dark/30 hover:text-primary hover:bg-primary/8 transition-colors">
        <MoreHorizontal className="w-4 h-4" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 6, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 4, scale: 0.96 }} transition={{ duration: 0.16 }} className="absolute right-0 top-full mt-1 w-44 glass-card rounded-2xl p-1.5 shadow-lift z-50">
            {actions.map((a) => (
              <button key={a.id} onClick={() => { onAction(a.id, product); setOpen(false) }} className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-dark/70 hover:bg-primary/8 transition-colors ${a.id === 'delete' ? 'text-red-500 hover:bg-red-50 hover:text-red-600' : ''}`}>
                <a.icon className={`w-4 h-4 ${a.color}`} /> {a.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ================= DELETE MODAL ================= */
function DeleteModal({ product, onClose, onConfirm }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-dark/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 26 }} className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-7 text-center">
        <span className="w-14 h-14 mx-auto rounded-full bg-red-50 flex items-center justify-center"><AlertTriangle className="w-7 h-7 text-red-500" /></span>
        <h3 className="mt-4 font-serif-display text-xl font-bold text-dark">Delete Product?</h3>
        <p className="mt-2 text-sm text-dark/50 font-light">“{product?.name}” will be permanently removed. This cannot be undone.</p>
        <div className="grid grid-cols-2 gap-3 mt-6">
          <button onClick={onClose} className="h-12 rounded-2xl border border-black/10 text-sm font-bold text-dark/60 hover:border-black/25 transition-all">Cancel</button>
          <button onClick={() => { onConfirm(); onClose() }} className="h-12 rounded-2xl bg-red-500 text-white text-sm font-bold shadow-lg shadow-red-500/20 hover:bg-red-600 transition-all">Delete</button>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ================= VIEW MODAL ================= */
function ViewModal({ product, onClose, onEdit }) {
  const { categories } = useProducts()
  if (!product) return null
  const cat = categories.find((c) => c._id === product.category)
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-dark/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 26 }} className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[85vh] overflow-y-auto">
        {/* Hero */}
        <div className="relative h-48 flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${product.gradient[0]}, ${product.gradient[1]})` }}>
          <span className="text-[5rem] drop-shadow-xl">{product.emoji}</span>
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 backdrop-blur text-white flex items-center justify-center hover:bg-white/30 transition-colors"><X className="w-4 h-4" /></button>
          <span className="absolute top-4 left-4"><StatusBadge status={product.status} /></span>
        </div>
        <div className="p-6">
          <h2 className="font-serif-display text-2xl font-bold text-dark">{product.name}</h2>
          <p className="text-sm text-dark/50 mt-1">{cat?.name || product.category} · {product.weightOptions?.join(', ')}</p>
          <p className="text-sm text-dark/60 mt-3 leading-relaxed">{product.description}</p>
          <div className="grid grid-cols-3 gap-3 mt-5 text-center">
            <div className="rounded-2xl bg-cream p-3"><p className="text-lg font-black text-primary">₹{product.sellingPrice}</p><p className="text-[10px] text-dark/40">Price</p></div>
            <div className="rounded-2xl bg-cream p-3"><p className="text-lg font-black text-dark">{product.stock}</p><p className="text-[10px] text-dark/40">Stock</p></div>
            <div className="rounded-2xl bg-cream p-3"><p className="text-lg font-black text-dark">{product.rating}★</p><p className="text-[10px] text-dark/40">Rating</p></div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {product.organic && <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">Organic</span>}
            {product.freshToday && <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-200">Fresh Today</span>}
            {product.bestSeller && <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-200">Best Seller</span>}
            {product.featured && <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-violet-50 text-violet-600 border border-violet-200">Featured</span>}
          </div>
          <button onClick={() => { onClose(); onEdit(product._id) }} className="mt-5 w-full h-11 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white text-sm font-bold shadow-md shadow-primary/15 hover:shadow-lg transition-all">Edit Product</button>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ================= IMPORT / EXPORT MODAL ================= */
function ImportExportModal({ type, onClose }) {
  const isExport = type === 'export'
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-dark/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 26 }} className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-7">
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-dark/30 hover:bg-black/5"><X className="w-4 h-4" /></button>
        <div className="text-center mb-6">
          <span className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center ${isExport ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-accent'}`}>
            {isExport ? <Download className="w-7 h-7" /> : <Upload className="w-7 h-7" />}
          </span>
          <h3 className="mt-3 font-serif-display text-xl font-bold text-dark">{isExport ? 'Export Products' : 'Import Products'}</h3>
          <p className="mt-1 text-sm text-dark/45 font-light">{isExport ? 'Download your product data as CSV or Excel.' : 'Upload a CSV or Excel file to bulk-add products.'}</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {['CSV', 'Excel'].map((fmt) => (
            <button key={fmt} className="h-14 rounded-2xl border-2 border-black/8 text-sm font-bold text-dark/70 hover:border-primary/30 hover:bg-primary/5 transition-all flex items-center justify-center gap-2">
              <ShoppingCart className="w-4 h-4" /> .{fmt.toLowerCase()}
            </button>
          ))}
        </div>
        {!isExport && (
          <div className="mt-4 rounded-2xl border-2 border-dashed border-black/15 p-8 text-center hover:border-primary/30 hover:bg-primary/3 transition-all cursor-pointer">
            <Upload className="w-8 h-8 text-dark/20 mx-auto" />
            <p className="mt-2 text-xs text-dark/40">Drag & drop your file here</p>
          </div>
        )}
        <p className="mt-4 text-[11px] text-dark/30 text-center">
          {isExport ? 'Export includes all products with current status and pricing.' : 'Supported: CSV, XLSX. Max 5MB. Products will be validated before import.'}
        </p>
      </motion.div>
    </motion.div>
  )
}

/* ================= FILTER PANEL ================= */
function FilterPanel({ filters, setFilters, open, onClose }) {
  const { categories } = useProducts()
  if (!open) return null
  const set = (k, v) => setFilters((f) => ({ ...f, [k]: v }))
  const clear = () => setFilters({ category: '', stock: '', priceMin: '', priceMax: '', organic: false, fresh: false, featured: false, status: '' })

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[80] flex items-start justify-end">
      <div className="absolute inset-0 bg-dark/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ x: 320 }} animate={{ x: 0 }} exit={{ x: 320 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} className="relative w-80 h-full bg-white shadow-lift p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-bold text-dark">Filters</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-dark/30 hover:bg-black/5"><X className="w-4 h-4" /></button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-dark/60 mb-2">Category</label>
            <select value={filters.category} onChange={(e) => set('category', e.target.value)} className="w-full h-10 px-3 rounded-xl bg-cream border border-black/8 text-sm text-dark focus:outline-none focus:border-primary/30">
              <option value="">All categories</option>
              {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-dark/60 mb-2">Status</label>
            <select value={filters.status} onChange={(e) => set('status', e.target.value)} className="w-full h-10 px-3 rounded-xl bg-cream border border-black/8 text-sm text-dark focus:outline-none focus:border-primary/30">
              <option value="">All statuses</option>
              {productStatuses.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-dark/60 mb-2">Stock level</label>
            <select value={filters.stock} onChange={(e) => set('stock', e.target.value)} className="w-full h-10 px-3 rounded-xl bg-cream border border-black/8 text-sm text-dark focus:outline-none focus:border-primary/30">
              <option value="">All</option>
              <option value="out">Out of stock</option>
              <option value="low">Low stock (&lt;15)</option>
              <option value="ok">In stock</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-dark/60 mb-2">Price range</label>
            <div className="grid grid-cols-2 gap-2">
              <input type="number" placeholder="Min ₹" value={filters.priceMin} onChange={(e) => set('priceMin', e.target.value)} className="h-10 px-3 rounded-xl bg-cream border border-black/8 text-sm focus:outline-none focus:border-primary/30" />
              <input type="number" placeholder="Max ₹" value={filters.priceMax} onChange={(e) => set('priceMax', e.target.value)} className="h-10 px-3 rounded-xl bg-cream border border-black/8 text-sm focus:outline-none focus:border-primary/30" />
            </div>
          </div>

          <div className="space-y-2.5">
            {[{ k: 'organic', l: 'Organic' }, { k: 'fresh', l: 'Fresh Today' }, { k: 'featured', l: 'Featured' }].map(({ k, l }) => (
              <label key={k} className="flex items-center gap-2.5 cursor-pointer select-none">
                <input type="checkbox" checked={filters[k]} onChange={(e) => set(k, e.target.checked)} className="w-4 h-4 rounded accent-[#2E7D32]" />
                <span className="text-sm text-dark/70">{l}</span>
              </label>
            ))}
          </div>

          <button onClick={clear} className="w-full h-10 rounded-xl border border-black/8 text-xs font-bold text-dark/50 hover:border-red-300 hover:text-red-500 transition-all">Clear All Filters</button>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ================= MAIN PRODUCTS PAGE ================= */
export default function ProductsPage() {
  const navigate = useNavigate()
  const { allProducts, categories, loading } = useProducts()
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('updatedAt')
  const [sortDir, setSortDir] = useState('desc')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState(new Set())
  const [bulkAction, setBulkAction] = useState('')
  const [filters, setFilters] = useState({ category: '', stock: '', priceMin: '', priceMax: '', organic: false, fresh: false, featured: false, status: '' })
  const [filterOpen, setFilterOpen] = useState(false)
  const [deleteProduct, setDeleteProduct] = useState(null)
  const [viewProduct, setViewProduct] = useState(null)
  const [importExport, setImportExport] = useState(null)
  const [products, setProducts] = useState(allProducts)

  useEffect(() => { setProducts(allProducts) }, [allProducts])

  const filtered = useMemo(() => {
    let list = [...products]
    if (search) {
      const q = search.toLowerCase()
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.sku?.toLowerCase().includes(q) || p._id.toLowerCase().includes(q) || p.tags?.some((t) => t.includes(q)))
    }
    if (filters.category) list = list.filter((p) => p.category === filters.category)
    if (filters.status) list = list.filter((p) => p.status === filters.status)
    if (filters.stock === 'out') list = list.filter((p) => p.stock <= 0)
    else if (filters.stock === 'low') list = list.filter((p) => p.stock > 0 && p.stock < (p.minStock || 15))
    else if (filters.stock === 'ok') list = list.filter((p) => p.stock >= (p.minStock || 15))
    if (filters.priceMin) list = list.filter((p) => p.sellingPrice >= Number(filters.priceMin))
    if (filters.priceMax) list = list.filter((p) => p.sellingPrice <= Number(filters.priceMax))
    if (filters.organic) list = list.filter((p) => p.organic)
    if (filters.fresh) list = list.filter((p) => p.freshToday)
    if (filters.featured) list = list.filter((p) => p.featured)
    list.sort((a, b) => {
      let va = a[sortBy], vb = b[sortBy]
      if (typeof va === 'string') { va = va?.toLowerCase(); vb = vb?.toLowerCase() }
      if (sortDir === 'asc') return va > vb ? 1 : va < vb ? -1 : 0
      return va < vb ? 1 : va > vb ? -1 : 0
    })
    return list
  }, [products, search, sortBy, sortDir, filters])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const toggleSelect = (id) => setSelected((prev) => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n })
  const selectAll = () => setSelected((prev) => prev.size === paged.length ? new Set() : new Set(paged.map((p) => p._id)))

  const handleAction = useCallback((action, product) => {
    if (action === 'edit') navigate(`/admin/products/edit/${product._id}`)
    else if (action === 'view') setViewProduct(product)
    else if (action === 'delete') setDeleteProduct(product)
    else if (action === 'duplicate') { navigate('/admin/products/new') }
    else if (action === 'hide') setProducts((prev) => prev.map((p) => p._id === product._id ? { ...p, status: p.status === 'hidden' ? 'published' : 'hidden' } : p))
    else if (action === 'archive') setProducts((prev) => prev.map((p) => p._id === product._id ? { ...p, status: 'archived' } : p))
  }, [navigate])

  const handleBulk = () => {
    if (bulkAction === 'delete') setProducts((prev) => prev.filter((p) => !selected.has(p._id)))
    else if (bulkAction === 'publish') setProducts((prev) => prev.map((p) => selected.has(p._id) ? { ...p, status: 'published' } : p))
    else if (bulkAction === 'archive') setProducts((prev) => prev.map((p) => selected.has(p._id) ? { ...p, status: 'archived' } : p))
    setSelected(new Set()); setBulkAction('')
  }

  const sortOpts = [
    { v: 'updatedAt', l: 'Last Updated' },
    { v: 'name', l: 'Name' },
    { v: 'sellingPrice', l: 'Price' },
    { v: 'stock', l: 'Stock' },
    { v: 'rating', l: 'Rating' },
    { v: 'createdAt', l: 'Date Added' },
  ]

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark/30" />
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} placeholder="Search products, SKU, tags…" className="w-full h-10 pl-10 pr-4 rounded-2xl bg-white border border-black/5 text-sm text-dark placeholder:text-dark/30 focus:outline-none focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all" />
        </div>
        <button onClick={() => setFilterOpen(true)} className="inline-flex items-center gap-1.5 h-10 px-4 rounded-2xl bg-white border border-black/5 text-xs font-bold text-dark/60 hover:border-primary/25 hover:text-primary transition-all"><Filter className="w-3.5 h-3.5" /> Filters</button>
        <div className="relative">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="h-10 pl-3 pr-8 rounded-2xl bg-white border border-black/5 text-xs font-bold text-dark/60 appearance-none focus:outline-none focus:border-primary/25">
            {sortOpts.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
          </select>
          <ArrowUpDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-dark/30 pointer-events-none" />
        </div>
        <button onClick={() => setSortDir((d) => d === 'asc' ? 'desc' : 'asc')} className="w-10 h-10 rounded-2xl bg-white border border-black/5 flex items-center justify-center text-dark/40 hover:text-primary transition-colors" title="Toggle sort direction">
          <motion.span animate={{ rotate: sortDir === 'asc' ? 0 : 180 }} className="block"><ChevronDown className="w-4 h-4" /></motion.span>
        </button>
        <div className="hidden sm:flex items-center gap-2">
          <button onClick={() => setImportExport('export')} className="inline-flex items-center gap-1.5 h-10 px-4 rounded-2xl bg-white border border-black/5 text-xs font-bold text-dark/60 hover:border-primary/25 transition-all"><Download className="w-3.5 h-3.5" /> Export</button>
          <button onClick={() => setImportExport('import')} className="inline-flex items-center gap-1.5 h-10 px-4 rounded-2xl bg-white border border-black/5 text-xs font-bold text-dark/60 hover:border-primary/25 transition-all"><Upload className="w-3.5 h-3.5" /> Import</button>
        </div>
        <button onClick={() => navigate('/admin/products/new')} className="ml-auto inline-flex items-center gap-2 h-10 px-5 rounded-2xl bg-gradient-to-r from-primary to-primary-dark text-white text-xs font-bold shadow-md shadow-primary/15 hover:shadow-lg hover:-translate-y-0.5 transition-all">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Bulk actions bar */}
      <AnimatePresence>
        {selected.size > 0 && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="flex items-center gap-3 bg-primary/8 rounded-2xl border border-primary/15 px-4 py-3">
            <span className="text-xs font-bold text-primary">{selected.size} selected</span>
            <div className="flex items-center gap-2 ml-auto">
              {[
                { v: 'publish', l: 'Publish', c: 'bg-emerald-100 text-emerald-700' },
                { v: 'archive', l: 'Archive', c: 'bg-gray-100 text-gray-600' },
                { v: 'delete', l: 'Delete', c: 'bg-red-100 text-red-600' },
              ].map((a) => (
                <button key={a.v} onClick={() => { if (a.v === 'delete') { setProducts((prev) => prev.filter((p) => !selected.has(p._id))); setSelected(new Set()) } else handleBulk() }} className={`px-3 py-1.5 rounded-xl text-[11px] font-bold ${a.c}`}>{a.l}</button>
              ))}
              <button onClick={() => setSelected(new Set())} className="w-8 h-8 rounded-xl flex items-center justify-center text-dark/30 hover:bg-black/5"><X className="w-4 h-4" /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-black/5 shadow-soft overflow-hidden">
        {loading ? (
          <div className="p-5 space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-14 rounded-xl bg-black/4 animate-pulse" />
            ))}
          </div>
        ) : (
        <>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[1000px]">
            <thead>
              <tr className="border-b border-black/5">
                <th className="px-4 py-3.5 w-10"><input type="checkbox" checked={selected.size === paged.length && paged.length > 0} onChange={selectAll} className="w-4 h-4 rounded accent-[#2E7D32]" /></th>
                {['Product', 'Category', 'Price', 'Stock', 'Status', 'Updated', ''].map((h, i) => (
                  <th key={i} className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider text-dark/35 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.map((p) => {
                const cat = categories.find((c) => c._id === p.category)
                const lowStock = p.stock <= (p.minStock || 15)
                return (
                  <tr key={p._id} className="border-b border-black/3 last:border-0 hover:bg-primary/[0.02] transition-colors group">
                    <td className="px-4 py-3"><input type="checkbox" checked={selected.has(p._id)} onChange={() => toggleSelect(p._id)} className="w-4 h-4 rounded accent-[#2E7D32]" /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0" style={{ background: `linear-gradient(135deg, ${p.gradient[0]}25, ${p.gradient[1]}12)` }}>
                          <span className="text-2xl">{p.emoji}</span>
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-dark truncate">{p.name}</p>
                          <p className="text-[10px] text-dark/40">{p.sku} · {p._id}</p>
                          <div className="flex items-center gap-1 mt-0.5">
                            {p.organic && <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">Organic</span>}
                            {p.freshToday && <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-md">Fresh</span>}
                            {p.featured && <span className="text-[9px] font-bold text-violet-600 bg-violet-50 px-1.5 py-0.5 rounded-md">Featured</span>}
                            {p.bestSeller && <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md">Best Seller</span>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-bold text-dark">{cat?.name?.split(' ')[0] || '—'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-bold text-dark">₹{p.sellingPrice}</div>
                      {p.mrp > p.sellingPrice && <div className="text-[10px] text-dark/35 line-through">₹{p.mrp}</div>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-sm font-bold ${lowStock ? (p.stock === 0 ? 'text-red-500' : 'text-accent') : 'text-dark'}`}>{p.stock}</span>
                      {lowStock && <span className="ml-1 text-[9px] font-bold text-accent">low</span>}
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-dark/40">{new Date(p.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => navigate(`/admin/products/edit/${p._id}`)} className="w-8 h-8 rounded-xl flex items-center justify-center text-dark/30 hover:text-primary hover:bg-primary/8 transition-colors opacity-0 group-hover:opacity-100"><Pencil className="w-4 h-4" /></button>
                        <RowActions product={p} onAction={handleAction} />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {filtered.length === 0 && !loading && (
            <div className="py-20 text-center">
              <span className="w-16 h-16 mx-auto rounded-3xl bg-primary/8 flex items-center justify-center"><ShoppingCart className="w-8 h-8 text-primary" /></span>
              <h3 className="mt-5 font-serif-display text-xl font-bold text-dark">No products found</h3>
              <p className="mt-1.5 text-sm text-dark/45 font-light">Try a different search or clear filters.</p>
            </div>
          )}
        </div>
        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-black/5">
          <p className="text-[11px] text-dark/40">Showing {((page - 1) * PAGE_SIZE) + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} products</p>
          <div className="flex items-center gap-1.5">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} className="w-8 h-8 rounded-xl flex items-center justify-center text-dark/30 hover:bg-primary/8 disabled:opacity-30"><ChevronLeft className="w-4 h-4" /></button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const pn = i + 1
              return <button key={pn} onClick={() => setPage(pn)} className={`w-8 h-8 rounded-xl text-xs font-bold flex items-center justify-center transition-all ${pn === page ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-dark/45 hover:bg-primary/8'}`}>{pn}</button>
            })}
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="w-8 h-8 rounded-xl flex items-center justify-center text-dark/30 hover:bg-primary/8 disabled:opacity-30"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
        </>
        )}
      </div>

      <FilterPanel filters={filters} setFilters={setFilters} open={filterOpen} onClose={() => setFilterOpen(false)} />
      <AnimatePresence>
      {deleteProduct && (
  <DeleteModal
    product={deleteProduct}
    onClose={() => setDeleteProduct(null)}
    onConfirm={async () => {
      try {
        await productApi.remove(deleteProduct._id)
        setProducts((prev) => prev.filter((p) => p._id !== deleteProduct._id))
        setDeleteProduct(null)
      } catch (err) {
        console.error(err)
      }
    }}
  />
)}
        {viewProduct && <ViewModal product={viewProduct} onClose={() => setViewProduct(null)} onEdit={(id) => navigate(`/admin/products/edit/${id}`)} />}
        {importExport && <ImportExportModal type={importExport} onClose={() => setImportExport(null)} />}
      </AnimatePresence>
    </div>
  )
}
