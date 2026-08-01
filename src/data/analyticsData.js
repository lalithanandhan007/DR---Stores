/* ====================================================================
   D.R.STORES — Analytics module mock data
   Rich chart series for revenue, sales, customer & product analytics.
   All data structured for MongoDB aggregation pipeline swap.
   ==================================================================== */

const d = (n) => new Date(Date.now() - n * 864e5).toISOString()
const h = (n) => new Date(Date.now() - n * 36e5).toISOString()

/* ---------- Revenue Analytics ---------- */
export const dailyRevenue = Array.from({ length: 30 }, (_, i) => {
  const date = new Date(Date.now() - (29 - i) * 864e5)
  return {
    date: date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
    revenue: 55000 + Math.floor(Math.random() * 45000),
    orders: 130 + Math.floor(Math.random() * 90),
    avgOrder: 380 + Math.floor(Math.random() * 80),
  }
})

export const weeklyRevenue = [
  { week: 'W1', revenue: 524000, orders: 1280, customers: 890 },
  { week: 'W2', revenue: 582000, orders: 1420, customers: 960 },
  { week: 'W3', revenue: 548000, orders: 1340, customers: 920 },
  { week: 'W4', revenue: 641000, orders: 1580, customers: 1050 },
]

export const monthlyRevenue = [
  { month: 'Sep', revenue: 1820000, orders: 4200, customers: 2800, prev: 1580000 },
  { month: 'Oct', revenue: 1960000, orders: 4520, customers: 3100, prev: 1720000 },
  { month: 'Nov', revenue: 1880000, orders: 4350, customers: 2950, prev: 1640000 },
  { month: 'Dec', revenue: 2410000, orders: 5600, customers: 3800, prev: 1890000 },
  { month: 'Jan', revenue: 2120000, orders: 4900, customers: 3400, prev: 1960000 },
  { month: 'Feb', revenue: 2240000, orders: 5100, customers: 3550, prev: 2020000 },
  { month: 'Mar', revenue: 2680000, orders: 6100, customers: 4200, prev: 2240000 },
  { month: 'Apr', revenue: 2540000, orders: 5800, customers: 4000, prev: 2380000 },
  { month: 'May', revenue: 2730000, orders: 6300, customers: 4400, prev: 2540000 },
  { month: 'Jun', revenue: 2890000, orders: 6700, customers: 4600, prev: 2730000 },
  { month: 'Jul', revenue: 3120000, orders: 7200, customers: 4900, prev: 2890000 },
  { month: 'Aug', revenue: 3280000, orders: 7600, customers: 5200, prev: 3120000 },
]

/* ---------- Sales by Hour ---------- */
export const salesByHour = [
  { hour: '6 AM', sales: 2100 }, { hour: '7 AM', sales: 5400 }, { hour: '8 AM', sales: 9800 },
  { hour: '9 AM', sales: 12400 }, { hour: '10 AM', sales: 11200 }, { hour: '11 AM', sales: 8600 },
  { hour: '12 PM', sales: 14200 }, { hour: '1 PM', sales: 11800 }, { hour: '2 PM', sales: 7400 },
  { hour: '3 PM', sales: 6200 }, { hour: '4 PM', sales: 8800 }, { hour: '5 PM', sales: 13600 },
  { hour: '6 PM', sales: 15800 }, { hour: '7 PM', sales: 12400 }, { hour: '8 PM', sales: 9200 },
  { hour: '9 PM', sales: 5600 }, { hour: '10 PM', sales: 2800 },
]

/* ---------- Sales by Day of Week ---------- */
export const salesByDay = [
  { day: 'Mon', sales: 82400, orders: 201 }, { day: 'Tue', sales: 78600, orders: 192 },
  { day: 'Wed', sales: 85200, orders: 208 }, { day: 'Thu', sales: 91400, orders: 223 },
  { day: 'Fri', sales: 98800, orders: 241 }, { day: 'Sat', sales: 112400, orders: 274 },
  { day: 'Sun', sales: 106200, orders: 259 },
]

