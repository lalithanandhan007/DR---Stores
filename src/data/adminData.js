/* ====================================================================
   D.R.STORES — Admin mock data
   Structured like MongoDB collections (each doc has _id) so the UI can
   be swapped to a real backend later with minimal changes.
   ==================================================================== */

/* ---------- Store status ---------- */
export const storeStatus = {
  open: true,
  statusLabel: 'Open Now',
  hours: '8:00 AM – 10:00 PM',
  day: 'TODAY',
}

/* ---------- Admin profile ---------- */
export const adminProfile = {
  _id: 'adm_001',
  name: 'Ramesh Anandhan',
  email: 'admin@drstores.com',
  phone: '+91 98765 43210',
  role: 'Administrator',
  avatar: null,
  store: 'D.R.STORES — Main Road',
}

/* ---------- Stat cards ---------- */
export const statCards = [
  { id: 'revenue', label: "Today's Revenue", value: 86420, prefix: '₹', delta: 12.4, trend: 'up', icon: 'wallet', spark: [42, 48, 45, 61, 58, 72, 78] },
  { id: 'orders', label: "Today's Orders", value: 214, delta: 8.1, trend: 'up', icon: 'basket', spark: [30, 42, 38, 47, 44, 56, 61] },
  { id: 'pending', label: 'Pending Orders', value: 32, delta: -4.2, trend: 'down', icon: 'clock', spark: [55, 48, 52, 40, 44, 35, 32] },
  { id: 'delivered', label: 'Delivered Today', value: 178, delta: 9.7, trend: 'up', icon: 'check', spark: [40, 38, 44, 52, 50, 58, 63] },
  { id: 'customers', label: 'Total Customers', value: 12847, delta: 3.4, trend: 'up', icon: 'users', spark: [20, 24, 23, 28, 30, 32, 35] },
  { id: 'lowStock', label: 'Low Stock Items', value: 9, delta: 2, trend: 'warn', icon: 'alert', spark: [5, 6, 6, 7, 8, 8, 9] },
  { id: 'aov', label: 'Average Order Value', value: 404, prefix: '₹', delta: 5.2, trend: 'up', icon: 'receipt', spark: [380, 392, 388, 401, 398, 406, 404] },
  { id: 'conversion', label: 'Conversion Rate', value: 3.2, suffix: '%', delta: 0.6, trend: 'up', icon: 'target', spark: [2.6, 2.8, 2.7, 2.9, 3.0, 3.1, 3.2] },
]

/* ---------- Revenue / order chart series ---------- */
export const weeklyRevenue = [
  { day: 'Mon', revenue: 58200, orders: 142 },
  { day: 'Tue', revenue: 64100, orders: 158 },
  { day: 'Wed', revenue: 59800, orders: 149 },
  { day: 'Thu', revenue: 72400, orders: 176 },
  { day: 'Fri', revenue: 81300, orders: 195 },
  { day: 'Sat', revenue: 94800, orders: 232 },
  { day: 'Sun', revenue: 86420, orders: 214 },
]

export const monthlyRevenue = [
  { month: 'Sep', revenue: 1820000 },
  { month: 'Oct', revenue: 1960000 },
  { month: 'Nov', revenue: 1880000 },
  { month: 'Dec', revenue: 2410000 },
  { month: 'Jan', revenue: 2120000 },
  { month: 'Feb', revenue: 2240000 },
  { month: 'Mar', revenue: 2680000 },
  { month: 'Apr', revenue: 2540000 },
  { month: 'May', revenue: 2730000 },
  { month: 'Jun', revenue: 2890000 },
  { month: 'Jul', revenue: 3120000 },
  { month: 'Aug', revenue: 3280000 },
]

export const ordersTrend = [
  { date: 'Jul 19', orders: 138, delivered: 121 },
  { date: 'Jul 20', orders: 152, delivered: 134 },
  { date: 'Jul 21', orders: 147, delivered: 128 },
  { date: 'Jul 22', orders: 171, delivered: 149 },
  { date: 'Jul 23', orders: 189, delivered: 165 },
  { date: 'Jul 24', orders: 205, delivered: 182 },
  { date: 'Jul 25', orders: 214, delivered: 178 },
]

