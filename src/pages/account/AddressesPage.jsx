import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Plus, Edit3, Trash2, Home, Building2, X, Star, Check } from 'lucide-react'
import AccountLayout from '../../components/account/AccountLayout'
import { useCart, useToast } from '../../context/CartContext'

const TYPES = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'office', label: 'Office', icon: Building2 },
  { id: 'other', label: 'Other', icon: MapPin },
]

const inputClass =
  'w-full h-11 px-4 rounded-xl bg-cream border border-black/8 text-sm text-dark placeholder:text-dark/30 focus:outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10 transition-all'

const emptyForm = { type: 'home', name: '', phone: '', house: '', street: '', area: '', city: '', pincode: '', landmark: '' }

function AddressForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || emptyForm)
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  const valid = form.name && form.phone && form.house && form.city && form.pincode

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="bg-white rounded-3xl border border-black/5 shadow-soft p-5 sm:p-6 mb-5">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-bold text-dark">{initial ? 'Edit Address' : 'Add New Address'}</h3>
        <button onClick={onCancel} className="w-8 h-8 rounded-full flex items-center justify-center text-dark/30 hover:bg-black/5 transition-colors"><X className="w-4 h-4" /></button>
      </div>

      <div className="flex gap-2 mb-5">
        {TYPES.map((t) => (
          <button key={t.id} onClick={() => set('type', t.id)} className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
            form.type === t.id ? 'bg-dark text-white border-dark' : 'bg-cream text-dark/55 border-black/8 hover:border-dark/25'
          }`}>
            <t.icon className="w-3.5 h-3.5" /> {t.label}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <input className={inputClass} placeholder="Full Name" value={form.name} onChange={(e) => set('name', e.target.value)} />
        <input className={inputClass} placeholder="Phone Number" inputMode="numeric" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
        <input className={inputClass} placeholder="House / Flat No." value={form.house} onChange={(e) => set('house', e.target.value)} />
        <input className={inputClass} placeholder="Street / Road" value={form.street} onChange={(e) => set('street', e.target.value)} />
        <input className={inputClass} placeholder="Area / Locality" value={form.area} onChange={(e) => set('area', e.target.value)} />
        <input className={inputClass} placeholder="City" value={form.city} onChange={(e) => set('city', e.target.value)} />
        <input className={inputClass} placeholder="Pincode" inputMode="numeric" value={form.pincode} onChange={(e) => set('pincode', e.target.value)} />
        <input className={inputClass} placeholder="Landmark (optional)" value={form.landmark} onChange={(e) => set('landmark', e.target.value)} />
      </div>

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => onSave(form)}
        disabled={!valid}
        className="mt-5 w-full h-12 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white text-sm font-bold shadow-md shadow-primary/15 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        Save Address
      </motion.button>
    </motion.div>
  )
}

export default function AddressesPage() {
  const { addresses, defaultAddressId, saveAddress, deleteAddress, setDefaultAddress } = useCart()
  const { addToast } = useToast()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)

  const handleSave = (form) => {
    saveAddress(form)
    addToast(editing ? 'Address updated' : 'Address added', 'success')
    setShowForm(false)
    setEditing(null)
  }

  const handleDelete = (addr) => {
    deleteAddress(addr.id)
    addToast('Address deleted', 'info', 2500)
  }

  const typeMeta = (t) => TYPES.find((x) => x.id === t) || TYPES[2]

  return (
    <AccountLayout title="My Addresses" subtitle="Save delivery addresses for faster checkout.">
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-dark/45">{addresses.length} saved address{addresses.length === 1 ? '' : 'es'}</p>
        <button onClick={() => { setShowForm((s) => !s); setEditing(null) }} className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white text-xs font-bold shadow-md shadow-primary/15 hover:shadow-lg transition-all">
          <Plus className="w-4 h-4" /> Add Address
        </button>
      </div>

      <AnimatePresence>
        {showForm && <AddressForm onSave={handleSave} onCancel={() => setShowForm(false)} />}
        {editing && <AddressForm initial={editing} onSave={handleSave} onCancel={() => setEditing(null)} />}
      </AnimatePresence>

      {addresses.length === 0 ? (
        <div className="bg-white rounded-3xl border border-black/5 shadow-soft py-16 px-6 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }} className="w-20 h-20 mx-auto rounded-full bg-primary/8 flex items-center justify-center">
            <MapPin className="w-9 h-9 text-primary/40" />
          </motion.div>
          <h3 className="mt-6 font-serif-display text-2xl font-bold text-dark">No saved addresses</h3>
          <p className="mt-2 text-sm text-dark/45 font-light max-w-sm mx-auto">Add your home or office address for one-tap checkout.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {addresses.map((addr, i) => {
            const meta = typeMeta(addr.type)
            const isDefault = defaultAddressId === addr.id
            return (
              <motion.div
                key={addr.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: i * 0.06 }}
                className={`group bg-white rounded-3xl border p-5 transition-all duration-300 ${isDefault ? 'border-primary bg-primary/4 shadow-card' : 'border-black/5 shadow-soft hover:border-primary/20'}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`w-11 h-11 rounded-2xl flex items-center justify-center ${
                      addr.type === 'home' ? 'bg-primary/10 text-primary' : addr.type === 'office' ? 'bg-accent/10 text-accent' : 'bg-black/8 text-dark/50'
                    }`}>
                      <meta.icon className="w-5 h-5" />
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-dark">{addr.name}</span>
                        <span className="text-[10px] font-bold uppercase tracking-wide text-dark/45 bg-black/5 px-2 py-0.5 rounded-full">{meta.label}</span>
                      </div>
                      {isDefault && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-primary mt-1"><Star className="w-3 h-3 fill-primary" /> Default</span>
                      )}
                    </div>
                  </div>
                </div>

                <p className="mt-4 text-[13px] text-dark/60 leading-relaxed">
                  {addr.house}, {addr.street}{addr.area ? `, ${addr.area}` : ''}, {addr.city} - {addr.pincode}
                </p>
                <p className="text-[11px] text-dark/35 mt-1.5 flex items-center gap-1">
                  <Check className="w-3 h-3" /> 📞 {addr.phone}
                  {addr.landmark && ` · Near ${addr.landmark}`}
                </p>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-black/5">
                  {!isDefault ? (
                    <button onClick={() => { setDefaultAddress(addr.id); addToast('Default address set', 'success', 2500) }} className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-dark transition-colors">
                      <Star className="w-3.5 h-3.5" /> Set Default
                    </button>
                  ) : <span />}
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => setEditing(addr)} className="w-9 h-9 rounded-xl flex items-center justify-center text-dark/30 hover:text-primary hover:bg-primary/8 transition-colors" aria-label="Edit"><Edit3 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(addr)} className="w-9 h-9 rounded-xl flex items-center justify-center text-dark/30 hover:text-red-500 hover:bg-red-50 transition-colors" aria-label="Delete"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </AccountLayout>
  )
}
