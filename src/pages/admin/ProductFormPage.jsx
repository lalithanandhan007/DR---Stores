import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft, ChevronRight, Check, Leaf, Sun, Star, Sparkles, X, ImagePlus,
} from 'lucide-react'
import { useProducts } from '../../context/ProductsContext'
import { useToast } from '../../context/CartContext'

const STEPS = [
  { id: 1, label: 'Basic Info', icon: '📝' },
  { id: 2, label: 'Pricing', icon: '💰' },
  { id: 3, label: 'Inventory', icon: '📦' },
  { id: 4, label: 'Images', icon: '🖼️' },
  { id: 5, label: 'Details', icon: '✨' },
]

const inputClass = 'w-full h-11 px-4 rounded-xl bg-cream border border-black/8 text-sm text-dark placeholder:text-dark/30 focus:outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10 transition-all'
const labelClass = 'block text-[13px] font-semibold text-dark/70 mb-1.5'

function StepIndicator({ current, steps }) {
  return (
    <div className="flex items-center gap-0 mb-8 overflow-x-auto pb-2">
      {steps.map((s, i) => (
        <div key={s.id} className="flex items-center flex-1 last:flex-none min-w-[120px]">
          <div className="flex flex-col items-center relative">
            <motion.div animate={{ scale: current === s.id ? 1.1 : 1 }} className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${current > s.id ? 'bg-primary text-white' : current === s.id ? 'bg-dark text-white' : 'bg-black/8 text-dark/40'}`}>
              {current > s.id ? <Check className="w-5 h-5" /> : <span className="text-base">{s.icon}</span>}
            </motion.div>
            <span className={`text-[10px] font-semibold mt-1.5 whitespace-nowrap hidden sm:block ${current >= s.id ? 'text-dark' : 'text-dark/35'}`}>{s.label}</span>
          </div>
          {i < steps.length - 1 && (
            <div className="flex-1 h-0.5 mx-2 mb-5 rounded-full overflow-hidden bg-black/8">
              <motion.div initial={{ width: 0 }} animate={{ width: current > s.id ? '100%' : '0%' }} transition={{ duration: 0.5, ease: 'easeOut' }} className="h-full bg-primary" />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function Step1({ form, set }) {
  const { categories } = useProducts()
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-dark">Basic Information</h3>
      <div><label className={labelClass}>Product Name *</label><input className={inputClass} placeholder="e.g. Fresh Tomato" value={form.name} onChange={(e) => set('name', e.target.value)} /></div>
      <div><label className={labelClass}>Description *</label><textarea className={`${inputClass} h-24 resize-none`} placeholder="Short product description for display…" value={form.description} onChange={(e) => set('description', e.target.value)} /></div>
      <div><label className={labelClass}>Short Description</label><input className={inputClass} placeholder="One-liner for product cards" value={form.shortDesc} onChange={(e) => set('shortDesc', e.target.value)} /></div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div><label className={labelClass}>Category *</label>
          <select value={form.category} onChange={(e) => set('category', e.target.value)} className={inputClass}>
            <option value="">Select category</option>
            {categories.map((c) => <option key={c._id} value={c._id}>{c.icon} {c.name}</option>)}
          </select>
        </div>
        <div><label className={labelClass}>Subcategory</label><input className={inputClass} placeholder="e.g. Organic" value={form.subcategory} onChange={(e) => set('subcategory', e.target.value)} /></div>
      </div>
      <div><label className={labelClass}>Tags</label><input className={inputClass} placeholder="Comma-separated tags" value={form.tags} onChange={(e) => set('tags', e.target.value)} /></div>
    </div>
  )
}

function Step2({ form, set }) {
  const discount = form.mrp > 0 ? Math.round(((form.mrp - form.price) / form.mrp) * 100) : 0
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-dark">Pricing</h3>
      <div className="grid sm:grid-cols-3 gap-4">
        <div><label className={labelClass}>Selling Price (₹) *</label><input type="number" className={inputClass} placeholder="0" value={form.price} onChange={(e) => set('price', e.target.value)} /></div>
        <div><label className={labelClass}>MRP (₹)</label><input type="number" className={inputClass} placeholder="0" value={form.mrp} onChange={(e) => set('mrp', e.target.value)} /></div>
        <div><label className={labelClass}>Tax (%)</label><input type="number" className={inputClass} placeholder="0" value={form.tax} onChange={(e) => set('tax', e.target.value)} /></div>
      </div>
      {discount > 0 && (
        <div className="rounded-xl bg-primary/5 border border-primary/10 px-4 py-2.5 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" /><span className="text-sm font-bold text-primary">{discount}% discount — you save ₹{form.mrp - form.price}</span>
        </div>
      )}
      <div>
        <label className={labelClass}>Weight Options *</label>
        <div className="flex flex-wrap gap-2 mt-1">
          {['250g', '500g', '1kg', '2kg', '250ml', '500ml', '1L', '1 piece'].map((w) => {
            const active = form.weights?.includes(w)
            return <button key={w} type="button" onClick={() => {
              const ws = form.weights || []
              set('weights', active ? ws.filter((x) => x !== w) : [...ws, w])
            }} className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${active ? 'bg-primary text-white border-primary' : 'bg-white text-dark/55 border-black/8 hover:border-primary/30'}`}>{w}</button>
          })}
        </div>
        <div className="flex items-center gap-2 mt-3">
          <input className={`${inputClass} flex-1`} placeholder="Custom weight (e.g. 750g)" onKeyDown={(e) => { if (e.key === 'Enter' && e.target.value.trim()) { set('weights', [...(form.weights || []), e.target.value.trim()]); e.target.value = '' } }} />
        </div>
      </div>
      {form.weights?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {form.weights.map((w) => (
            <span key={w} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/8 text-primary text-xs font-bold">
              {w} <button type="button" onClick={() => set('weights', form.weights.filter((x) => x !== w))} className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center hover:bg-primary/40"><X className="w-2.5 h-2.5" /></button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

function Step3({ form, set }) {
  const statusFromStock = form.stock <= 0 ? 'Out of Stock' : form.stock < (form.minStock || 15) ? 'Low Stock' : 'In Stock'
  const statusColor = form.stock <= 0 ? 'text-red-500' : form.stock < (form.minStock || 15) ? 'text-accent' : 'text-emerald-600'
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-dark">Inventory</h3>
      <div className="grid sm:grid-cols-2 gap-4">
        <div><label className={labelClass}>Stock Quantity *</label><input type="number" className={inputClass} placeholder="0" value={form.stock} onChange={(e) => set('stock', e.target.value)} /></div>
        <div><label className={labelClass}>Minimum Stock Level</label><input type="number" className={inputClass} placeholder="15" value={form.minStock} onChange={(e) => set('minStock', e.target.value)} /></div>
        <div><label className={labelClass}>SKU</label><input className={inputClass} placeholder="e.g. DRTOM001" value={form.sku} onChange={(e) => set('sku', e.target.value)} /></div>
        <div><label className={labelClass}>Barcode</label><input className={inputClass} placeholder="e.g. 8901234567001" value={form.barcode} onChange={(e) => set('barcode', e.target.value)} /></div>
      </div>
      <div className="rounded-xl bg-cream border border-black/5 px-4 py-3 flex items-center gap-2">
        <span className={`text-sm font-bold ${statusColor}`}>{statusFromStock}</span>
        <span className="text-xs text-dark/40">— {form.stock} units available</span>
      </div>
    </div>
  )
}

function Step4({ form, set }) {
  const [dragging, setDragging] = useState(false)
  const handleDrop = (e) => {
    e.preventDefault(); setDragging(false)
    const files = [...e.dataTransfer.files].filter((f) => f.type.startsWith('image/'))
    const newImages = files.map((f) => ({ name: f.name, url: URL.createObjectURL(f) }))
    set('images', [...(form.images || []), ...newImages])
  }
  const addDemo = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/png,image/jpeg,image/webp'
    input.multiple = true
  
    input.onchange = (e) => {
      const files = [...e.target.files]
      const newImages = files.map((file) => ({
        name: file.name,
        url: URL.createObjectURL(file),
      }))
  
      set('images', [...(form.images || []), ...newImages])
    }
  
    input.click()
  }
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-dark">Product Images</h3>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={addDemo}
        className={`rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition-all ${dragging ? 'border-primary bg-primary/5' : 'border-black/15 hover:border-primary/30 hover:bg-primary/3'}`}
      >
        <ImagePlus className="w-10 h-10 text-dark/20 mx-auto" />
        <p className="mt-2 text-sm font-semibold text-dark/40">Drag & drop images or click to add</p>
        <p className="mt-1 text-[11px] text-dark/30">PNG, JPG, WebP up to 5MB each</p>
      </div>
      {form.images?.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {form.images.map((img, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative aspect-square rounded-2xl overflow-hidden bg-cream border border-black/5 group">
              <div className="w-full h-full flex items-center justify-center text-3xl" style={{ background: `linear-gradient(135deg, ${form.gradient?.[0] || '#4CAF50'}15, ${form.gradient?.[1] || '#2E7D32'}10)` }}>
                {img.emoji || '📷'}
              </div>
              {i === 0 && <span className="absolute top-2 left-2 text-[9px] font-bold px-2 py-0.5 rounded-full bg-primary text-white shadow-sm">Thumbnail</span>}
              <button onClick={() => set('images', form.images.filter((_, j) => j !== i))} className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/80 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-3 h-3 text-dark/50" /></button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

function Step5({ form, set }) {
  const flags = [
    { key: 'organic', label: 'Organic', icon: Leaf, color: 'emerald' },
    { key: 'freshToday', label: 'Fresh Today', icon: Sun, color: 'blue' },
    { key: 'bestSeller', label: 'Best Seller', icon: Star, color: 'amber' },
    { key: 'todaysPick', label: "Today's Pick", icon: Sparkles, color: 'violet' },
    { key: 'featured', label: 'Featured', icon: Sparkles, color: 'primary' },
  ]
  return (
    <div className="space-y-5">
      <h3 className="text-lg font-bold text-dark">Product Details</h3>
      <div className="grid sm:grid-cols-2 gap-4">
        <div><label className={labelClass}>Nutrition (per 100g)</label><input className={inputClass} placeholder="e.g. 18 cal, 0.9g protein" value={form.nutrition} onChange={(e) => set('nutrition', e.target.value)} /></div>
        <div><label className={labelClass}>Origin</label><input className={inputClass} placeholder="e.g. Kaveri Delta Farms, TN" value={form.origin} onChange={(e) => set('origin', e.target.value)} /></div>
        <div><label className={labelClass}>Storage Instructions</label><input className={inputClass} placeholder="e.g. Store at room temperature" value={form.storage} onChange={(e) => set('storage', e.target.value)} /></div>
        <div><label className={labelClass}>Shelf Life</label><input className={inputClass} placeholder="e.g. 5-7 days" value={form.shelfLife} onChange={(e) => set('shelfLife', e.target.value)} /></div>
      </div>
      <div><label className={labelClass}>Benefits (comma-separated)</label><input className={inputClass} placeholder="e.g. Rich in lycopene, Vitamin C" value={form.benefits} onChange={(e) => set('benefits', e.target.value)} /></div>
      <div><label className={labelClass}>Product Flags</label></div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {flags.map((f) => (
          <button key={f.key} type="button" onClick={() => set(f.key, !form[f.key])} className={`flex items-center gap-2.5 p-3.5 rounded-2xl border-2 transition-all ${form[f.key] ? 'border-primary bg-primary/5' : 'border-black/8 bg-white hover:border-primary/20'}`}>
            <span className={`w-9 h-9 rounded-xl flex items-center justify-center ${form[f.key] ? 'bg-primary text-white' : 'bg-cream text-dark/40'}`}><f.icon className="w-4.5 h-4.5" /></span>
            <span className={`text-sm font-bold ${form[f.key] ? 'text-primary' : 'text-dark/60'}`}>{f.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

const slugify = (str = '') => str.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

const parseNutrition = (str) => {
  const s = str || ''
  const val = (re) => { const m = s.match(re); return m ? m[1] : '' }
  return {
    calories: Number(val(/(\d+(?:\.\d+)?)\s*cal/i)) || 0,
    protein: val(/([\d.]+)\s*g\s*protein/i) || '0g',
    carbs: val(/([\d.]+)\s*g\s*carbs?/i) || '0g',
    fiber: val(/([\d.]+)\s*g\s*fiber/i) || '0g',
    fat: val(/([\d.]+)\s*g\s*fat/i) || '0g',
  }
}

const buildInitialForm = (existing) => ({
  name: existing?.name || '',
  description: existing?.description || '',
  shortDesc: '',
  category: existing?.category || '',
  subcategory: '',
  tags: existing?.tags?.join(', ') || '',
  price: existing?.sellingPrice || '',
  mrp: existing?.mrp || '',
  tax: existing?.tax || '',
  weights: existing?.weightOptions || [],
  stock: existing?.stock ?? '',
  minStock: existing?.minStock || '',
  sku: existing?.sku || '',
  barcode: existing?.barcode || '',
  images: existing?.emoji ? [{ emoji: existing.emoji, name: 'main' }] : [],
  nutrition: existing?.nutrition ? `${existing.nutrition.calories} cal, ${existing.nutrition.protein} protein` : '',
  origin: existing?.origin || '',
  storage: existing?.storage || '',
  shelfLife: existing?.shelfLife || '',
  benefits: existing?.benefits?.join(', ') || '',
  organic: existing?.organic || false,
  freshToday: existing?.freshToday || false,
  bestSeller: existing?.bestSeller || false,
  todaysPick: existing?.todaysPick || false,
  featured: existing?.featured || false,
  gradient: existing?.gradient || ['#4CAF50', '#2E7D32'],
})

export default function ProductFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToast } = useToast()
  const { categories, productById, saveProduct } = useProducts()
  const isEdit = !!id
  const existing = isEdit ? productById(id) : null

  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(() => buildInitialForm(existing))
  const touched = useRef(false)

  const set = (k, v) => { touched.current = true; setForm((f) => ({ ...f, [k]: v })) }

  useEffect(() => {
    if (existing && !touched.current) setForm(buildInitialForm(existing))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existing])

  const canNext = () => {
    if (step === 1) return form.name && form.description && form.category
    if (step === 2) return form.price && form.weights?.length > 0
    if (step === 3) return form.stock !== ''
    return true
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const cat = categories.find((c) => c._id === form.category)
      await saveProduct({
        _id: existing?._id,
        name: form.name,
        description: form.description,
        shortDesc: form.shortDesc,
        category: form.category,
        categoryName: cat?.name,
        slug: existing?.slug || slugify(form.name),
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
        sellingPrice: Number(form.price) || 0,
        mrp: Number(form.mrp) || 0,
        tax: Number(form.tax) || 0,
        weightOptions: form.weights,
        stock: Number(form.stock) || 0,
        minStock: Number(form.minStock) || 10,
        sku: form.sku,
        barcode: form.barcode,
        images: form.images.map((img) => img.emoji || img.url || img.name),
        emoji: existing?.emoji || cat?.icon || '🛒',
        gradient: form.gradient || ['#4CAF50', '#2E7D32'],
        nutrition: parseNutrition(form.nutrition),
        origin: form.origin,
        storage: form.storage,
        shelfLife: form.shelfLife,
        benefits: form.benefits.split(',').map((b) => b.trim()).filter(Boolean),
        organic: form.organic,
        freshToday: form.freshToday,
        bestSeller: form.bestSeller,
        todaysPick: form.todaysPick,
        featured: form.featured,
        status: existing?.status || 'published',
      })
      addToast(isEdit ? 'Product updated successfully' : 'Product created successfully', 'success')
      navigate('/admin/products')
    } catch (err) {
      addToast(err?.response?.data?.message || 'Could not save product', 'error')
    } finally {
      setSaving(false)
    }
  }

  const renderStep = () => {
    switch (step) {
      case 1: return <Step1 form={form} set={set} />
      case 2: return <Step2 form={form} set={set} />
      case 3: return <Step3 form={form} set={set} />
      case 4: return <Step4 form={form} set={set} />
      case 5: return <Step5 form={form} set={set} />
      default: return null
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-dark/40 mb-6">
        <button onClick={() => navigate('/admin/products')} className="hover:text-primary transition-colors">Products</button>
        <span className="text-dark/25">/</span>
        <span className="text-dark/65 font-medium">{isEdit ? 'Edit Product' : 'Add Product'}</span>
      </nav>

      <StepIndicator current={step} steps={STEPS} />

      <div className="bg-white rounded-3xl border border-black/5 shadow-soft p-6 sm:p-8">
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.3 }}>
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6">
        <button onClick={() => step > 1 ? setStep((s) => s - 1) : navigate('/admin/products')} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-dark/60 hover:text-dark border border-black/8 hover:border-black/15 transition-all">
          <ChevronLeft className="w-4 h-4" /> {step > 1 ? 'Previous' : 'Back to Products'}
        </button>
        {step < 5 ? (
          <motion.button whileTap={{ scale: 0.97 }} onClick={() => setStep((s) => Math.min(5, s + 1))} disabled={!canNext()} className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white text-sm font-bold shadow-lg shadow-primary/15 hover:shadow-xl hover:shadow-primary/25 hover:-translate-y-0.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
            Next <ChevronRight className="w-4 h-4" />
          </motion.button>
        ) : (
          <motion.button whileTap={{ scale: 0.97 }} onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white text-sm font-bold shadow-lg shadow-primary/15 disabled:opacity-60 transition-all">
            {saving ? <span className="w-4.5 h-4.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Check className="w-4 h-4" />}
            {saving ? 'Saving…' : isEdit ? 'Update Product' : 'Create Product'}
          </motion.button>
        )}
      </div>
    </div>
  )
}