export const salesOverview = [
  { name: 'Week 1', current: 1620000, previous: 1380000 },
  { name: 'Week 2', current: 1780000, previous: 1510000 },
  { name: 'Week 3', current: 1940000, previous: 1650000 },
  { name: 'Week 4', current: 2240000, previous: 1820000 },
]

export const categoryDistribution = [
  { category: 'Leafy & Green', value: 28, color: '#2E7D32' },
  { category: 'Root Veggies', value: 22, color: '#4CAF50' },
  { category: 'Fruit Veggies', value: 19, color: '#81C784' },
  { category: 'Daily Grocery', value: 18, color: '#FF9800' },
  { category: 'Cooking Essentials', value: 13, color: '#FFB74D' },
]

/* ---------- Top selling products ---------- */
export const topProducts = [
  { _id: 'tomato', name: 'Fresh Tomato', emoji: '🍅', gradient: ['#FF6B6B', '#EE5A24'], price: 28, sold: 1284, revenue: 35952, trend: 12.4, stock: 84 },
  { _id: 'potato', name: 'Premium Potato', emoji: '🥔', gradient: ['#C9A227', '#8D6E63'], price: 22, sold: 1148, revenue: 25256, trend: 8.1, stock: 142 },
  { _id: 'spinach', name: 'Baby Spinach', emoji: '🥬', gradient: ['#4CAF50', '#1B5E20'], price: 24, sold: 967, revenue: 23208, trend: 15.3, stock: 6 },
  { _id: 'onion', name: 'Red Onion', emoji: '🧅', gradient: ['#B5651D', '#7B3F00'], price: 18, sold: 882, revenue: 15876, trend: -2.4, stock: 210 },
  { _id: 'carrot', name: 'Sweet Carrot', emoji: '🥕', gradient: ['#FF9800', '#E65100'], price: 40, sold: 761, revenue: 30440, trend: 5.8, stock: 64 },
]

/* ---------- Low stock items ---------- */
export const lowStock = [
  { _id: 'spinach', name: 'Baby Spinach', emoji: '🥬', stock: 6, reorder: 25, category: 'Leafy & Green', gradient: ['#4CAF50', '#1B5E20'] },
  { _id: 'mint', name: 'Fresh Mint', emoji: '🌿', stock: 8, reorder: 30, category: 'Leafy & Green', gradient: ['#2E7D32', '#004D40'] },
  { _id: 'coriander', name: 'Fresh Coriander', emoji: '🌱', stock: 5, reorder: 30, category: 'Leafy & Green', gradient: ['#43A047', '#1B5E20'] },
  { _id: 'mushroom', name: 'Button Mushroom', emoji: '🍄', stock: 12, reorder: 40, category: 'Exotics', gradient: ['#A1887F', '#5D4037'] },
  { _id: 'broccoli', name: 'Fresh Broccoli', emoji: '🥦', stock: 9, reorder: 35, category: 'Exotics', gradient: ['#388E3C', '#1B5E20'] },
  { _id: 'lemon', name: 'Fresh Lemon', emoji: '🍋', stock: 14, reorder: 50, category: 'Fruit Vegetables', gradient: ['#FDD835', '#F9A825'] },
]

/* ---------- Recent orders ---------- */
export const recentOrders = [
  { _id: 'ORD-8241', customer: 'Priya Sharma', avatar: 'PS', items: 4, emoji: '🥬', amount: 687, payment: 'UPI', status: 'delivered', delivery: '8:42 AM', time: '2 min ago' },
  { _id: 'ORD-8240', customer: 'Arjun Mehta', avatar: 'AM', items: 2, emoji: '🍅', amount: 342, payment: 'Card', status: 'preparing', delivery: '9:10 AM', time: '8 min ago' },
  { _id: 'ORD-8239', customer: 'Sneha Rao', avatar: 'SR', items: 6, emoji: '🧅', amount: 1124, payment: 'Cash', status: 'out_for_delivery', delivery: '9:25 AM', time: '14 min ago' },
  { _id: 'ORD-8238', customer: 'Karthik N', avatar: 'KN', items: 1, emoji: '🥔', amount: 128, payment: 'UPI', status: 'pending', delivery: '10:05 AM', time: '21 min ago' },
  { _id: 'ORD-8237', customer: 'Divya Krishnan', avatar: 'DK', items: 3, emoji: '🥕', amount: 456, payment: 'Card', status: 'delivered', delivery: '8:15 AM', time: '34 min ago' },
  { _id: 'ORD-8236', customer: 'Mohammed Irfan', avatar: 'MI', items: 5, emoji: '🥦', amount: 893, payment: 'UPI', status: 'cancelled', delivery: '—', time: '41 min ago' },
  { _id: 'ORD-8235', customer: 'Lakshmi Devi', avatar: 'LD', items: 2, emoji: '🍋', amount: 264, payment: 'NetBanking', status: 'preparing', delivery: '9:40 AM', time: '52 min ago' },
]

