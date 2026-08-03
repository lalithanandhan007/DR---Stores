/* ====================================================================
   D.R.STORES — API layer
   Every call returns the server's `data` payload (the `{ success,
   message, data }` envelope is unwrapped here).
   ==================================================================== */
import api from './client'

const unwrap = (res) => res.data?.data ?? res.data
const unwrapPaged = (res) => res.data?.data ?? { items: [], pagination: {} }

/* ---------- AUTH ---------- */
export const authApi = {
  register: (payload) => api.post('/auth/register', payload).then(unwrap),
  login: (email, password) => api.post('/auth/login', { email, password }).then(unwrap),
  loginWithOtp: (identifier) => api.post('/auth/login-otp', { identifier }).then(unwrap),
  logout: () => api.post('/auth/logout').then(unwrap),
  getMe: () => api.get('/auth/me').then(unwrap),
  updateProfile: (patch) => api.put('/auth/profile', patch).then(unwrap),
  forgotPassword: (identifier) => api.post('/auth/forgot-password', { identifier }).then(unwrap),
  verifyOtp: (identifier, code, purpose = 'login') => api.post('/auth/verify-otp', { identifier, code, purpose }).then(unwrap),
  resetPassword: (identifier, newPassword) => api.post('/auth/reset-password', { identifier, newPassword }).then(unwrap),
}

/* ---------- PRODUCTS & CATEGORIES ---------- */
export const productApi = {
  list: (params) => api.get('/products', { params }).then(unwrapPaged),
  all: (params) => api.get('/products/all', { params }).then(unwrapPaged),
  get: (id) => api.get(`/products/${id}`).then(unwrap),
  create: (payload) => api.post('/products', payload).then(unwrap),
  update: (id, payload) => api.put(`/products/${id}`, payload).then(unwrap),
  remove: (id) => api.delete(`/products/${id}`).then(unwrap),
  categories: () => api.get('/products/categories/list').then(unwrap),
  allCategories: () => api.get('/products/categories/all').then(unwrap),
  createCategory: (payload) => api.post('/products/categories', payload).then(unwrap),
  updateCategory: (id, payload) => api.put(`/products/categories/${id}`, payload).then(unwrap),
  deleteCategory: (id) => api.delete(`/products/categories/${id}`).then(unwrap),
}

/* ---------- CART ---------- */
export const cartApi = {
  get: () => api.get('/cart').then(unwrap),
  add: (productId, weight, qty) => api.post('/cart/add', { productId, weight, qty }).then(unwrap),
  update: (key, qty) => api.put('/cart/update', { key, qty }).then(unwrap),
  remove: (key) => api.delete(`/cart/remove/${encodeURIComponent(key)}`).then(unwrap),
  clear: () => api.delete('/cart/clear').then(unwrap),
}

/* ---------- ORDERS ---------- */
export const orderApi = {
  place: (payload) => api.post('/orders', payload).then(unwrap),
  my: () => api.get('/orders/my').then(unwrap),
  get: (id) => api.get(`/orders/${id}`).then(unwrap),
  adminAll: (params) => api.get('/orders/admin/all', { params }).then(unwrapPaged),
  updateStatus: (id, status, note) => api.put(`/orders/admin/${id}/status`, { status, note }).then(unwrap),
  assignPartner: (id, payload) => api.put(`/orders/admin/${id}/partner`, payload).then(unwrap),
  addNote: (id, text) => api.put(`/orders/admin/${id}/notes`, { text }).then(unwrap),
  bulkStatus: (ids, status) => api.post('/orders/admin/bulk-status', { ids, status }).then(unwrap),
  deleteMany: (ids) => api.post('/orders/admin/delete', { ids }).then(unwrap),
}

/* ---------- WISHLIST ---------- */
export const wishlistApi = {
  get: () => api.get('/wishlist').then(unwrap),
  toggle: (productId) => api.post('/wishlist/toggle', { productId }).then(unwrap),
  remove: (id) => api.delete(`/wishlist/${id}`).then(unwrap),
  clear: () => api.delete('/wishlist/clear/all').then(unwrap),
}

