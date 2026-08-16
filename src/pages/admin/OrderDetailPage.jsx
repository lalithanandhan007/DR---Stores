import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, Printer, Download, CheckCircle2, XCircle, CookingPot, PackageCheck, Truck,
  Ban, Phone, Mail, MapPin, Wallet, MessageSquare, ClipboardList, StickyNote, Clock,
  Sparkles, RefreshCcw, History, AlertCircle, Send,
} from 'lucide-react'
import { useOrders } from '../../context/OrdersContext'
import { useCustomers } from '../../context/CustomersContext'
import { useToast } from '../../context/CartContext'
import OrderStatusBadge from '../../components/orders/OrderStatusBadge'
import PaymentBadge from '../../components/orders/PaymentBadge'
import OrderTimeline from '../../components/orders/OrderTimeline'
import InvoicePreview from '../../components/orders/InvoicePreview'
import ConfirmModal from '../../components/orders/ConfirmModal'
import AssignDeliveryModal from '../../components/orders/AssignDeliveryModal'
import Avatar from '../../components/account/Avatar'
import { inr, formatTime, formatDateTime, timeAgo } from '../../utils/format'
import { downloadOrderInvoice } from '../../utils/invoicePdf'

/* Contextual status actions per current order status */
const STATUS_ACTIONS = {
  pending: [
    { status: 'accepted', label: 'Accept Order', icon: CheckCircle2, tone: 'primary' },
    { status: 'cancelled', label: 'Reject Order', icon: XCircle, tone: 'danger' },
  ],
  accepted: [{ status: 'preparing', label: 'Mark Preparing', icon: CookingPot, tone: 'primary' }],
  preparing: [{ status: 'packed', label: 'Mark Packed', icon: PackageCheck, tone: 'primary' }],
  packed: [{ status: 'out_for_delivery', label: 'Mark Out for Delivery', icon: Truck, tone: 'primary', needsPartner: true }],
  out_for_delivery: [{ status: 'delivered', label: 'Mark Delivered', icon: CheckCircle2, tone: 'primary' }],
  delivered: [],
  cancelled: [],
  refunded: [],
}

