/* ====================================================================
   D.R.STORES — Admin configuration & navigation data
   UI configuration constants (not business data).
   ==================================================================== */

/* ---------- Quick actions ---------- */
export const quickActions = [
  { id: 'qa1', label: 'Add Product', desc: 'List a new vegetable or grocery item', icon: 'plus', tint: 'from-primary to-primary-dark' },
  { id: 'qa2', label: 'Create Coupon', desc: 'Launch an offer for your customers', icon: 'ticket', tint: 'from-accent to-orange-600' },
  { id: 'qa3', label: 'Manage Orders', desc: 'Review, confirm & dispatch orders', icon: 'package', tint: 'from-secondary to-primary-dark' },
  { id: 'qa4', label: 'View Inventory', desc: 'Track stock across all categories', icon: 'box', tint: 'from-emerald-500 to-teal-600' },
  { id: 'qa5', label: 'Analytics', desc: 'Revenue, trends & conversions', icon: 'chart', tint: 'from-indigo-500 to-violet-600' },
  { id: 'qa6', label: 'Delivery Zones', desc: 'Manage pincodes & delivery partners', icon: 'truck', tint: 'from-blue-500 to-indigo-600' },
]

/* ---------- Sidebar modules ---------- */
export const adminModules = [
  { id: 'dashboard', label: 'Dashboard', icon: 'layout' },
  { id: 'products', label: 'Products', icon: 'shoppingBag' },
  { id: 'categories', label: 'Categories', icon: 'folderOpen' },
  { id: 'orders', label: 'Orders', icon: 'clipboardList' },
  { id: 'customers', label: 'Customers', icon: 'users' },
  { id: 'inventory', label: 'Inventory', icon: 'boxes' },
  { id: 'delivery', label: 'Delivery', icon: 'truck' },
  { id: 'coupons', label: 'Coupons', icon: 'ticketPercent' },
  { id: 'analytics', label: 'Analytics', icon: 'barChart3' },
  { id: 'reports', label: 'Reports', icon: 'fileText' },
  { id: 'settings', label: 'Settings', icon: 'settings2' },
  { id: 'activity', label: 'Activity Logs', icon: 'activity' },
]

/* ---------- Module plans (for placeholder pages) ---------- */
export const modulePlans = {
  products: {
    title: 'Products Management',
    description: 'Add, edit, and organize your product catalog with categories, pricing, and stock.',
    steps: [
      'Create product categories',
      'Add products with images & variants',
      'Set pricing, stock levels & SKUs',
      'Configure SEO & visibility',
    ],
    icon: 'shoppingBag',
    color: 'from-primary to-primary-dark',
    route: '/admin/products',
  },
  categories: {
    title: 'Category Management',
    description: 'Organize products into logical groups for easier browsing.',
    steps: [
      'Create category hierarchy',
      'Assign icons & colors',
      'Set display order',
      'Link to products',
    ],
    icon: 'folderOpen',
    color: 'from-emerald-500 to-teal-600',
    route: '/admin/categories',
  },
  orders: {
    title: 'Order Management',
    description: 'Process orders, track status, manage refunds, and coordinate delivery.',
    steps: [
      'View incoming orders',
      'Update order status',
      'Assign delivery partners',
      'Handle returns & refunds',
    ],
    icon: 'clipboardList',
    color: 'from-secondary to-primary-dark',
    route: '/admin/orders',
  },
  customers: {
    title: 'Customer Management',
    description: 'View customer profiles, order history, and engagement metrics.',
    steps: [
      'Browse customer list',
      'View profiles & order history',
      'Apply tags & segments',
      'Export customer data',
    ],
    icon: 'users',
    color: 'from-violet-500 to-purple-600',
    route: '/admin/customers',
  },
  inventory: {
    title: 'Inventory Management',
    description: 'Track stock levels, set reorder points, and manage supplier orders.',
    steps: [
      'Monitor stock levels',
      'Set low-stock thresholds',
      'Record stock adjustments',
      'Generate restock orders',
    ],
    icon: 'boxes',
    color: 'from-emerald-500 to-teal-600',
    route: '/admin/inventory',
  },
  delivery: {
    title: 'Delivery Management',
    description: 'Manage delivery partners, zones, and track deliveries in real-time.',
    steps: [
      'Add delivery partners',
      'Define delivery zones',
      'Set pricing & time slots',
      'Track live deliveries',
    ],
    icon: 'truck',
    color: 'from-blue-500 to-indigo-600',
    route: '/admin/delivery',
  },
  coupons: {
    title: 'Coupon Management',
    description: 'Create and manage discount codes, offers, and promotional campaigns.',
    steps: [
      'Create coupon codes',
      'Set discount rules',
      'Define usage limits',
      'Track redemption rates',
    ],
    icon: 'ticketPercent',
    color: 'from-accent to-orange-600',
    route: '/admin/coupons',
  },
  analytics: {
    title: 'Analytics Dashboard',
    description: 'Deep-dive into revenue trends, customer behavior, and product performance.',
    steps: [
      'View revenue charts',
      'Analyze customer cohorts',
      'Track product performance',
      'Export analytics data',
    ],
    icon: 'barChart3',
    color: 'from-indigo-500 to-violet-600',
    route: '/admin/analytics',
  },
  reports: {
    title: 'Reports',
    description: 'Generate and schedule automated business reports.',
    steps: [
      'Select report type',
      'Configure date range',
      'Generate preview',
      'Download PDF/CSV',
    ],
    icon: 'fileText',
    color: 'from-primary to-primary-dark',
    route: '/admin/reports',
  },
  settings: {
    title: 'Store Settings',
    description: 'Configure store identity, business hours, delivery, payments, and appearance.',
    steps: [
      'Set store details',
      'Configure business hours',
      'Set delivery & payment rules',
      'Customize theme',
    ],
    icon: 'settings2',
    color: 'from-gray-600 to-gray-800',
    route: '/admin/settings',
  },
  activity: {
    title: 'Activity Logs',
    description: 'Audit trail of all admin actions and system events.',
    steps: [
      'Filter by type & date',
      'Search by actor or target',
      'Export audit logs',
      'Configure retention',
    ],
    icon: 'activity',
    color: 'from-gray-600 to-gray-800',
    route: '/admin/activity',
  },
}