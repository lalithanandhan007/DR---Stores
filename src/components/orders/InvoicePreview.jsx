import { Leaf } from 'lucide-react'
import { inr, formatDateTime } from '../../utils/format'
import PaymentStatusBadge from '../ui/PaymentStatusBadge'

/* Premium invoice card. `id="invoice-print"` is the print target — the
   @media print rules in index.css hide everything else on the page. */
export default function InvoicePreview({ order }) {
  if (!order) return null

  const rows = [
    { label: 'Subtotal', value: order.subtotal },
    { label: 'Discount', value: -order.discount, muted: !!order.discount },
    { label: 'Delivery Fee', value: order.deliveryFee },
    { label: 'Packaging Fee', value: order.packagingFee },
    { label: 'Tax', value: order.tax },
  ]

  return (
    <div id="invoice-print" className="bg-white rounded-3xl border border-black/5 shadow-soft overflow-hidden">
      {/* Header */}
      <div className="relative px-6 sm:px-8 pt-6 sm:pt-8 pb-5 bg-gradient-to-br from-primary-dark via-primary to-secondary">
        <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full border border-white/10 spin-slow" />
        <div className="relative flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </span>
            <div>
              <p className="font-serif-display font-extrabold text-white text-lg leading-none">D.R<span className="text-accent-light">.</span>STORES</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/60 mt-1">Farm Fresh Grocery</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-wider text-white/50">Invoice</p>
            <p className="text-sm font-black text-white">#{order._id}</p>
            <p className="text-[10px] text-white/60 mt-0.5">{formatDateTime(order.createdAt)}</p>
          </div>
        </div>
      </div>

      {/* Bill to / from */}
      <div className="grid sm:grid-cols-2 gap-5 px-6 sm:px-8 py-5 border-b border-black/5">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-dark/35 mb-1.5">Billed to</p>
          <p className="text-sm font-bold text-dark">{order.customer.name}</p>
          <p className="text-xs text-dark/50 mt-0.5">{order.customer.phone}</p>
          <p className="text-xs text-dark/50 mt-0.5">{order.customer.email}</p>
          <p className="text-xs text-dark/50 mt-1 leading-relaxed">
            {order.address?.house}, {order.address?.street}<br />
            {order.address?.locality}, {order.address?.city} — {order.address?.pincode}
          </p>
        </div>
        <div className="sm:text-right">
          <p className="text-[10px] font-bold uppercase tracking-wider text-dark/35 mb-1.5">From</p>
          <p className="text-sm font-bold text-dark">D.R.STORES — Main Road</p>
          <p className="text-xs text-dark/50 mt-0.5">GSTIN: 33ABCDE1234F1Z5</p>
          <p className="text-xs text-dark/50 mt-0.5">+91 98765 43210</p>
          <p className="text-xs text-dark/50 mt-0.5">orders@drstores.com</p>
        </div>
      </div>

      {/* Items */}
      <div className="px-6 sm:px-8 py-5">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-black/8">
              {['Item', 'Qty', 'Weight', 'Rate', 'Amount'].map((h) => (
                <th key={h} className={`py-2.5 text-[10px] font-bold uppercase tracking-wider text-dark/35 ${h === 'Item' ? 'text-left' : 'text-right'}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {order.items.map((it, i) => (
              <tr key={i} className="border-b border-black/4 last:border-0">
                <td className="py-3">
                  <span className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `linear-gradient(135deg, ${it.gradient[0]}22, ${it.gradient[1]}12)` }}>
                      <span className="text-base">{it.emoji}</span>
                    </span>
                    <span className="text-xs font-bold text-dark">{it.name}</span>
                  </span>
                </td>
                <td className="py-3 text-right text-xs font-semibold text-dark/70">{it.qty}</td>
                <td className="py-3 text-right text-xs text-dark/45">{it.weight || '—'}</td>
                <td className="py-3 text-right text-xs text-dark/60">{inr(it.price)}</td>
                <td className="py-3 text-right text-xs font-bold text-dark">{inr(it.price * it.qty)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="grid sm:grid-cols-2 gap-5 px-6 sm:px-8 pb-6">
        <div className="space-y-2 text-sm">
          <p className="flex items-center justify-between gap-3 text-dark/60"><span className="text-xs">Payment method</span><span className="font-semibold text-dark">{order.payment?.method}</span></p>
          <p className="flex items-center justify-between gap-3 text-dark/60"><span className="text-xs">Payment status</span>
            <PaymentStatusBadge status={order.payment?.status} />
          </p>
          {order.payment?.ref && (
            <p className="flex items-center justify-between gap-3 text-dark/60"><span className="text-xs">Transaction</span><span className="font-mono text-[11px] font-semibold text-dark/70">{order.payment.ref}</span></p>
          )}
          {order.coupon && (
            <p className="flex items-center justify-between gap-3 text-dark/60"><span className="text-xs">Coupon applied</span><span className="text-[11px] font-bold text-primary bg-primary/8 px-2 py-0.5 rounded-lg">{order.coupon}</span></p>
          )}
        </div>
        <div className="sm:text-right">
          <div className="space-y-1.5">
            {rows.filter((r) => r.value !== 0 || r.label === 'Subtotal').map((r) => (
              <p key={r.label} className="flex justify-between sm:justify-end gap-3 text-xs">
                <span className={r.muted ? 'text-emerald-600 font-medium' : 'text-dark/50'}>{r.label}{r.muted ? ' (saved)' : ''}</span>
                <span className={`font-semibold ${r.muted ? 'text-emerald-600' : 'text-dark/75'}`}>{r.value < 0 ? '− ' : ''}{inr(Math.abs(r.value))}</span>
              </p>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t-2 border-dashed border-primary/20 flex items-center justify-between sm:justify-end gap-3">
            <span className="text-sm font-bold text-dark/60">Grand Total</span>
            <span className="text-xl font-black text-primary">{inr(order.grandTotal)}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 sm:px-8 py-4 bg-cream/80 border-t border-black/5 text-center">
        <p className="text-[11px] text-dark/40 font-light">
          Thank you for shopping with D.R.STORES! 🍃 This is a computer-generated invoice and does not require a physical signature.
        </p>
      </div>
    </div>
  )
}
