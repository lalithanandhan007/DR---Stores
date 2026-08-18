import { useEffect } from 'react'
import InvoicePreview from './InvoicePreview'

export default function BulkInvoicePrint({ orders, onDone }) {
  useEffect(() => {
    if (!orders?.length) return

    const timer = setTimeout(() => {
      window.print()
    }, 400)

    const handleAfterPrint = () => {
      onDone?.()
    }

    window.addEventListener('afterprint', handleAfterPrint)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('afterprint', handleAfterPrint)
    }
  }, [orders, onDone])

  if (!orders?.length) return null

  return (
    <div id="bulk-invoice-print">
      {orders.map((order, index) => (
        <div
          key={order._id || order.id || index}
          className={index < orders.length - 1 ? 'bulk-invoice-page-break' : ''}
        >
          <InvoicePreview order={order} />
        </div>
      ))}
    </div>
  )
}