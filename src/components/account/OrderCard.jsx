import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Package, Repeat, FileText, ChevronDown, MapPin, Clock, X, Check,
  ShoppingBag, Truck, CookingPot, CircleCheckBig, Ban,
} from 'lucide-react'
import { useCart, useToast } from '../../context/CartContext'
import { downloadOrderInvoice } from '../../utils/invoicePdf'
import PaymentStatusBadge from '../ui/PaymentStatusBadge'

const TIMELINE = [
  { key: 'placed', label: 'Placed', icon: Package },
  { key: 'preparing', label: 'Preparing', icon: CookingPot },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: CircleCheckBig },
]

const STAGE_INDEX = { confirmed: 1, preparing: 2, out_for_delivery: 3, delivered: 4, cancelled: 0 }

function StatusBadge({ status }) {
  const styles = {
    delivered: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    preparing: 'bg-amber-50 text-amber-600 border-amber-200',
    out_for_delivery: 'bg-blue-50 text-blue-600 border-blue-200',
    confirmed: 'bg-primary/8 text-primary border-primary/15',
    cancelled: 'bg-red-50 text-red-500 border-red-200',
  }
  const labels = {
    delivered: 'Delivered',
    preparing: 'Preparing',
    out_for_delivery: 'Out for Delivery',
    confirmed: 'Confirmed',
    cancelled: 'Cancelled',
  }
  return (
    <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full border ${styles[status] || styles.confirmed}`}>
      {status === 'cancelled' ? <Ban className="w-3 h-3" /> : <span className="w-1.5 h-1.5 rounded-full bg-current" />}
      {labels[status] || 'Confirmed'}
    </span>
  )
}

function Timeline({ status }) {
  const stage = STAGE_INDEX[status] ?? 0
  const cancelled = status === 'cancelled'
  return (
    <div className="flex items-center w-full my-2">
      {TIMELINE.map((step, i) => {
        const done = !cancelled && i < stage
        const current = !cancelled && i === stage - 1
        const reached = !cancelled && i < stage
        return (
          <div key={step.key} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <motion.div
                animate={{ scale: current ? 1.12 : 1 }}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-500 ${
                  cancelled ? 'bg-black/6 text-dark/30' : done ? 'bg-primary text-white' : current ? 'bg-dark text-white' : 'bg-black/6 text-dark/30'
                }`}
              >
                {done ? <Check className="w-3.5 h-3.5" /> : <step.icon className="w-3.5 h-3.5" />}
              </motion.div>
              <span className={`text-[9px] font-semibold mt-1 hidden sm:block ${reached ? 'text-dark/70' : 'text-dark/30'}`}>{step.label}</span>
            </div>
            {i < TIMELINE.length - 1 && (
              <div className="flex-1 h-0.5 mx-1.5 sm:mx-2 mb-0 rounded-full bg-black/8 overflow-hidden">
                {!cancelled && (
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: stage > i + 1 ? '100%' : '0%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    className="h-full bg-primary"
                  />
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function InvoiceModal({ order, onClose }) {
  const paymentStatus = order.payment?.status

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-dark/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8"
      >
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-dark/30 hover:bg-black/5 transition-colors">
          <X className="w-4 h-4" />
        </button>

        <div className="text-center mb-6">
          <span className="w-14 h-14 mx-auto rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3">
            <FileText className="w-6 h-6" />
          </span>
          <h3 className="font-serif-display text-2xl font-bold text-dark">Invoice</h3>
          <p className="text-xs text-dark/45 mt-1">Order <b className="text-dark">{order.id}</b></p>
          <p className="text-[11px] text-dark/40">{new Date(order.date).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</p>
        </div>

        {/* Payment status in invoice header */}
        {paymentStatus && (
          <div className="mb-4 flex items-center justify-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-dark/40 mr-2">Payment:</span>
            <PaymentStatusBadge status={paymentStatus} />
          </div>
        )}

        <div className="space-y-2.5 text-sm border-t border-dashed border-black/10 pt-4">
          {order.items?.map(({ product, weight, qty }) => (
            <div key={`${product.id}-${weight}`} className="flex items-center gap-3">
              <span className="text-lg">{product.emoji}</span>
              <span className="flex-1 text-dark/70 truncate">{product.name} <span className="text-dark/35 text-xs">× {qty} {weight}</span></span>
              <span className="font-semibold text-dark">₹{product.price * qty}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-dashed border-black/10 mt-4 pt-4 space-y-2 text-sm">
          <div className="flex justify-between text-dark/55"><span>Subtotal</span><span>₹{order.subtotal}</span></div>
          {order.couponDiscount > 0 && <div className="flex justify-between text-emerald-600"><span>Coupon {order.coupon ? `(${order.coupon})` : ''}</span><span>-₹{order.couponDiscount}</span></div>}
          <div className="flex justify-between text-dark/55"><span>Delivery</span><span>{order.deliveryFee === 0 ? 'Free' : `₹${order.deliveryFee}`}</span></div>
          <div className="flex justify-between text-dark/55"><span>Packaging</span><span>₹{order.packagingFee}</span></div>
          <div className="flex justify-between text-base font-black text-dark pt-2 border-t border-black/5"><span>Grand Total</span><span>₹{order.grandTotal}</span></div>
        </div>

        {order.address && (
          <div className="mt-4 rounded-xl bg-cream p-3 flex items-start gap-2 text-xs text-dark/55">
            <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <span>{order.address.name} — {order.address.house}, {order.address.street}, {order.address.city} - {order.address.pincode}</span>
          </div>
        )}

        <div className="mt-6 text-center text-[11px] text-dark/35">Thank you for shopping with D.R.STORES 🌱</div>
      </motion.div>
    </motion.div>
  )
}

export default function OrderCard({ order, index }) {
  const { addItem } = useCart()
  const { addToast } = useToast()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [showInvoice, setShowInvoice] = useState(false)

  const dateLabel = new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  const totalItems = (order.items || []).reduce((s, i) => s + i.qty, 0)

  const repeatOrder = () => {
    order.items?.forEach(({ product, weight, qty }) => addItem(product, weight, qty))
    addToast('Items added back to your cart', 'success')
    navigate('/cart')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="bg-white rounded-3xl border border-black/5 shadow-soft p-5 sm:p-6"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <div className="flex items-center gap-3">
          <span className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary/12 to-secondary/12 text-primary flex items-center justify-center">
            <Package className="w-5 h-5" />
          </span>
          <div>
            <p className="text-sm font-bold text-dark">#{order.id}</p>
            <p className="text-[11px] text-dark/40">{dateLabel} · {totalItems} item{totalItems > 1 ? 's' : ''}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={order.status} />
          {order.payment?.status && (
            <PaymentStatusBadge status={order.payment.status} />
          )}
        </div>
      </div>

      {/* Timeline */}
      <div className="mt-4 px-1"><Timeline status={order.status} /></div>

      {/* Items preview */}
      <div className="flex items-center gap-2 flex-wrap mt-3">
      {order.items?.slice(0, 6).map((item, index) => (
  <span
    key={`${item.productId || index}-${item.weight || ''}`}
    className="inline-flex items-center gap-1.5 bg-cream rounded-full pl-2 pr-3 py-1 border border-black/5"
  >
    <span className="text-base">{item.emoji || '🥬'}</span>
    <span className="text-[11px] text-dark/60 font-medium">
      {(item.name || 'Product').split(' ').slice(0, 2).join(' ')}
    </span>
    <span className="text-[10px] text-dark/30">×{item.qty || 0}</span>
  </span>
))}
        {(order.items?.length || 0) > 6 && <span className="text-[11px] text-dark/35">+{(order.items?.length || 0) - 6} more</span>}
      </div>

      {/* Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 mt-5 pt-4 border-t border-black/5">
        <div className="flex items-center gap-2">
          <span className="text-xs text-dark/40">Total</span>
          <span className="text-lg font-black text-dark">₹{order.grandTotal}</span>
        </div>
        <div className="flex items-center gap-2">
          {order.status !== 'cancelled' && (
            <button
            onClick={() => {
              try {
                downloadOrderInvoice(order)
                addToast('Invoice downloaded successfully', 'success')
              } catch (err) {
                addToast('Could not generate invoice', 'error')
              }
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-black/8 text-xs font-bold text-dark/60 hover:border-primary/30 hover:text-primary transition-all duration-300"
          >
            <FileText className="w-3.5 h-3.5" /> Invoice
          </button>
          )}
          
          <button onClick={() => setOpen((o) => !o)} className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-black/8 text-xs font-bold text-dark/60 hover:border-primary/30 hover:text-primary transition-all duration-300">
            Details <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Expandable details */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-4 pt-4 border-t border-dashed border-black/8 grid sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-dark/35 mb-2">Items</p>
                <div className="space-y-2">
                {order.items?.map((item, index) => (
  <div
    key={`${item.productId || index}-${item.weight || ''}`}
    className="flex items-center gap-2.5"
  >
    <span className="text-base">{item.emoji || '🥬'}</span>

    <span className="flex-1 text-dark/70 truncate text-xs">
      {item.name || 'Product'} · {item.weight || ''}
    </span>

    <span className="text-xs font-semibold text-dark">
      ₹{(Number(item.price) || 0) * Number(item.qty || 0)}
    </span>
  </div>
))}
                </div>
              </div>
              <div className="space-y-2.5">
                {order.payment?.status && (
                  <div className="flex items-center justify-between text-xs text-dark/55">
                    <span>Payment Status</span>
                    <PaymentStatusBadge status={order.payment.status} />
                  </div>
                )}
                <div className="flex justify-between text-xs text-dark/55"><span>Subtotal</span><span>₹{order.subtotal}</span></div>
                {order.couponDiscount > 0 && <div className="flex justify-between text-xs text-emerald-600"><span>Coupon</span><span>-₹{order.couponDiscount}</span></div>}
                <div className="flex justify-between text-xs text-dark/55"><span>Delivery</span><span>{order.deliveryFee === 0 ? 'Free' : `₹${order.deliveryFee}`}</span></div>
                <div className="flex justify-between text-xs text-dark/55"><span>Packaging</span><span>₹{order.packagingFee}</span></div>
                {order.slot && (
                  <div className="flex items-center gap-1.5 text-xs text-dark/45">
                    <Clock className="w-3.5 h-3.5" /> {order.slot.label} — {order.slot.time}
                  </div>
                )}
                {order.address && (
                  <div className="flex items-start gap-1.5 text-xs text-dark/45">
                    <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" /> {order.address.house}, {order.address.city}
                  </div>
                )}
              </div>
            </div>
            <div className="mt-4">
              <Link to="/vegetables" className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-dark">
                <ShoppingBag className="w-3.5 h-3.5" /> Continue shopping
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>{showInvoice && <InvoiceModal order={order} onClose={() => setShowInvoice(false)} />}</AnimatePresence>
    </motion.div>
  )
}