/* ---------- ADDRESSES ---------- */
export const addressApi = {
  list: () => api.get('/addresses').then(unwrap),
  create: (payload) => api.post('/addresses', payload).then(unwrap),
  update: (id, payload) => api.put(`/addresses/${id}`, payload).then(unwrap),
  remove: (id) => api.delete(`/addresses/${id}`).then(unwrap),
  setDefault: (id) => api.put(`/addresses/${id}/default`).then(unwrap),
}

/* ---------- COUPONS ---------- */
export const couponApi = {
  validate: (code, subtotal) => api.post('/coupons/validate', { code, subtotal }).then(unwrap),
  list: () => api.get('/coupons').then(unwrap),
  create: (payload) => api.post('/coupons', payload).then(unwrap),
  update: (id, payload) => api.put(`/coupons/${id}`, payload).then(unwrap),
  remove: (id) => api.delete(`/coupons/${id}`).then(unwrap),
}

/* ---------- INVENTORY ---------- */
export const inventoryApi = {
  list: (params) => api.get('/inventory', { params }).then(unwrap),
  history: () => api.get('/inventory/history').then(unwrap),
  restock: (id, qty) => api.put(`/inventory/${id}/restock`, { qty }).then(unwrap),
  adjust: (id, qty, reason) => api.put(`/inventory/${id}/adjust`, { qty, reason }).then(unwrap),
  bulkRestock: (ids, qty) => api.post('/inventory/bulk-restock', { ids, qty }).then(unwrap),
}

/* ---------- DELIVERY PARTNERS ---------- */
export const deliveryApi = {
  list: () => api.get('/delivery-partners').then(unwrap),
  get: (id) => api.get(`/delivery-partners/${id}`).then(unwrap),
  create: (payload) => api.post('/delivery-partners', payload).then(unwrap),
  update: (id, payload) => api.put(`/delivery-partners/${id}`, payload).then(unwrap),
  toggle: (id) => api.put(`/delivery-partners/${id}/toggle`).then(unwrap),
  removeMany: (ids) => api.post('/delivery-partners/delete', { ids }).then(unwrap),
}

/* ---------- NOTIFICATIONS ---------- */
export const notificationApi = {
  list: () => api.get('/notifications').then(unwrap),
  markRead: (id) => api.put(`/notifications/${id}/read`).then(unwrap),
  markAllRead: () => api.put('/notifications/read-all').then(unwrap),
}

/* ---------- REVIEWS ---------- */
export const reviewApi = {
  list: (params) => api.get('/reviews', { params }).then(unwrap),
  create: (productId, rating, comment) => api.post('/reviews', { productId, rating, comment }).then(unwrap),
  remove: (id) => api.delete(`/reviews/${id}`).then(unwrap),
}

/* ---------- USERS / CUSTOMERS (admin) ---------- */
export const customerApi = {
  list: (params) => api.get('/users/customers', { params }).then(unwrapPaged),
  get: (id) => api.get(`/users/customers/${id}`).then(unwrap),
  update: (id, payload) => api.put(`/users/customers/${id}`, payload).then(unwrap),
  addNote: (id, text) => api.post(`/users/customers/${id}/notes`, { text }).then(unwrap),
  deleteMany: (ids) => api.post('/users/customers/delete', { ids }).then(unwrap),
}

/* ---------- ADMIN ---------- */
export const adminApi = {
  stats: () => api.get('/admin/stats').then(unwrap),
  weeklyRevenue: () => api.get('/admin/weekly-revenue').then(unwrap),
  monthlyRevenue: () => api.get('/admin/monthly-revenue').then(unwrap),
  orderTrend: () => api.get('/admin/order-trend').then(unwrap),
  categoryDistribution: () => api.get('/admin/category-distribution').then(unwrap),
  topProducts: () => api.get('/admin/top-products').then(unwrap),
  lowStock: () => api.get('/admin/low-stock').then(unwrap),
  activity: () => api.get('/admin/activity').then(unwrap),
  analytics: () => api.get('/admin/analytics').then(unwrap),
  reports: () => api.get('/admin/reports').then(unwrap),
}
