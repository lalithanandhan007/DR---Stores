/* ====================================================================
   D.R.STORES — Reports module configuration
   Report categories and templates (UI definitions).
   Real report data is generated from live backend data in ReportsPage.
   ==================================================================== */

const d = (n) => new Date(Date.now() - n * 864e5).toISOString()

export const REPORT_CATEGORIES = [
  { id: 'sales', label: 'Sales Reports', icon: 'receipt', color: 'bg-emerald-50 text-emerald-600' },
  { id: 'revenue', label: 'Revenue Reports', icon: 'wallet', color: 'bg-primary/10 text-primary' },
  { id: 'orders', label: 'Order Reports', icon: 'clipboard', color: 'bg-blue-50 text-blue-600' },
  { id: 'customers', label: 'Customer Reports', icon: 'users', color: 'bg-violet-50 text-violet-600' },
  { id: 'inventory', label: 'Inventory Reports', icon: 'box', color: 'bg-amber-50 text-amber-600' },
  { id: 'delivery', label: 'Delivery Reports', icon: 'truck', color: 'bg-indigo-50 text-indigo-600' },
]

export const reportTemplates = [
  /* Sales */
  { _id: 'rpt_001', name: 'Daily Sales Report', category: 'sales', period: 'daily', description: "Complete breakdown of today's sales by product, category, and payment method.", lastGenerated: d(0), status: 'ready' },
  { _id: 'rpt_002', name: 'Weekly Sales Summary', category: 'sales', period: 'weekly', description: 'Week-over-week sales comparison with trend analysis.', lastGenerated: d(1), status: 'ready' },
  { _id: 'rpt_003', name: 'Monthly Sales Analysis', category: 'sales', period: 'monthly', description: 'Detailed monthly sales with category breakdown and top performers.', lastGenerated: d(3), status: 'ready' },
  { _id: 'rpt_004', name: 'Yearly Sales Report', category: 'sales', period: 'yearly', description: 'Annual sales overview with YoY growth metrics.', lastGenerated: d(7), status: 'ready' },
  /* Revenue */
  { _id: 'rpt_005', name: 'Daily Revenue Report', category: 'revenue', period: 'daily', description: 'Revenue by channel, payment method, and time slot.', lastGenerated: d(0), status: 'ready' },
  { _id: 'rpt_006', name: 'Revenue Growth Analysis', category: 'revenue', period: 'monthly', description: 'Revenue growth trends with forecasting projections.', lastGenerated: d(5), status: 'ready' },
  /* Orders */
  { _id: 'rpt_007', name: 'Order Status Report', category: 'orders', period: 'daily', description: 'Orders by status: pending, preparing, delivered, cancelled.', lastGenerated: d(0), status: 'ready' },
  { _id: 'rpt_008', name: 'Order Volume Trends', category: 'orders', period: 'weekly', description: 'Order volume patterns across days and time slots.', lastGenerated: d(2), status: 'ready' },
  /* Customers */
  { _id: 'rpt_009', name: 'Customer Acquisition Report', category: 'customers', period: 'monthly', description: 'New vs returning customers with acquisition cost analysis.', lastGenerated: d(4), status: 'ready' },
  { _id: 'rpt_010', name: 'Customer Lifetime Value', category: 'customers', period: 'monthly', description: 'CLV distribution, top customers, and retention metrics.', lastGenerated: d(6), status: 'ready' },
  /* Inventory */
  { _id: 'rpt_011', name: 'Stock Level Report', category: 'inventory', period: 'daily', description: 'Current stock levels, reorder alerts, and deadstock items.', lastGenerated: d(0), status: 'ready' },
  { _id: 'rpt_012', name: 'Inventory Turnover', category: 'inventory', period: 'monthly', description: 'Turnover rates, carrying costs, and shrinkage analysis.', lastGenerated: d(8), status: 'ready' },
  /* Delivery */
  { _id: 'rpt_013', name: 'Delivery Performance', category: 'delivery', period: 'weekly', description: 'On-time rates, average delivery time, and partner scores.', lastGenerated: d(1), status: 'ready' },
  { _id: 'rpt_014', name: 'Delivery Zone Analysis', category: 'delivery', period: 'monthly', description: 'Revenue and order density by delivery pincode zones.', lastGenerated: d(10), status: 'ready' },
]