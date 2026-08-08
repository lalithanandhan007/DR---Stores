import { jsPDF } from 'jspdf'
import { autoTable } from 'jspdf-autotable'

/* ====================================================================
   D.R.STORES — client-side invoice PDF generator.

   Builds a branded A4 invoice from the server-shaped order document
   (the same shape the admin Order Detail page renders). The rupee glyph
   (₹) is not in jsPDF's built-in WinAnsi fonts, so amounts are prefixed
   with "Rs." to keep the PDF dependency-light (no embedded TTF).
   ==================================================================== */

const BRAND_GREEN = [46, 125, 50]        // #2E7D32 (primary)
const BRAND_DARK = [27, 94, 32]          // #1B5E20 (primary-dark)
const BRAND_ACCENT = [255, 152, 0]       // #FF9800
const INK = [30, 30, 30]
const MUTED = [120, 120, 120]

const PAYMENT_LABELS = {
  paid: 'Paid',
  pending: 'Pending',
  failed: 'Failed',
  cod: 'Cash on Delivery',
  refunded: 'Refunded',
  expired: 'Expired',
}

const PAYMENT_METHODS = {
  UPI: 'UPI',
  Card: 'Card',
  NetBanking: 'Net Banking',
  Wallet: 'Wallet',
  'Cash on Delivery': 'Cash on Delivery',
}

const inr = (n) => `Rs. ${Number(n || 0).toLocaleString('en-IN')}`
const stripEmoji = (s = '') => s.replace(/[\u{1F000}-\u{1FFFF}☀-➿️]/gu, '').replace(/\s+/g, ' ').trim()

