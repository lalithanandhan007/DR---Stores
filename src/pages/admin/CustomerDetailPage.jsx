import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, Phone, Mail, MessageSquare, MapPin, Ban, ShieldCheck, Tag,
  ShoppingBag, Wallet, Clock, Star, Trash2, Send, AlertCircle, Heart, History,
  StickyNote,
} from 'lucide-react'
import { CUSTOMER_TAGS, getCustomerTagMeta } from '../../data/customersData'
import { useCustomers } from '../../context/CustomersContext'
import { useToast } from '../../context/CartContext'
import ConfirmModal from '../../components/orders/ConfirmModal'
import Avatar from '../../components/account/Avatar'
import { inr, formatDate, timeAgo } from '../../utils/format'

function Card({ title, subtitle, action, children, delay = 0 }) {
  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white rounded-3xl border border-black/5 shadow-soft p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-bold text-dark">{title}</h3>
          {subtitle && <p className="text-[11px] text-dark/40 mt-0.5">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </motion.div>
  )
}

export default function CustomerDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getCustomer, toggleBlock, updateTag, addNote, removeNote, loading } = useCustomers()
  const { addToast } = useToast()
  const customer = getCustomer(id)

  const [noteText, setNoteText] = useState('')
  const [blockConfirm, setBlockConfirm] = useState(false)

  useEffect(() => { window.scrollTo(0, 0) }, [id])

  if (loading) {
    return (
      <div className="space-y-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-40 rounded-3xl bg-black/4 animate-pulse" />
        ))}
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-sm">
          <span className="w-16 h-16 mx-auto rounded-3xl bg-primary/8 flex items-center justify-center"><AlertCircle className="w-8 h-8 text-primary" /></span>
          <h2 className="mt-5 font-serif-display text-2xl font-bold text-dark">Customer not found</h2>
          <p className="mt-2 text-sm text-dark/45 font-light">This customer may have been deleted or the link is incorrect.</p>
          <Link to="/admin/customers" className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white text-sm font-bold shadow-md shadow-primary/15 hover:shadow-lg transition-all">
            <ArrowLeft className="w-4 h-4" /> Back to Customers
          </Link>
        </motion.div>
      </div>
    )
  }

  const tagMeta = getCustomerTagMeta(customer.tag)
  const handleNote = () => { addNote(customer._id, noteText); setNoteText('') }

  return (
    <div className="space-y-5">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
        <button onClick={() => navigate('/admin/customers')} className="inline-flex items-center gap-1.5 text-xs font-bold text-dark/50 hover:text-primary transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> All Customers
        </button>
        <div className="mt-3 flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[220px]">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="font-serif-display text-2xl sm:text-3xl font-bold text-dark tracking-tight">{customer.name}</h1>
              <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full border ${tagMeta.badge}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${tagMeta.dot}`} /> {tagMeta.label}
              </span>
              {customer.blocked && <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-500 bg-red-50 border border-red-200 px-2.5 py-1 rounded-full"><Ban className="w-3 h-3" /> Blocked</span>}
            </div>
            <p className="text-xs text-dark/45 mt-1.5 font-light">Joined {formatDate(customer.joinedAt)} · Last active {timeAgo(customer.lastActiveAt)}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 ml-auto">
            <button onClick={() => addToast('Opening WhatsApp chat (demo)', 'info', 2400)} className="inline-flex items-center gap-2 h-11 px-4 rounded-2xl bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-500/20 hover:bg-emerald-600 transition-all">
              <MessageSquare className="w-4 h-4" /> WhatsApp
            </button>
            <button onClick={() => addToast(`Calling ${customer.phone} (demo)`, 'info', 2000)} className="inline-flex items-center gap-2 h-11 px-4 rounded-2xl bg-white border border-black/8 text-xs font-bold text-dark/60 hover:border-primary/30 hover:text-primary transition-all">
              <Phone className="w-4 h-4" /> Call
            </button>
            <button onClick={() => setBlockConfirm(true)} className={`inline-flex items-center gap-2 h-11 px-4 rounded-2xl text-xs font-bold transition-all ${customer.blocked ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100' : 'bg-red-50 text-red-500 border border-red-200 hover:bg-red-100'}`}>
              {customer.blocked ? <><ShieldCheck className="w-4 h-4" /> Unblock</> : <><Ban className="w-4 h-4" /> Block</>}
            </button>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-5 items-start">
        {/* LEFT 2/3 */}
        <div className="lg:col-span-2 space-y-5">
          {/* Stats */}
          <Card title="Customer Overview" delay={0.05}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: ShoppingBag, label: 'Total Orders', value: customer.totalOrders, tint: 'bg-primary/10 text-primary' },
                { icon: Wallet, label: 'Lifetime Spend', value: inr(customer.lifetimeSpend), tint: 'bg-emerald-50 text-emerald-600' },
                { icon: Clock, label: 'Avg Order Value', value: inr(customer.avgOrderValue), tint: 'bg-blue-50 text-blue-600' },
                { icon: Star, label: 'Member Since', value: formatDate(customer.joinedAt), tint: 'bg-amber-50 text-amber-600' },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl bg-cream p-3.5">
                  <span className={`w-8 h-8 rounded-xl flex items-center justify-center ${s.tint}`}><s.icon className="w-4 h-4" /></span>
                  <p className="mt-2 text-lg font-black text-dark">{s.value}</p>
                  <p className="text-[10px] text-dark/40">{s.label}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Addresses */}
          <Card title="Saved Addresses" subtitle={`${customer.addresses?.length || 0} saved`} delay={0.1}>
            <div className="space-y-3">
              {customer.addresses?.map((addr) => (
                <div key={addr.id} className={`flex items-start gap-3 p-3.5 rounded-2xl border ${addr.isDefault ? 'border-primary/15 bg-primary/3' : 'border-black/5 bg-cream'}`}>
                  <span className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0"><MapPin className="w-4 h-4" /></span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-dark">{addr.label}</p>
                      {addr.isDefault && <span className="text-[9px] font-bold text-primary bg-primary/8 px-1.5 py-0.5 rounded-md">Default</span>}
                    </div>
                    <p className="text-xs text-dark/60 mt-0.5 leading-relaxed">
                      {addr.house}, {addr.street}, {addr.locality}, {addr.city} — {addr.pincode}
                    </p>
                    {addr.landmark && <p className="text-[10px] text-dark/40 mt-0.5">📍 {addr.landmark}</p>}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Wishlist */}
          <Card title="Wishlist" subtitle={`${customer.wishlist?.length || 0} items saved`} delay={0.15} action={<Heart className="w-4 h-4 text-red-400" />}>
            {customer.wishlist?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {customer.wishlist.map((item) => (
                  <span key={item} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cream border border-black/5 text-xs font-semibold text-dark/70">
                    <Heart className="w-3 h-3 text-red-400 fill-red-400" /> {item.replace(/-/g, ' ')}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-dark/40 font-light">No wishlist items yet.</p>
            )}
          </Card>

          {/* Notes */}
          <Card title="Customer Notes" delay={0.2}>
            <div className="space-y-3">
              {customer.notes?.length > 0 ? (
                customer.notes.map((n, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    className="flex items-start gap-2.5 rounded-xl bg-primary/5 border border-primary/10 px-3.5 py-3">
                    <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0"><StickyNote className="w-3.5 h-3.5" /></span>
                    <p className="flex-1 text-xs text-dark/70 leading-relaxed">{n}</p>
                    <button onClick={() => removeNote(customer._id, i)} className="w-6 h-6 rounded-full flex items-center justify-center text-dark/20 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </motion.div>
                ))
              ) : (
                <p className="text-xs text-dark/40 font-light">No notes yet.</p>
              )}
              <div className="flex gap-2">
                <input value={noteText} onChange={(e) => setNoteText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleNote()}
                  placeholder="Add a note about this customer…"
                  className="flex-1 h-10 px-3.5 rounded-xl bg-cream border border-black/8 text-sm text-dark placeholder:text-dark/30 focus:outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10 transition-all" />
                <button onClick={handleNote} disabled={!noteText.trim()} className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white flex items-center justify-center shadow-md shadow-primary/15 disabled:opacity-40 transition-all">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Card>
        </div>

        {/* RIGHT 1/3 */}
        <div className="space-y-5">
          {/* Profile */}
          <Card title="Profile" subtitle="Contact details" delay={0.05}>
            <div className="flex items-center gap-4 mb-4">
              <Avatar name={customer.name} size={56} ring />
              <div>
                <p className="text-base font-bold text-dark">{customer.name}</p>
                <p className="text-xs text-dark/45">{customer.email}</p>
              </div>
            </div>
            <div className="space-y-2.5">
              <a href={`tel:${customer.phone}`} className="flex items-center gap-2.5 text-xs text-dark/60 hover:text-primary transition-colors">
                <span className="w-7 h-7 rounded-lg bg-primary/8 text-primary flex items-center justify-center"><Phone className="w-3.5 h-3.5" /></span>
                {customer.phone}
              </a>
              <a href={`mailto:${customer.email}`} className="flex items-center gap-2.5 text-xs text-dark/60 hover:text-primary transition-colors">
                <span className="w-7 h-7 rounded-lg bg-primary/8 text-primary flex items-center justify-center"><Mail className="w-3.5 h-3.5" /></span>
                {customer.email}
              </a>
            </div>
          </Card>

          {/* Tag */}
          <Card title="Customer Tag" subtitle="Classification" delay={0.1}>
            <div className="grid grid-cols-2 gap-2">
              {CUSTOMER_TAGS.map((t) => {
                const active = customer.tag === t.value
                return (
                  <button key={t.value} onClick={() => updateTag(customer._id, t.value)}
                    className={`flex items-center gap-2 p-3 rounded-xl border-2 text-xs font-bold transition-all ${active ? 'border-primary bg-primary/5 text-primary' : 'border-black/8 text-dark/55 hover:border-primary/20'}`}>
                    <span className={`w-3 h-3 rounded-full ${t.dot}`} /> {t.label}
                  </button>
                )
              })}
            </div>
          </Card>

          {/* Activity summary */}
          <Card title="Activity" subtitle="Recent engagement" delay={0.15}>
            <div className="space-y-3">
              {[
                { icon: Clock, text: `Last active ${timeAgo(customer.lastActiveAt)}`, color: 'text-dark/40' },
                { icon: ShoppingBag, text: `${customer.totalOrders} orders placed`, color: 'text-primary' },
                { icon: Wallet, text: `${inr(customer.lifetimeSpend)} total spend`, color: 'text-emerald-600' },
                { icon: MapPin, text: `${customer.addresses?.length || 0} saved addresses`, color: 'text-blue-500' },
                { icon: Heart, text: `${customer.wishlist?.length || 0} wishlist items`, color: 'text-red-400' },
              ].map((a, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-cream flex items-center justify-center shrink-0"><a.icon className={`w-4 h-4 ${a.color}`} /></span>
                  <p className="text-xs text-dark/60">{a.text}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <AnimatePresence>
        {blockConfirm && (
          <ConfirmModal open
            icon={customer.blocked ? <ShieldCheck className="w-7 h-7 text-emerald-500" /> : <Ban className="w-7 h-7 text-red-500" />}
            title={customer.blocked ? `Unblock ${customer.name}?` : `Block ${customer.name}?`}
            message={customer.blocked ? 'This customer will be able to place orders again.' : 'This customer will not be able to place orders until unblocked.'}
            confirmLabel={customer.blocked ? 'Unblock' : 'Block'}
            tone={customer.blocked ? 'primary' : 'danger'}
            onClose={() => setBlockConfirm(false)}
            onConfirm={() => { toggleBlock(customer._id); setBlockConfirm(false) }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
