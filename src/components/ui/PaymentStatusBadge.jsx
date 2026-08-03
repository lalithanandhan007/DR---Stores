/* Reusable payment-status pill for server payment statuses.
   Simplified version of the orders PaymentBadge — plain span (no motion)
   so it drops cleanly into tables, cards and the success page. */
const PAYMENT_STATUS_STYLES = {
  paid: { label: 'Paid', cls: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
  pending: { label: 'Pending', cls: 'bg-amber-50 text-amber-600 border-amber-200' },
  failed: { label: 'Failed', cls: 'bg-red-50 text-red-500 border-red-200' },
  cod: { label: 'COD', cls: 'bg-blue-50 text-blue-600 border-blue-200' },
  expired: { label: 'Expired', cls: 'bg-gray-100 text-gray-500 border-gray-200' },
  refunded: { label: 'Refunded', cls: 'bg-gray-100 text-gray-500 border-gray-200' },
}

export default function PaymentStatusBadge({ status, size = 'sm' }) {
  const meta = PAYMENT_STATUS_STYLES[status] || PAYMENT_STATUS_STYLES.pending
  const sizing = size === 'xs' ? 'text-[9px] px-2 py-0.5' : 'text-[10px] px-2.5 py-1'
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border font-bold whitespace-nowrap ${meta.cls} ${sizing}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {meta.label}
    </span>
  )
}