export function downloadOrderInvoice(order) {
  if (!order) throw new Error('No order data to generate an invoice from')

  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const pageW = doc.internal.pageSize.getWidth()
  const pageH = doc.internal.pageSize.getHeight()
  const M = 14 // margin

  const orderId = order._id || order.id || 'N/A'
  const createdAt = order.createdAt || order.date
  const dateStr = createdAt
    ? new Date(createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
    : '—'

  const customer = order.customer || {}
  const address = order.address || {}
  const payment = order.payment || {}
  const slot = order.delivery?.slot || order.slot

  const addrLines = [
    address.name || customer.name,
    [address.house, address.street || address.locality].filter(Boolean).join(', '),
    [address.city, address.pincode].filter(Boolean).join(' - '),
    address.landmark,
  ].filter(Boolean)

  /* ---------- Header band ---------- */
  doc.setFillColor(...BRAND_DARK)
  doc.rect(0, 0, pageW, 34, 'F')
  doc.setFillColor(...BRAND_GREEN)
  doc.rect(0, 34, pageW, 2.5, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(20)
  doc.text('D.R.STORES', M, 14)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text('FARM FRESH GROCERY', M, 20)
  doc.setFontSize(8)
  doc.setTextColor(255, 255, 255, 0.85)
  doc.text('Fresh vegetables & daily essentials, delivered to your doorstep.', M, 25)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.setTextColor(255, 255, 255)
  doc.text('INVOICE', pageW - M, 14, { align: 'right' })
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text(`Invoice #${orderId}`, pageW - M, 21, { align: 'right' })
  doc.text(dateStr, pageW - M, 26, { align: 'right' })

  /* ---------- Bill To / From ---------- */
  let y = 46
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(...BRAND_GREEN)
  doc.text('BILLED TO', M, y)
  doc.setTextColor(...MUTED)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  y += 4.5
  doc.setTextColor(...INK)
  doc.text(customer.name || address.name || 'Customer', M, y)
  y += 4.5
  if (customer.phone) { doc.text(`Phone: ${customer.phone}`, M, y); y += 4.5 }
  if (customer.email) { doc.text(`Email: ${customer.email}`, M, y); y += 4.5 }
  addrLines.forEach((line) => { doc.text(line, M, y); y += 4.5 })

  // From block (right)
  let fy = 46
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(...BRAND_GREEN)
  doc.text('FROM', pageW - M, fy, { align: 'right' })
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...INK)
  fy += 4.5
  doc.text('D.R.STORES', pageW - M, fy, { align: 'right' }); fy += 4.5
  doc.text('Anna Nagar, Chennai', pageW - M, fy, { align: 'right' }); fy += 4.5
  doc.text('support@drstores.com', pageW - M, fy, { align: 'right' }); fy += 4.5
  doc.text('+91 90000 00000', pageW - M, fy, { align: 'right' })

  /* ---------- Items table ---------- */
  const items = Array.isArray(order.items) && order.items.length
    ? order.items
    : [{ name: order.title || 'Order items', qty: 1, weight: '', price: order.grandTotal }]

  autoTable(doc, {
    startY: Math.max(y, fy) + 8,
    margin: { left: M, right: M },
    head: [['Item', 'Qty', 'Weight', 'Rate', 'Amount']],
    body: items.map((it) => [
      stripEmoji(it.name || it.title || it.productId || 'Item'),
      String(it.qty || 1),
      it.weight || '—',
      inr(it.price),
      inr((it.price || 0) * (it.qty || 1)),
    ]),
    theme: 'grid',
    styles: { font: 'helvetica', fontSize: 8.5, textColor: INK, cellPadding: 2.2 },
    headStyles: { fillColor: BRAND_GREEN, textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 8.5 },
    alternateRowStyles: { fillColor: [248, 250, 248] },
    columnStyles: {
      0: { cellWidth: 'auto' },
      1: { cellWidth: 14, halign: 'center' },
      2: { cellWidth: 22, halign: 'center' },
      3: { cellWidth: 24, halign: 'right' },
      4: { cellWidth: 26, halign: 'right' },
    },
    didDrawPage: () => {
      // Branding footer strip on every page
      doc.setFillColor(...BRAND_GREEN)
      doc.rect(0, pageH - 6, pageW, 6, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(7)
      doc.text('D.R.STORES · Farm Fresh Grocery · support@drstores.com', pageW / 2, pageH - 2.6, { align: 'center' })
    },
  })

  /* ---------- Totals ---------- */
  const after = doc.lastAutoTable.finalY + 8
  const rightX = pageW - M
  const labelX = rightX - 78

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...MUTED)
  doc.text('Subtotal', labelX, after)
  doc.setTextColor(...INK)
  doc.text(inr(order.subtotal), rightX, after, { align: 'right' })

  let ty = after + 5
  if (order.discount > 0) {
    doc.setTextColor(...MUTED)
    doc.text('Discount', labelX, ty)
    doc.setTextColor(46, 125, 50)
    doc.text(`- ${inr(order.discount)}`, rightX, ty, { align: 'right' })
    ty += 5
  }
  doc.setTextColor(...MUTED)
  doc.text('Delivery Fee', labelX, ty)
  doc.setTextColor(...INK)
  doc.text(order.deliveryFee === 0 ? 'Free' : inr(order.deliveryFee), rightX, ty, { align: 'right' })
  ty += 5
  doc.text('Packaging Fee', labelX, ty)
  doc.text(inr(order.packagingFee), rightX, ty, { align: 'right' })
  ty += 5
  if (order.tax > 0) {
    doc.text('Tax', labelX, ty)
    doc.text(inr(order.tax), rightX, ty, { align: 'right' })
    ty += 5
  }

  // Grand total band
  ty += 3
  doc.setFillColor(...BRAND_GREEN)
  doc.roundedRect(labelX, ty - 4.5, rightX - labelX, 8, 1.6, 1.6, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.text('GRAND TOTAL', labelX + 3, ty + 1)
  doc.text(inr(order.grandTotal), rightX - 3, ty + 1, { align: 'right' })

  /* ---------- Payment + delivery ---------- */
  let py = ty + 14
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(...BRAND_GREEN)
  doc.text('PAYMENT', M, py)
  doc.setFontSize(8.5)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...INK)
  py += 4.5
  doc.text(`Method: ${PAYMENT_METHODS[payment.method] || payment.method || '—'}`, M, py)
  py += 4.5
  doc.text(`Status: ${PAYMENT_LABELS[payment.status] || payment.status || '—'}`, M, py)
  py += 4.5
  const txId = payment.transactionId || payment.razorpayPaymentId
  if (txId) { doc.text(`Transaction ID: ${txId}`, M, py); py += 4.5 }

  if (slot?.label) {
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...BRAND_GREEN)
    doc.text('DELIVERY', pageW / 2 + 6, py)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...INK)
    doc.text(`${slot.label} — ${slot.time || ''}`, pageW / 2 + 6, py + 4.5)
    doc.text(`Slot: ${slot.label}`, pageW / 2 + 6, py + 9)
  }

  /* ---------- Footer note ---------- */
  const fx = pageH - 26
  doc.setDrawColor(...BRAND_ACCENT)
  doc.setLineWidth(0.6)
  doc.line(M, fx, pageW - M, fx)
  doc.setFontSize(8)
  doc.setTextColor(...MUTED)
  doc.setFont('helvetica', 'normal')
  doc.text('Thank you for shopping with D.R.STORES 🌱', pageW / 2, fx + 5, { align: 'center' })
  doc.text('GSTIN: 33AAACD1234F1Z5   ·   Order queries: support@drstores.com', pageW / 2, fx + 9.5, { align: 'center' })

  const safeId = String(orderId).replace(/[^a-zA-Z0-9-_]/g, '')
  doc.save(`D.R.STORES-Invoice-${safeId}.pdf`)
}