function Card({ title, subtitle, action, children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white rounded-3xl border border-black/5 shadow-soft p-5 sm:p-6"
    >
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

export default function OrderDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getOrder, updateStatus, addNote, loading } = useOrders()
  const { getCustomer } = useCustomers()
  const { addToast } = useToast()
  const order = getOrder(id)
  const customerProfile = order ? getCustomer(order.customer._id) : null

  const [confirm, setConfirm] = useState(null) // { action: 'cancel' | 'reject' | 'refund' }
  const [assignOpen, setAssignOpen] = useState(false)
  const [noteText, setNoteText] = useState('')

  useEffect(() => { window.scrollTo(0, 0) }, [id])

  if (loading) {
    return (
      <div className="space-y-5">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="h-40 rounded-3xl bg-black/4 animate-pulse" />
        ))}
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-sm">
          <span className="w-16 h-16 mx-auto rounded-3xl bg-primary/8 flex items-center justify-center"><AlertCircle className="w-8 h-8 text-primary" /></span>
          <h2 className="mt-5 font-serif-display text-2xl font-bold text-dark">Order not found</h2>
          <p className="mt-2 text-sm text-dark/45 font-light">This order may have been deleted or the link is incorrect.</p>
          <Link to="/admin/orders" className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white text-sm font-bold shadow-md shadow-primary/15 hover:shadow-lg transition-all">
            <ArrowLeft className="w-4 h-4" /> Back to Orders
          </Link>
        </motion.div>
      </div>
    )
  }

  const actions = STATUS_ACTIONS[order.status] || []
  const canCancel = !['delivered', 'cancelled', 'refunded'].includes(order.status)
  const canRefund = order.status === 'cancelled' && (order.payment.status === 'paid' || order.payment.status === 'pending')
  const inTransit = ['pending', 'accepted', 'preparing', 'packed'].includes(order.status)

  const runStatus = (status) => {
    if (status === 'cancelled') setConfirm({ action: 'cancel' })
    else if (status === 'out_for_delivery' && !order.partner) {
      addToast('Assign a delivery partner first', 'info', 2600)
      setAssignOpen(true)
    } else updateStatus(order._id, status)
  }

  const runRefund = () => {
    updateStatus(order._id, 'refunded', 'Refund processed after cancellation')
    setConfirm(null)
  }

  const handleNote = () => {
    addNote(order._id, noteText)
    setNoteText('')
  }

  const discountRow = [
    { label: 'Subtotal', value: order.subtotal },
    ...(order.discount ? [{ label: `Discount (${order.coupon || 'coupon'})`, value: -order.discount, green: true }] : []),
    { label: 'Delivery Fee', value: order.deliveryFee },
    { label: 'Packaging Fee', value: order.packagingFee },
    ...(order.tax ? [{ label: 'Tax', value: order.tax }] : []),
  ]

  const actionBtn = (a) => (
    <button
      key={a.status}
      onClick={() => runStatus(a.status)}
      className={`inline-flex items-center gap-2 h-11 px-5 rounded-2xl text-xs font-bold transition-all ${
        a.tone === 'primary'
          ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-md shadow-primary/15 hover:shadow-lg hover:-translate-y-0.5'
          : 'bg-red-500 text-white shadow-md shadow-red-500/20 hover:bg-red-600 hover:-translate-y-0.5'
      }`}
    >
      <a.icon className="w-4 h-4" /> {a.label}
    </button>
  )

  return (
    <div className="space-y-5">
      {/* ============ HEADER ============ */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
        <button onClick={() => navigate('/admin/orders')} className="inline-flex items-center gap-1.5 text-xs font-bold text-dark/50 hover:text-primary transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> All Orders
        </button>

        <div className="mt-3 flex flex-wrap items-start gap-4">
          <div className="flex-1 min-w-[220px]">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="font-serif-display text-2xl sm:text-3xl font-bold text-dark tracking-tight">Order #{order._id}</h1>
              <OrderStatusBadge status={order.status} />
              {order.priority === 'high' && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-500 bg-red-50 border border-red-200 px-2.5 py-1 rounded-full">
                  <Sparkles className="w-3 h-3" /> Priority
                </span>
              )}
            </div>
            <p className="text-xs text-dark/45 mt-1.5 font-light">
              Placed {formatDateTime(order.createdAt)} ({timeAgo(order.createdAt)}) · {order.source} · {order.customer.name}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 ml-auto">
            {canRefund && (
              <button onClick={() => setConfirm({ action: 'refund' })} className="inline-flex items-center gap-2 h-11 px-4 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-200 text-xs font-bold hover:bg-indigo-100 transition-all">
                <RefreshCcw className="w-4 h-4" /> Process Refund
              </button>
            )}
            <button onClick={() => {
            try {
                downloadOrderInvoice(order)
                addToast('Invoice downloaded successfully', 'success', 2600)
                } catch (err) {
                addToast('Could not generate invoice', 'error', 3000)
             }
}} className="inline-flex items-center gap-2 h-11 px-4 rounded-2xl bg-white border border-black/8 text-xs font-bold text-dark/60 hover:border-primary/30 hover:text-primary transition-all">
              <Download className="w-4 h-4" /> Download
            </button>
            <button onClick={() => window.print()} className="inline-flex items-center gap-2 h-11 px-4 rounded-2xl bg-white border border-black/8 text-xs font-bold text-dark/60 hover:border-primary/30 hover:text-primary transition-all">
              <Printer className="w-4 h-4" /> Print Invoice
            </button>
          </div>
        </div>

        {/* Status action bar */}
        <AnimatePresence>
          {(actions.length > 0 || canCancel || canRefund) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
              className="mt-4 flex flex-wrap items-center gap-2.5 rounded-2xl bg-white border border-black/5 shadow-soft px-4 py-3"
            >
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-dark/45 mr-1">
                <span className={`relative flex w-2 h-2`}>
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-primary`} />
                  <span className="relative inline-flex rounded-full w-2 h-2 bg-primary" />
                </span>
                Next step
              </span>
              {actions.map(actionBtn)}
              {order.status === 'packed' && (
                <button onClick={() => setAssignOpen(true)} className="inline-flex items-center gap-2 h-11 px-4 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 text-xs font-bold hover:bg-blue-100 transition-all">
                  <Truck className="w-4 h-4" /> Assign Delivery Partner
                </button>
              )}
              {canCancel && (
                <button onClick={() => setConfirm({ action: 'cancel' })} className="inline-flex items-center gap-2 h-11 px-4 rounded-2xl text-xs font-bold text-red-500/80 hover:bg-red-50 hover:text-red-600 transition-all ml-auto">
                  <Ban className="w-4 h-4" /> Cancel Order
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ============ MAIN GRID ============ */}
      <div className="grid lg:grid-cols-3 gap-5 items-start">
        {/* LEFT 2/3 */}
        <div className="lg:col-span-2 space-y-5">
          {/* Timeline */}
          <Card title="Order Timeline" subtitle="Live journey of this order" delay={0.05}>
            <OrderTimeline timeline={order.timeline} />
          </Card>

          {/* Products */}
          <Card title={`Products (${order.items.length})`} subtitle="Items in this order" delay={0.1}>
            <div className="overflow-x-auto -mx-2 px-2">
              <table className="w-full text-left min-w-[520px]">
                <thead>
                  <tr className="border-b border-black/8">
                    {['Product', 'Qty', 'Weight', 'Price', 'Discount', 'Total'].map((h) => (
                      <th key={h} className="py-2.5 text-[10px] font-bold uppercase tracking-wider text-dark/35">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((it, i) => {
                    const itemDiscount = it.mrp > it.price ? (it.mrp - it.price) * it.qty : 0
                    return (
                      <motion.tr key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.05 }} className="border-b border-black/4 last:border-0">
                        <td className="py-3">
                          <span className="flex items-center gap-3">
                            <span className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0" style={{ background: `linear-gradient(135deg, ${it.gradient[0]}25, ${it.gradient[1]}12)` }}>
                              <span className="text-2xl">{it.emoji}</span>
                            </span>
                            <div>
                              <p className="text-sm font-bold text-dark">{it.name}</p>
                              <p className="text-[10px] text-dark/35">{it.productId}</p>
                            </div>
                          </span>
                        </td>
                        <td className="py-3 text-sm font-semibold text-dark/70">×{it.qty}</td>
                        <td className="py-3 text-sm text-dark/50">{it.weight || '—'}</td>
                        <td className="py-3 text-sm font-semibold text-dark">{inr(it.price)}</td>
                        <td className="py-3">
                          {itemDiscount > 0
                            ? <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg">{inr(itemDiscount)} off</span>
                            : <span className="text-xs text-dark/30">—</span>}
                        </td>
                        <td className="py-3 text-sm font-black text-dark">{inr(it.price * it.qty)}</td>
                      </motion.tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Invoice */}
          <Card title="Invoice" subtitle="Printable invoice for this order" delay={0.15} action={
            <div className="flex gap-2">
              <button onClick={() => {
  try {
    downloadOrderInvoice(order)
    addToast('Invoice downloaded successfully', 'success', 2600)
  } catch (err) {
    addToast('Could not generate invoice', 'error', 3000)
  }
}} className="inline-flex items-center gap-1.5 h-8 px-3 rounded-xl bg-white border border-black/8 text-[11px] font-bold text-dark/60 hover:border-primary/30 hover:text-primary transition-all">
                <Download className="w-3.5 h-3.5" /> Download
              </button>
              <button onClick={() => window.print()} className="inline-flex items-center gap-1.5 h-8 px-3 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white text-[11px] font-bold shadow-sm shadow-primary/15 transition-all">
                <Printer className="w-3.5 h-3.5" /> Print
              </button>
            </div>
          }>
            <InvoicePreview order={order} />
          </Card>
        </div>

        {/* RIGHT 1/3 */}
        <div className="space-y-5">
          {/* Customer */}
          <Card title="Customer" subtitle="Shopper profile" delay={0.05}>
            <div className="flex items-center gap-3.5">
              <Avatar name={order.customer.name} size={48} ring />
              <div className="min-w-0">
                <p className="text-sm font-bold text-dark truncate">{order.customer.name}</p>
                <p className="text-[11px] text-dark/45 truncate">{order.customer.email}</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2.5">
              <div className="rounded-2xl bg-cream p-3">
                <div className="flex items-center gap-1.5 text-dark/40"><History className="w-3.5 h-3.5" /><span className="text-[10px] font-bold uppercase tracking-wider">Previous Orders</span></div>
                <p className="mt-1 text-xl font-black text-dark">{customerProfile?.totalOrders ?? 'N/A'}</p>
              </div>
              <div className="rounded-2xl bg-cream p-3">
                <div className="flex items-center gap-1.5 text-dark/40"><Wallet className="w-3.5 h-3.5" /><span className="text-[10px] font-bold uppercase tracking-wider">Lifetime Spend</span></div>
                <p className="mt-1 text-xl font-black text-primary">{customerProfile ? inr(customerProfile.lifetimeSpend) : 'N/A'}</p>
              </div>
            </div>

            <div className="mt-3 space-y-2">
              <a href={`tel:${order.customer.phone}`} className="flex items-center gap-2.5 text-xs text-dark/60 hover:text-primary transition-colors">
                <span className="w-7 h-7 rounded-lg bg-primary/8 text-primary flex items-center justify-center"><Phone className="w-3.5 h-3.5" /></span>
                {order.customer.phone}
              </a>
              <a href={`mailto:${order.customer.email}`} className="flex items-center gap-2.5 text-xs text-dark/60 hover:text-primary transition-colors">
                <span className="w-7 h-7 rounded-lg bg-primary/8 text-primary flex items-center justify-center"><Mail className="w-3.5 h-3.5" /></span>
                {order.customer.email}
              </a>
              <div className="flex items-start gap-2.5 text-xs text-dark/60">
                <span className="w-7 h-7 rounded-lg bg-primary/8 text-primary flex items-center justify-center shrink-0"><MapPin className="w-3.5 h-3.5" /></span>
                <span className="leading-relaxed">
                  {order.address?.house}, {order.address?.street},<br />
                  {order.address?.locality}, {order.address?.city} — {order.address?.pincode}
                  {order.address?.landmark && <span className="block text-[11px] text-dark/40 mt-0.5">📍 {order.address.landmark}</span>}
                </span>
              </div>
            </div>

            <button
  onClick={() => {
    const phone = order?.customer?.phone

    if (phone) {
      const cleaned = phone.replace(/\D/g, '')
      const whatsappPhone = cleaned.length === 10 ? `91${cleaned}` : cleaned
      window.open(`https://wa.me/${whatsappPhone}`, '_blank', 'noopener,noreferrer')
    } else {
      addToast('This customer has no phone number', 'info', 2200)
    }
  }}
  className="mt-4 w-full h-10 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-primary/15 hover:shadow-lg transition-all"