/* ---------- Notifications ---------- */
export const notifications = [
  { id: 'n1', type: 'order', title: 'New order placed', message: 'Priya Sharma ordered 4 items · ₹687', time: '2m ago', read: false },
  { id: 'n2', type: 'lowstock', title: 'Low stock alert', message: 'Baby Spinach down to 6 units', time: '18m ago', read: false },
  { id: 'n3', type: 'coupon', title: 'Coupon expiring', message: 'WELCOME50 expires in 2 days', time: '1h ago', read: false },
  { id: 'n4', type: 'customer', title: 'New customer', message: 'Sneha Rao created an account', time: '2h ago', read: true },
  { id: 'n5', type: 'order', title: 'Order delivered', message: 'ORD-8237 delivered on time', time: '3h ago', read: true },
]

/* ---------- Recent activity timeline ---------- */
export const activity = [
  { id: 'a1', actor: 'Priya Sharma', action: 'placed an order', target: '#ORD-8241', amount: '₹687', time: '2 minutes ago', type: 'order' },
  { id: 'a2', actor: 'System', action: 'flagged low stock', target: 'Baby Spinach', note: '6 units remaining', time: '18 minutes ago', type: 'alert' },
  { id: 'a3', actor: 'Sneha Rao', action: 'registered as a new customer', time: '2 hours ago', type: 'customer' },
  { id: 'a4', actor: 'You', action: 'restocked', target: 'Button Mushroom', note: '+40 units', time: '4 hours ago', type: 'inventory' },
  { id: 'a5', actor: 'System', action: 'applied coupon', target: 'FRESH100', note: '₹100 off', time: '5 hours ago', type: 'coupon' },
  { id: 'a6', actor: 'Karthik N', action: 'requested a refund', target: '#ORD-8231', time: 'Yesterday', type: 'refund' },
]

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
  { id: 'categories', label: 'Categories', icon: 'box' },
  { id: 'orders', label: 'Orders', icon: 'clipboard' },
  { id: 'customers', label: 'Customers', icon: 'users' },
  { id: 'inventory', label: 'Inventory', icon: 'box' },
  { id: 'delivery', label: 'Delivery', icon: 'truck' },
  { id: 'coupons', label: 'Coupons', icon: 'ticket' },
  { id: 'analytics', label: 'Analytics', icon: 'chart' },
  { id: 'reports', label: 'Reports', icon: 'fileText' },
  { id: 'settings', label: 'Store Settings', icon: 'settings' },
  { id: 'profile', label: 'Admin Profile', icon: 'user' },
  { id: 'activity', label: 'Activity Logs', icon: 'history' },
]

export const modulePlans = {
  products: 'Product CRUD — list, add, edit, deactivate & price products.',
  orders: 'Order management — confirm, dispatch, track & handle refunds.',
  customers: 'Customer directory, lifetime value & behaviour insights.',
  inventory: 'Stock levels, reorder points, restock & expiry tracking.',
  delivery: 'Pincode zones, delivery partners & route optimisation.',
  coupons: 'Create & manage offers, usage limits & expiry.',
  analytics: 'Deep-dive revenue, retention & funnel analytics.',
  reports: 'Exportable daily, weekly & monthly business reports.',
  settings: 'Store profile, hours, payment & tax configuration.',
  profile: 'Manage the admin account, permissions & 2FA.',
  activity: 'Full audit trail of every action in the store.',
}