/* ---------- Customer Analytics ---------- */
export const customerGrowth = [
  { month: 'Sep', new: 180, returning: 620, total: 10200 },
  { month: 'Oct', new: 210, returning: 680, total: 10600 },
  { month: 'Nov', new: 165, returning: 640, total: 10850 },
  { month: 'Dec', new: 290, returning: 750, total: 11400 },
  { month: 'Jan', new: 240, returning: 700, total: 11800 },
  { month: 'Feb', new: 220, returning: 720, total: 12100 },
  { month: 'Mar', new: 310, returning: 800, total: 12600 },
  { month: 'Apr', new: 280, returning: 760, total: 12847 },
  { month: 'May', new: 320, returning: 810, total: 13200 },
  { month: 'Jun', new: 340, returning: 850, total: 13600 },
  { month: 'Jul', new: 380, returning: 890, total: 14100 },
  { month: 'Aug', new: 410, returning: 920, total: 14600 },
]

export const customerRetention = { rate: 72.4, repeat: 31.6, oneTime: 27.6 }
export const avgOrderValue = { current: 418, previous: 389, growth: 7.5 }
export const conversionRate = { current: 3.4, previous: 3.1, growth: 9.7 }

/* ---------- Top Products ---------- */
export const topProducts = [
  { name: 'Fresh Tomato', emoji: '🍅', sold: 1284, revenue: 35952, growth: 12.4 },
  { name: 'Premium Potato', emoji: '🥔', sold: 1148, revenue: 25256, growth: 8.1 },
  { name: 'Baby Spinach', emoji: '🥬', sold: 967, revenue: 23208, growth: 15.3 },
  { name: 'Red Onion', emoji: '🧅', sold: 882, revenue: 15876, growth: -2.4 },
  { name: 'Sweet Carrot', emoji: '🥕', sold: 761, revenue: 30440, growth: 5.8 },
  { name: 'Fresh Broccoli', emoji: '🥦', sold: 645, revenue: 41925, growth: 22.1 },
  { name: 'Button Mushroom', emoji: '🍄', sold: 589, revenue: 32395, growth: 18.7 },
  { name: 'Curry Leaves', emoji: '🌿', sold: 534, revenue: 4272, growth: 9.3 },
  { name: 'Green Capsicum', emoji: '🫑', sold: 498, revenue: 17430, growth: 6.2 },
  { name: 'Fresh Lemon', emoji: '🍋', sold: 467, revenue: 2802, growth: 3.8 },
]

/* ---------- Top Categories ---------- */
export const topCategories = [
  { name: 'Root Vegetables', revenue: 824000, orders: 2100, share: 28, color: '#FF9800' },
  { name: 'Leafy & Green', revenue: 642000, orders: 1800, share: 22, color: '#2E7D32' },
  { name: 'Fruit Vegetables', revenue: 538000, orders: 1400, share: 18, color: '#EF4444' },
  { name: 'Cooking Essentials', revenue: 396000, orders: 1100, share: 13, color: '#8D6E63' },
  { name: 'Daily Grocery', revenue: 322000, orders: 920, share: 11, color: '#FFB74D' },
  { name: 'Herbs & Spices', revenue: 178000, orders: 650, share: 6, color: '#1B5E20' },
  { name: 'Exotics', revenue: 52000, orders: 180, share: 2, color: '#6D4C41' },
]

/* ---------- Delivery Analytics ---------- */
export const deliveryAnalytics = {
  avgTime: 36,
  onTimeRate: 92.4,
  totalDeliveries: 7200,
  failedDeliveries: 86,
  partnerDistribution: [
    { name: 'Mohan Raj', deliveries: 1543, onTime: 96, color: '#2E7D32' },
    { name: 'Ravi Kumar', deliveries: 1284, onTime: 94, color: '#4CAF50' },
    { name: 'Karthik Raja', deliveries: 1102, onTime: 93, color: '#66BB6A' },
    { name: 'Sathish Babu', deliveries: 987, onTime: 91, color: '#81C784' },
    { name: 'Arun Prakash', deliveries: 756, onTime: 89, color: '#A5D6A7' },
  ],
}

/* ---------- KPI Summary ---------- */
export const kpiSummary = [
  { label: 'Total Revenue', value: 3280000, prefix: '₹', growth: 5.1, period: 'vs last month' },
  { label: 'Total Orders', value: 7600, growth: 5.3, period: 'vs last month' },
  { label: 'Total Customers', value: 14600, growth: 3.2, period: 'vs last month' },
  { label: 'Avg Order Value', value: 418, prefix: '₹', growth: 7.5, period: 'vs last month' },
  { label: 'Conversion Rate', value: 3.4, suffix: '%', growth: 9.7, period: 'vs last month' },
  { label: 'Repeat Customer Rate', value: 72.4, suffix: '%', growth: 2.1, period: 'vs last month' },
]
