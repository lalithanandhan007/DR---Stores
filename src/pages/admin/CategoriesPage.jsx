import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Trash2, GripVertical, X, Eye, EyeOff } from 'lucide-react'
import { adminCategories } from '../../data/productsData'
import { SectionHeader } from '../../components/admin/ui'
import { useToast } from '../../context/CartContext'

const inputClass = 'w-full h-11 px-4 rounded-xl bg-cream border border-black/8 text-sm text-dark placeholder:text-dark/30 focus:outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10 transition-all'
const EMOJI_OPTIONS = ['🥬', '🥕', '🍅', '🥒', '🧄', '🌿', '🍄', '🍚', '🫑', '🌽', '🍋', '🧅', '🥦', '🫛', '🌶️', '🍆']

/* ================= ADD / EDIT MODAL ================= */
function CategoryModal({ category, onClose, onSave }) {
  const [form, setForm] = useState(category || { name: '', icon: '🥬', color: '#4CAF50' })
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-dark/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 26 }} className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-7">
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-dark/30 hover:bg-black/5"><X className="w-4 h-4" /></button>
        <h3 className="font-serif-display text-xl font-bold text-dark mb-5">{category ? 'Edit Category' : 'Add Category'}</h3>

        <div className="space-y-4">
          <div><label className="block text-[13px] font-semibold text-dark/70 mb-1.5">Category Name *</label><input className={inputClass} placeholder="e.g. Leafy Vegetables" value={form.name} onChange={(e) => set('name', e.target.value)} /></div>

          <div><label className="block text-[13px] font-semibold text-dark/70 mb-1.5">Icon</label>
            <div className="flex flex-wrap gap-2">
              {EMOJI_OPTIONS.map((em) => (
                <button key={em} type="button" onClick={() => set('icon', em)} className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl border-2 transition-all ${form.icon === em ? 'border-primary bg-primary/5' : 'border-black/5 bg-cream hover:border-primary/20'}`}>{em}</button>
              ))}
            </div>
          </div>

          <div><label className="block text-[13px] font-semibold text-dark/70 mb-1.5">Color</label>
            <div className="flex items-center gap-3">
              <input type="color" value={form.color || '#4CAF50'} onChange={(e) => set('color', e.target.value)} className="w-10 h-10 rounded-xl border border-black/10 cursor-pointer" />
              <span className="text-xs text-dark/45">{form.color || '#4CAF50'}</span>
            </div>
          </div>

          <div className="rounded-2xl bg-cream border border-black/5 p-5 flex items-center gap-4">
            <span className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0" style={{ background: `linear-gradient(135deg, ${form.color || '#4CAF50'}20, ${form.color || '#4CAF50'}10)` }}>{form.icon}</span>
            <div>
              <p className="text-sm font-bold text-dark">{form.name || 'Preview'}</p>
              <p className="text-[11px] text-dark/40">Category preview</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-6">
          <button onClick={onClose} className="h-12 rounded-2xl border border-black/10 text-sm font-bold text-dark/60 hover:border-black/25 transition-all">Cancel</button>
          <button onClick={() => { if (form.name) { onSave(form); onClose() } }} disabled={!form.name} className="h-12 rounded-2xl bg-gradient-to-r from-primary to-primary-dark text-white text-sm font-bold shadow-md shadow-primary/15 disabled:opacity-40 transition-all">{category ? 'Save Changes' : 'Add Category'}</button>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ================= DELETE CONFIRM ================= */
function DeleteConfirm({ category, onClose, onConfirm }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-dark/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 26 }} className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-7 text-center">
        <span className="w-14 h-14 mx-auto rounded-full bg-red-50 flex items-center justify-center text-3xl">{category.icon}</span>
        <h3 className="mt-4 font-serif-display text-xl font-bold text-dark">Delete “{category.name}”?</h3>
        <p className="mt-2 text-sm text-dark/50 font-light">Products in this category will need to be reassigned.</p>
        <div className="grid grid-cols-2 gap-3 mt-6">
          <button onClick={onClose} className="h-12 rounded-2xl border border-black/10 text-sm font-bold text-dark/60 hover:border-black/25 transition-all">Cancel</button>
          <button onClick={() => { onConfirm(); onClose() }} className="h-12 rounded-2xl bg-red-500 text-white text-sm font-bold shadow-lg shadow-red-500/20 hover:bg-red-600 transition-all">Delete</button>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ================= MAIN CATEGORIES PAGE ================= */
export default function CategoriesPage() {
  const { addToast } = useToast()
  const [categories, setCategories] = useState(adminCategories)
  const [editing, setEditing] = useState(null)
  const [showAdd, setShowAdd] = useState(false)
  const [deleting, setDeleting] = useState(null)

  const handleSave = (form) => {
    if (editing) {
      setCategories((prev) => prev.map((c) => c._id === editing._id ? { ...c, ...form } : c))
      addToast('Category updated', 'success')
    } else {
      const newCat = { ...form, _id: `cat_${Date.now()}`, slug: form.name.toLowerCase().replace(/\s+/g, '-'), order: categories.length + 1, visible: true, productCount: 0 }
      setCategories((prev) => [...prev, newCat])
      addToast('Category added', 'success')
    }
    setEditing(null); setShowAdd(false)
  }

  const handleDelete = (cat) => {
    setCategories((prev) => prev.filter((c) => c._id !== cat._id))
    addToast(`"${cat.name}" deleted`, 'info')
  }

  const toggleVisible = (cat) => {
    setCategories((prev) => prev.map((c) => c._id === cat._id ? { ...c, visible: !c.visible } : c))
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <SectionHeader title="Categories" subtitle={`${categories.length} categories in your store`} />
        <button onClick={() => { setEditing(null); setShowAdd(true) }} className="inline-flex items-center gap-2 h-10 px-5 rounded-2xl bg-gradient-to-r from-primary to-primary-dark text-white text-xs font-bold shadow-md shadow-primary/15 hover:shadow-lg hover:-translate-y-0.5 transition-all">
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {categories.map((cat, i) => (
          <motion.div
            key={cat._id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.04 }}
            className={`bg-white rounded-3xl border border-black/5 shadow-soft p-5 hover:shadow-card hover:-translate-y-0.5 transition-all group ${!cat.visible ? 'opacity-60' : ''}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl" style={{ background: `linear-gradient(135deg, ${cat.color}20, ${cat.color}10)` }}>{cat.icon}</span>
                <div>
                  <p className="text-sm font-bold text-dark">{cat.name}</p>
                  <p className="text-[11px] text-dark/40 mt-0.5">{cat.productCount} products</p>
                </div>
              </div>
              <span className="text-dark/20 group-hover:text-dark/40 cursor-grab"><GripVertical className="w-4 h-4" /></span>
            </div>

            <div className="flex items-center justify-between mt-4 pt-3 border-t border-black/5">
              <button onClick={() => toggleVisible(cat)} className="inline-flex items-center gap-1.5 text-[11px] font-bold text-dark/45 hover:text-primary transition-colors">
                {cat.visible ? <><Eye className="w-3.5 h-3.5" /> Visible</> : <><EyeOff className="w-3.5 h-3.5" /> Hidden</>}
              </button>
              <div className="flex items-center gap-1">
                <button onClick={() => { setEditing(cat); setShowAdd(true) }} className="w-8 h-8 rounded-xl flex items-center justify-center text-dark/30 hover:text-primary hover:bg-primary/8 transition-colors"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => setDeleting(cat)} className="w-8 h-8 rounded-xl flex items-center justify-center text-dark/30 hover:text-red-500 hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showAdd && <CategoryModal category={editing} onClose={() => { setShowAdd(false); setEditing(null) }} onSave={handleSave} />}
        {deleting && <DeleteConfirm category={deleting} onClose={() => setDeleting(null)} onConfirm={() => handleDelete(deleting)} />}
      </AnimatePresence>
    </div>
  )
}
