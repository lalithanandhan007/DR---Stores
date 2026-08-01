import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Camera, Mail, Smartphone, CalendarDays, Pencil, X, Save, LogOut,
  Package, Heart, MapPin, TrendingUp, UserRound,
} from 'lucide-react'
import AccountLayout from '../../components/account/AccountLayout'
import Avatar from '../../components/account/Avatar'
import { Field } from '../../components/auth/Field'
import { useAuth, ROLE_LABELS, useWishlist } from '../../context/AuthContext'
import { useCart, useToast } from '../../context/CartContext'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function ProfilePage() {
  const { user, role, updateProfile, logout } = useAuth()
  const { orderHistory, addresses } = useCart()
  const { wishlist } = useWishlist()
  const { addToast } = useToast()
  const navigate = useNavigate()
  const fileRef = useRef(null)

  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '' })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const memberSince = user?.memberSince
    ? new Date(user.memberSince).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : '—'

  const totalSpent = orderHistory.reduce((s, o) => s + (o.grandTotal || 0), 0)
  const stats = [
    { label: 'Total Orders', value: orderHistory.length, icon: Package, to: '/orders', tint: 'bg-primary/10 text-primary' },
    { label: 'Wishlist', value: wishlist.length, icon: Heart, to: '/wishlist', tint: 'bg-red-50 text-red-500' },
    { label: 'Addresses', value: addresses.length, icon: MapPin, to: '/addresses', tint: 'bg-accent/10 text-accent' },
    { label: 'Total Spent', value: `₹${totalSpent.toLocaleString('en-IN')}`, icon: TrendingUp, to: '/orders', tint: 'bg-secondary/10 text-secondary' },
  ]

  const handlePhoto = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      updateProfile({ avatar: reader.result })
      addToast('Profile photo updated', 'success')
    }
    reader.readAsDataURL(file)
  }

  const openEditor = () => {
    setForm({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '' })
    setErrors({})
    setEditing(true)
  }

  const save = () => {
    const errs = {}
    if (form.name.trim().length < 3) errs.name = 'Enter your full name'
    if (!emailRegex.test(form.email)) errs.email = 'Enter a valid email'
    if (form.phone && !/^[6-9]\d{9}$/.test(form.phone)) errs.phone = 'Enter a valid 10-digit mobile'
    setErrors(errs)
    if (Object.keys(errs).length) return

    setSaving(true)
    setTimeout(() => {
      updateProfile({ name: form.name.trim(), email: form.email.trim().toLowerCase(), phone: form.phone })
      setSaving(false)
      setEditing(false)
      addToast('Profile updated successfully', 'success')
    }, 900)
  }

  const handleLogout = () => {
    logout()
    addToast('You have been logged out', 'info', 3000)
    navigate('/')
  }

  return (
    <AccountLayout title="My Profile" subtitle="Manage your personal information and preferences.">
      {/* ---------- Hero card ---------- */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-dark via-primary to-secondary p-6 sm:p-8 shadow-lift mb-6">
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full border border-white/10 spin-slow" />
        <div className="absolute -bottom-20 -left-10 w-64 h-64 rounded-full bg-white/5" />

        <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="relative">
            <Avatar name={user?.name} avatar={user?.avatar} size={88} ring />
            <button
              onClick={() => fileRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white text-primary flex items-center justify-center shadow-md hover:scale-110 transition-transform"
              aria-label="Change photo"
            >
              <Camera className="w-4 h-4" />
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
          </div>
          <div className="text-center sm:text-left flex-1">
            <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-white">{user?.name || 'Customer'}</h2>
            <span className="inline-flex items-center gap-1.5 mt-1.5 text-[10px] font-bold uppercase tracking-wide bg-white/15 text-white px-3 py-1 rounded-full">
              <UserRound className="w-3 h-3" /> {ROLE_LABELS[role] || 'Customer'}
            </span>
            <div className="mt-3 flex flex-wrap justify-center sm:justify-start gap-x-5 gap-y-1.5 text-sm text-white/75">
              <span className="inline-flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {user?.email || 'Not added'}</span>
              <span className="inline-flex items-center gap-1.5"><Smartphone className="w-3.5 h-3.5" /> {user?.phone || 'Not added'}</span>
              <span className="inline-flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5" /> Since {memberSince}</span>
            </div>
          </div>
          <div className="flex gap-2 sm:flex-col">
            <button onClick={openEditor} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-primary text-xs font-bold hover:-translate-y-0.5 hover:shadow-lg transition-all">
              <Pencil className="w-3.5 h-3.5" /> Edit Profile
            </button>
            <button onClick={handleLogout} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-bold hover:bg-white/20 transition-all">
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        </div>
      </div>

      {/* ---------- Stats ---------- */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {stats.map((s, i) => (
          <motion.button
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.07 }}
            onClick={() => navigate(s.to)}
            className="text-left bg-white rounded-2xl border border-black/5 shadow-soft p-4 hover:-translate-y-0.5 hover:shadow-card transition-all duration-300"
          >
            <span className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2.5 ${s.tint}`}>
              <s.icon className="w-4.5 h-4.5" />
            </span>
            <p className="text-lg font-black text-dark leading-none">{s.value}</p>
            <p className="text-[11px] text-dark/45 mt-1">{s.label}</p>
          </motion.button>
        ))}
      </div>

      {/* ---------- Edit form ---------- */}
      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="bg-white rounded-3xl border border-black/5 shadow-soft p-5 sm:p-6 mb-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-bold text-dark">Edit Profile</h3>
                <button onClick={() => setEditing(false)} className="w-8 h-8 rounded-full flex items-center justify-center text-dark/30 hover:bg-black/5 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Full Name" icon={UserRound} value={form.name} onChange={(e) => { setForm((f) => ({ ...f, name: e.target.value })); setErrors((s) => ({ ...s, name: null })) }} error={errors.name} valid={form.name.trim().length >= 3} />
                <Field label="Email Address" icon={Mail} type="email" value={form.email} onChange={(e) => { setForm((f) => ({ ...f, email: e.target.value })); setErrors((s) => ({ ...s, email: null })) }} error={errors.email} valid={emailRegex.test(form.email)} />
                <Field label="Mobile Number" icon={Smartphone} leftAddon="+91" inputMode="numeric" maxLength={10} value={form.phone} onChange={(e) => { setForm((f) => ({ ...f, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })); setErrors((s) => ({ ...s, phone: null })) }} error={errors.phone} valid={/^[6-9]\d{9}$/.test(form.phone)} />
              </div>
              <div className="flex justify-end gap-2 mt-5">
                <button onClick={() => setEditing(false)} className="px-5 py-2.5 rounded-xl text-xs font-bold text-dark/55 border border-black/8 hover:border-black/20 transition-all">Cancel</button>
                <motion.button whileTap={{ scale: 0.97 }} onClick={save} disabled={saving} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white text-xs font-bold shadow-md shadow-primary/20 disabled:opacity-60 transition-all">
                  {saving ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  {saving ? 'Saving…' : 'Save Changes'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </AccountLayout>
  )
}
