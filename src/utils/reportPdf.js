import { jsPDF } from 'jspdf'
import { autoTable } from 'jspdf-autotable'

const GREEN = [46, 125, 50]
const DARK = [27, 94, 32]
const INK = [30, 30, 30]
const MUTED = [120, 120, 120]

const inr = (value) =>
  `Rs. ${Number(value || 0).toLocaleString('en-IN')}`

export function downloadReportPdf(report, data) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const pageW = doc.internal.pageSize.getWidth()
  const pageH = doc.internal.pageSize.getHeight()
  const M = 14

  /* Header */
  doc.setFillColor(...DARK)
  doc.rect(0, 0, pageW, 34, 'F')

  doc.setFillColor(...GREEN)
  doc.rect(0, 34, pageW, 2.5, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(20)
  doc.text('D.R.STORES', M, 14)

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text('FARM FRESH GROCERY', M, 20)

  doc.setFontSize(8)
  doc.text('Business Report', M, 25)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(15)
  doc.text('REPORT', pageW - M, 14, { align: 'right' })

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.text(report.name, pageW - M, 21, { align: 'right' })
  doc.text(
    new Date(data.generatedAt).toLocaleString('en-IN'),
    pageW - M,
    26,
    { align: 'right' }
  )

  /* Summary */
  let y = 48

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(...GREEN)
  doc.text('SUMMARY', M, y)

  y += 7

  autoTable(doc, {
    startY: y,
    margin: { left: M, right: M },
    head: [['Metric', 'Value']],
    body: [
      ['Total Revenue', inr(data.summary.totalSales)],
      ['Total Orders', String(data.summary.totalOrders)],
      ['Average Order Value', inr(data.summary.avgOrder)],
      ['Total Customers', String(data.summary.totalCustomers)],
      ['Delivered Today', String(data.summary.deliveredToday)],
      ['Pending Orders', String(data.summary.pendingOrders)],
    ],
    theme: 'grid',
    styles: {
      font: 'helvetica',
      fontSize: 9,
      textColor: INK,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: GREEN,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
  })

  /* Top Products */
  let after = doc.lastAutoTable.finalY + 10

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(...GREEN)
  doc.text('TOP PRODUCTS', M, after)

  const products = data.topProducts || []

  autoTable(doc, {
    startY: after + 5,
    margin: { left: M, right: M },
    head: [['Product', 'Quantity', 'Revenue']],
    body: products.length
      ? products.map((product) => [
          product.name || 'Product',
          String(product.qty || 0),
          inr(product.revenue),
        ])
      : [['No product data available', '-', '-']],
    theme: 'grid',
    styles: {
      font: 'helvetica',
      fontSize: 9,
      textColor: INK,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: GREEN,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
  })

  /* Footer */
  doc.setDrawColor(...GREEN)
  doc.setLineWidth(0.5)
  doc.line(M, pageH - 18, pageW - M, pageH - 18)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.5)
  doc.setTextColor(...MUTED)
  doc.text(
    'D.R.STORES · Farm Fresh Grocery · Generated from live store data',
    pageW / 2,
    pageH - 12,
    { align: 'center' }
  )

  const safeName = String(report.name || 'Report')
    .replace(/[^a-zA-Z0-9-_ ]/g, '')
    .replace(/\s+/g, '-')

  doc.save(`D.R.STORES-${safeName}.pdf`)
}