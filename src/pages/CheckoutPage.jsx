import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MapPin, Clock, ClipboardCheck, CreditCard, ChevronRight, Check, Plus, Trash2,
  Edit3, Home, Building2, Star, Truck, ArrowRight, ArrowLeft, ShieldCheck, Package,
} from 'lucide-react'
import { useCart, useToast, deliverySlots } from '../context/CartContext'
import Footer from '../components/Footer'

const steps = [
  { id: 1, label: 'Address', icon: MapPin },
  { id: 2, label: 'Slot', icon: Clock },
  { id: 3, label: 'Review', icon: ClipboardCheck },
  { id: 4, label: 'Payment', icon: CreditCard },
]

/* ========== PROGRESS BAR ========== */
function ProgressBar({ current }) {
  return (
    <div className="flex items-center gap-0 mb-10">
      {steps.map((step, i) => (
        <div key={step.id} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center">
            <motion.div
              animate={{ scale: current === step.id ? 1.1 : 1 }}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 ${
                current > step.id ? 'bg-primary text-white' : current === step.id ? 'bg-dark text-white shadow-lg' : 'bg-black/8 text-dark/40'
              }`}
            >
              {current > step.id ? <Check className="w-5 h-5" /> : <step.icon className="w-4.5 h-4.5" />}
            </motion.div>
            <span className={`text-[11px] font-semibold mt-1.5 ${current >= step.id ? 'text-dark' : 'text-dark/35'}`}>{step.label}</span>
          </div>
          {i < steps.length - 1 && (
            <div className="flex-1 h-0.5 mx-2 mb-5 rounded-full overflow-hidden bg-black/8">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: current > step.id ? '100%' : '0%' }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="h-full bg-primary"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

/* ========== ADDRESS FORM ========== */
function AddressForm({ address, onSave, onCancel }) {
  const [form, setForm] = useState(address || { type: 'home', name: '', phone: '', house: '', street: '', area: '', city: '', pincode: '', landmark: '' })
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const inputClass = "w-full h-11 px-4 rounded-xl bg-cream border border-black/8 text-sm text-dark placeholder:text-dark/30 focus:outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10 transition-all"

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="p-5 rounded-2xl bg-white border border-black/5">
      <div className="flex items-center justify-between mb-5">
        <h4 className="text-sm font-bold text-dark">{address ? 'Edit Address' : 'Add New Address'}</h4>
        <button onClick={onCancel} className="text-xs text-dark/40 hover:text-dark">Cancel</button>
      </div>

      {/* Type */}
      <div className="flex gap-2 mb-4">
        {[{ id: 'home', icon: Home, label: 'Home' }, { id: 'office', icon: Building2, label: 'Office' }, { id: 'other', icon: MapPin, label: 'Other' }].map((t) => (
          <button key={t.id} onClick={() => set('type', t.id)} className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
            form.type === t.id ? 'bg-dark text-white border-dark' : 'bg-cream text-dark/55 border-black/8 hover:border-dark/25'
          }`}>
            <t.icon className="w-3.5 h-3.5" /> {t.label}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <input className={inputClass} placeholder="Full Name" value={form.name} onChange={(e) => set('name', e.target.value)} />
        <input className={inputClass} placeholder="Phone Number" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
        <input className={inputClass} placeholder="House / Flat No." value={form.house} onChange={(e) => set('house', e.target.value)} />
        <input className={inputClass} placeholder="Street / Road" value={form.street} onChange={(e) => set('street', e.target.value)} />
        <input className={inputClass} placeholder="Area / Locality" value={form.area} onChange={(e) => set('area', e.target.value)} />
        <input className={inputClass} placeholder="City" value={form.city} onChange={(e) => set('city', e.target.value)} />
        <input className={inputClass} placeholder="Pincode" value={form.pincode} onChange={(e) => set('pincode', e.target.value)} />
        <input className={inputClass} placeholder="Landmark (optional)" value={form.landmark} onChange={(e) => set('landmark', e.target.value)} />
      </div>

      <motion.button whileTap={{ scale: 0.97 }} onClick={() => onSave(form)} className="mt-4 w-full h-11 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-colors">
        Save Address
      </motion.button>
    </motion.div>
  )
}

/* ========== STEP 1: ADDRESS ========== */
function AddressStep() {
  const { addresses, defaultAddressId, saveAddress, deleteAddress, setDefaultAddress } = useCart()
  const { addToast } = useToast()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)

  const handleSave = (form) => {
    saveAddress(form)
    addToast('Address saved', 'success')
    setShowForm(false)
    setEditing(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold text-dark">Delivery Address</h3>
        <button onClick={() => { setShowForm(true); setEditing(null) }} className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-dark transition-colors">
          <Plus className="w-4 h-4" /> Add New
        </button>
      </div>

      <AnimatePresence>
        {showForm && <AddressForm onSave={handleSave} onCancel={() => { setShowForm(false); setEditing(null) }} />}
        {editing && <AddressForm address={editing} onSave={handleSave} onCancel={() => { setEditing(null) }} />}
      </AnimatePresence>

      {addresses.length === 0 && !showForm && (
        <div className="text-center py-12">
          <MapPin className="w-12 h-12 text-dark/15 mx-auto mb-3" />
          <p className="text-sm text-dark/45">No saved addresses. Add one to continue.</p>
        </div>
      )}

      <div className="space-y-3">
        {addresses.map((addr) => (
          <motion.div key={addr.id} layout className={`p-4 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${
            defaultAddressId === addr.id ? 'border-primary bg-primary/5' : 'border-black/8 bg-white hover:border-primary/25'
          }`} onClick={() => setDefaultAddress(addr.id)}>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <span className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  addr.type === 'home' ? 'bg-primary/10 text-primary' : addr.type === 'office' ? 'bg-accent/10 text-accent' : 'bg-black/8 text-dark/50'
                }`}>
                  {addr.type === 'home' ? <Home className="w-5 h-5" /> : addr.type === 'office' ? <Building2 className="w-5 h-5" /> : <MapPin className="w-5 h-5" />}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-dark">{addr.name}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wide text-primary bg-primary/8 px-2 py-0.5 rounded-full">{addr.type}</span>
                    {defaultAddressId === addr.id && <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Default</span>}
                  </div>
                  <p className="text-xs text-dark/50 mt-1 leading-relaxed">
                    {addr.house}, {addr.street}, {addr.area}, {addr.city} - {addr.pincode}
                    {addr.landmark && ` (Near ${addr.landmark})`}
                  </p>
                  <p className="text-[11px] text-dark/35 mt-1">📞 {addr.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button onClick={(e) => { e.stopPropagation(); setEditing(addr) }} className="w-8 h-8 rounded-lg flex items-center justify-center text-dark/30 hover:text-primary hover:bg-primary/10 transition-colors">
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button onClick={(e) => { e.stopPropagation(); deleteAddress(addr.id); addToast('Address deleted', 'info') }} className="w-8 h-8 rounded-lg flex items-center justify-center text-dark/30 hover:text-red-500 hover:bg-red-50 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

/* ========== STEP 2: DELIVERY SLOT ========== */
function SlotStep() {
  const { selectedSlot, setSelectedSlot } = useCart()
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const slotGroups = [
    {
      title: 'Today',
      slots: [{ id: 'express', icon: '⚡', label: 'Express Delivery', time: '40 minutes', price: 30, desc: 'Get it delivered in 40 minutes' }],
    },
    {
      title: tomorrow.toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' }),
      slots: [
        { id: 'morning', icon: '🌅', label: 'Morning', time: '8:00 AM — 11:00 AM', price: 0, desc: 'Start your day fresh' },
        { id: 'afternoon', icon: '☀️', label: 'Afternoon', time: '12:00 PM — 3:00 PM', price: 0, desc: 'Midday delivery' },
        { id: 'evening', icon: '🌆', label: 'Evening', time: '5:00 PM — 8:00 PM', price: 0, desc: 'End your day right' },
      ],
    },
  ]

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-dark">Choose Delivery Slot</h3>
      {slotGroups.map((group) => (
        <div key={group.title}>
          <h4 className="text-xs font-bold uppercase tracking-wider text-dark/40 mb-3">{group.title}</h4>
          <div className="space-y-2">
            {group.slots.map((s) => (
              <motion.button
                key={s.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedSlot(s)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all duration-300 ${
                  selectedSlot?.id === s.id ? 'border-primary bg-primary/5 shadow-soft' : 'border-black/8 bg-white hover:border-primary/25'
                }`}
              >
                <span className="text-2xl">{s.icon}</span>
                <div className="flex-1">
                  <span className="text-sm font-bold text-dark block">{s.label}</span>
                  <span className="text-xs text-dark/45">{s.time}</span>
                  <span className="text-[11px] text-dark/35 block mt-0.5">{s.desc}</span>
                </div>
                <div className="text-right">
                  <span className={`text-sm font-bold ${s.price > 0 ? 'text-accent' : 'text-primary'}`}>{s.price > 0 ? `₹${s.price}` : 'Free'}</span>
                  {selectedSlot?.id === s.id && (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="block w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center mt-1 ml-auto">
                      <Check className="w-3 h-3" />
                    </motion.span>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

/* ========== STEP 3: ORDER REVIEW ========== */
function ReviewStep() {
  const { cartItems, subtotal, couponDiscount, deliveryFee, packagingFee, grandTotal, appliedCoupon, selectedSlot, defaultAddress } = useCart()

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-dark">Review Your Order</h3>

      {/* Products */}
      <div className="p-5 rounded-2xl bg-white border border-black/5">
        <h4 className="text-sm font-bold text-dark mb-3">Products ({cartItems.length})</h4>
        <div className="space-y-3">
          {cartItems.map(({ key, product, weight, qty }) => (
            <div key={key} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `linear-gradient(135deg, ${product.gradient[0]}25, ${product.gradient[1]}12)` }}>
                <span className="text-xl">{product.emoji}</span>
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-sm font-semibold text-dark block truncate">{product.name}</span>
                <span className="text-[11px] text-dark/40">{weight} × {qty}</span>
              </div>
              <span className="text-sm font-bold text-dark">₹{product.price * qty}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery */}
      <div className="p-5 rounded-2xl bg-white border border-black/5">
        <h4 className="text-sm font-bold text-dark mb-2">Delivery</h4>
        {selectedSlot && (
          <div className="flex items-center gap-2 text-sm text-dark/60">
            <span>{selectedSlot.icon}</span>
            <span>{selectedSlot.label} — {selectedSlot.time}</span>
            <span className={`font-bold ${selectedSlot.price > 0 ? 'text-accent' : 'text-primary'}`}>{selectedSlot.price > 0 ? `₹${selectedSlot.price}` : 'Free'}</span>
          </div>
        )}
        {defaultAddress && (
          <p className="text-xs text-dark/40 mt-1">{defaultAddress.house}, {defaultAddress.street}, {defaultAddress.city} - {defaultAddress.pincode}</p>
        )}
      </div>

      {/* Price breakdown */}
      <div className="p-5 rounded-2xl bg-white border border-black/5 space-y-2.5 text-sm">
        <div className="flex justify-between"><span className="text-dark/55">Subtotal</span><span className="font-semibold">₹{subtotal}</span></div>
        {couponDiscount > 0 && <div className="flex justify-between text-emerald-600"><span>Coupon ({appliedCoupon?.code})</span><span className="font-bold">-₹{couponDiscount}</span></div>}
        <div className="flex justify-between"><span className="text-dark/55">Delivery</span><span className={`font-semibold ${deliveryFee === 0 ? 'text-primary' : ''}`}>{deliveryFee === 0 ? 'Free' : `₹${deliveryFee}`}</span></div>
        <div className="flex justify-between"><span className="text-dark/55">Packaging</span><span className="font-semibold">₹{packagingFee}</span></div>
        <div className="h-px bg-black/8 my-1" />
        <div className="flex justify-between"><span className="text-base font-bold">Total</span><span className="text-xl font-black">₹{grandTotal}</span></div>
      </div>
    </div>
  )
}

/* ========== STEP 4: PAYMENT ========== */
function PaymentStep() {
  const [selected, setSelected] = useState('gpay')
  const { placeOrder, grandTotal } = useCart()
  const { addToast } = useToast()
  const navigate = useNavigate()
  const [placing, setPlacing] = useState(false)

  const methods = [
    { id: 'gpay', label: 'Google Pay', icon: '💳', color: '#4285F4', desc: 'Pay via UPI' },
    { id: 'phonepe', label: 'PhonePe', icon: '📱', color: '#5F259F', desc: 'Pay via UPI' },
    { id: 'paytm', label: 'Paytm', icon: '💰', color: '#00BAF2', desc: 'Pay via Wallet' },
    { id: 'card', label: 'Credit / Debit Card', icon: '💳', color: '#1B1B1B', desc: 'Visa, Mastercard, RuPay' },
    { id: 'cod', label: 'Cash on Delivery', icon: '💵', color: '#2E7D32', desc: 'Pay when delivered' },
    { id: 'wallet', label: 'D.R.STORES Wallet', icon: '👛', color: '#FF9800', desc: 'Balance: ₹0' },
  ]

  const handlePay = () => {
    setPlacing(true)
    setTimeout(() => {
      const order = placeOrder()
      addToast('Order placed successfully!', 'success')
      navigate('/payment-success', { state: { order } })
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-dark">Select Payment Method</h3>

      <div className="space-y-2">
        {methods.map((m) => (
          <motion.button
            key={m.id}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelected(m.id)}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all duration-300 ${
              selected === m.id ? 'border-primary bg-primary/5 shadow-soft' : 'border-black/8 bg-white hover:border-primary/25'
            }`}
          >
            <span className="text-2xl">{m.icon}</span>
            <div className="flex-1">
              <span className="text-sm font-bold text-dark block">{m.label}</span>
              <span className="text-[11px] text-dark/40">{m.desc}</span>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
              selected === m.id ? 'border-primary bg-primary' : 'border-black/20'
            }`}>
              {selected === m.id && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-2 h-2 rounded-full bg-white" />}
            </div>
          </motion.button>
        ))}
      </div>

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={handlePay}
        disabled={placing}
        className="mt-4 w-full h-14 rounded-2xl bg-gradient-to-r from-primary via-secondary to-primary text-white text-base font-bold flex items-center justify-center gap-2 shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60"
      >
        {placing ? (
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-6 h-6 border-3 border-white border-t-transparent rounded-full" />
        ) : (
          <>
            Pay ₹{grandTotal}
            <ShieldCheck className="w-5 h-5" />
          </>
        )}
      </motion.button>

      <p className="text-center text-[11px] text-dark/35">🔒 Your payment is secured with 256-bit SSL encryption</p>
    </div>
  )
}

/* ========== CHECKOUT PAGE ========== */
export default function CheckoutPage() {
  const [step, setStep] = useState(1)
  const { cartItems, defaultAddress, selectedSlot } = useCart()

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-cream pt-28 flex items-center justify-center">
        <div className="text-center">
          <span className="text-7xl mb-5 block">🛒</span>
          <h1 className="text-2xl font-bold text-dark/65">Your cart is empty</h1>
          <Link to="/vegetables" className="mt-5 inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-primary to-primary-dark text-white font-bold text-sm hover:shadow-cta transition-all">
            <ArrowLeft className="w-4 h-4" /> Browse Vegetables
          </Link>
        </div>
      </div>
    )
  }

  const canNext = () => {
    if (step === 1) return defaultAddress
    if (step === 2) return selectedSlot
    return true
  }

  return (
    <div className="min-h-screen bg-cream pt-28">
      <div className="max-w-3xl mx-auto px-5 sm:px-8">
        <motion.nav initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-sm text-dark/40 mb-6">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/cart" className="hover:text-primary transition-colors">Cart</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-dark/65 font-medium">Checkout</span>
        </motion.nav>

        <ProgressBar current={step} />

        <motion.div
          key={step}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.35 }}
          className="bg-white rounded-3xl border border-black/5 p-6 sm:p-8 shadow-soft mb-10"
        >
          {step === 1 && <AddressStep />}
          {step === 2 && <SlotStep />}
          {step === 3 && <ReviewStep />}
          {step === 4 && <PaymentStep />}
        </motion.div>

        {step < 4 && (
          <div className="flex items-center justify-between mb-16">
            <button
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              disabled={step === 1}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-dark/60 hover:text-dark border border-black/8 hover:border-black/15 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setStep((s) => Math.min(4, s + 1))}
              disabled={!canNext()}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white text-sm font-bold shadow-lg shadow-primary/15 hover:shadow-xl hover:shadow-primary/25 hover:-translate-y-0.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continue <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