>
  <MessageSquare className="w-4 h-4" /> Message Customer
</button>
          </Card>

          {/* Delivery */}
          <Card title="Delivery" subtitle="Slot & partner" delay={0.1} action={order.partner && (
            <button onClick={() => setAssignOpen(true)} className="text-[11px] font-bold text-primary hover:text-primary-dark">Change</button>
          )}>
            <div className="flex items-center gap-2.5 rounded-2xl bg-cream px-3.5 py-3 mb-3">
              <span className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center"><Clock className="w-4 h-4 text-primary" /></span>
              <div>
                <p className="text-xs font-bold text-dark">{order.delivery?.slot?.label}</p>
                <p className="text-[10px] text-dark/45">{order.delivery?.slot?.time} · Expected {formatTime(order.delivery?.expectedAt)}</p>
              </div>
            </div>

            {order.partner ? (
              <div className="space-y-2.5">
                <div className="flex items-center gap-3 p-3 rounded-2xl border border-primary/10 bg-primary/4">
                  <span className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center"><Truck className="w-5 h-5" /></span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-dark">{order.partner.name}</p>
                    <p className="text-[10px] text-dark/45 truncate">{order.partner.vehicle}</p>
                  </div>
                  <span className="ml-auto text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full shrink-0">★ {order.partner.rating}</span>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <a href={`tel:${order.partner.phone}`} className="inline-flex items-center justify-center gap-1.5 h-9 rounded-xl border border-black/8 text-[11px] font-bold text-dark/60 hover:border-primary/30 hover:text-primary transition-all">
                    <Phone className="w-3 h-3" /> Call
                  </a>
                  <button onClick={() => setAssignOpen(true)} className="inline-flex items-center justify-center gap-1.5 h-9 rounded-xl border border-black/8 text-[11px] font-bold text-dark/60 hover:border-primary/30 hover:text-primary transition-all">
                    <Truck className="w-3 h-3" /> Reassign
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={() => setAssignOpen(true)} className="w-full h-11 rounded-2xl border-2 border-dashed border-primary/25 text-xs font-bold text-primary hover:bg-primary/5 transition-all">
                + Assign Delivery Partner
              </button>
            )}

            {inTransit && (
              <p className="mt-3 text-[11px] text-dark/40 flex items-center gap-1.5">
                <span className="relative flex w-1.5 h-1.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" /><span className="relative inline-flex rounded-full w-1.5 h-1.5 bg-primary" /></span>
                {order.status === 'out_for_delivery' ? 'Out for delivery now' : 'Awaiting dispatch'}
              </p>
            )}
          </Card>

          {/* Payment */}
          <Card title="Payment" subtitle="Transaction summary" delay={0.15}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-bold text-dark">{order.payment.method}</p>
                <p className="text-[11px] text-dark/40 mt-0.5">{order.payment.ref ? `Ref: ${order.payment.ref}` : 'No transaction ref yet'}</p>
              </div>
              <PaymentBadge status={order.payment.status} />
            </div>
            <div className="rounded-2xl bg-cream p-3.5 space-y-1.5">
              {discountRow.map((r) => (
                <p key={r.label} className="flex items-center justify-between text-xs">
                  <span className={r.green ? 'text-emerald-600 font-medium' : 'text-dark/50'}>{r.label}</span>
                  <span className={`font-semibold ${r.green ? 'text-emerald-600' : 'text-dark/75'}`}>{r.value < 0 ? '− ' : ''}{inr(Math.abs(r.value))}</span>
                </p>
              ))}
              <div className="pt-2 mt-2 border-t border-dashed border-primary/20 flex items-center justify-between">
                <span className="text-sm font-bold text-dark/60">Grand Total</span>
                <span className="text-lg font-black text-primary">{inr(order.grandTotal)}</span>
              </div>
            </div>
          </Card>

          {/* Notes */}
          <Card title="Order Notes" subtitle="Admin & customer notes" delay={0.2}>
            <div className="space-y-4">
              <div>
                <p className="flex items-center gap-1.5 text-[11px] font-bold text-dark/55 mb-2"><ClipboardList className="w-3.5 h-3.5" /> Admin notes</p>
                {order.notes?.admin?.length > 0 ? (
                  <div className="space-y-2">
                    {order.notes.admin.map((n, i) => (
                      <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="flex items-start gap-2.5 rounded-xl bg-primary/5 border border-primary/10 px-3 py-2.5">
                        <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0"><StickyNote className="w-3 h-3" /></span>
                        <p className="text-xs text-dark/70 leading-relaxed">{n}</p>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-dark/30 font-light">No admin notes yet.</p>
                )}
                <div className="flex gap-2 mt-2">
                  <input
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleNote() }}
                    placeholder="Add a note for the team…"
                    className="flex-1 h-10 px-3.5 rounded-xl bg-cream border border-black/8 text-sm text-dark placeholder:text-dark/30 focus:outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10 transition-all"
                  />
                  <button onClick={handleNote} disabled={!noteText.trim()} className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white flex items-center justify-center shadow-md shadow-primary/15 disabled:opacity-40 transition-all">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-2xl bg-cream p-3.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-dark/40 mb-1">Customer note</p>
                  <p className="text-xs text-dark/70 leading-relaxed">{order.notes?.customer || '—'}</p>
                </div>
                <div className="rounded-2xl bg-amber-50/70 border border-amber-100 p-3.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600 mb-1">Special instructions</p>
                  <p className="text-xs text-dark/70 leading-relaxed">{order.notes?.special || '—'}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* ============ MODALS ============ */}
      <AnimatePresence>
        {confirm && (
          <ConfirmModal
            open
            icon={confirm.action === 'refund' ? <RefreshCcw className="w-7 h-7 text-primary" /> : <Ban className="w-7 h-7 text-red-500" />}
            title={confirm.action === 'reject' ? 'Reject this order?' : confirm.action === 'refund' ? 'Process refund?' : 'Cancel this order?'}
            message={confirm.action === 'refund'
              ? `${inr(order.grandTotal)} will be marked as refunded to ${order.customer.name}'s ${order.payment.method}.`
              : `Order #${order._id} worth ${inr(order.grandTotal)} will be ${confirm.action === 'reject' ? 'rejected' : 'cancelled'}.${order.payment.status === 'paid' ? ' Payment was already received — a refund will be required.' : ''}`}
            confirmLabel={confirm.action === 'refund' ? 'Process Refund' : confirm.action === 'reject' ? 'Reject Order' : 'Cancel Order'}
            tone={confirm.action === 'refund' ? 'primary' : 'danger'}
            onClose={() => setConfirm(null)}
            onConfirm={() => {
              if (confirm.action === 'refund') runRefund()
              else updateStatus(order._id, 'cancelled', confirm.action === 'reject' ? 'Rejected by store' : 'Cancelled by store')
              setConfirm(null)
            }}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>{assignOpen && <AssignDeliveryModal order={order} onClose={() => setAssignOpen(false)} />}</AnimatePresence>
    </div>
  )
}
