import { BrowserRouter, Routes, Route, useLocation, Link } from 'react-router-dom'
import { lazy, Suspense, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Leaf } from 'lucide-react'
import { CartProvider, ToastProvider, RecentProvider } from './context/CartContext'
import { AuthProvider, WishlistProvider, SettingsProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import LandingPage from './pages/LandingPage'
import VegetablesPage from './pages/VegetablesPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import PaymentSuccess from './pages/PaymentSuccess'
import PaymentFailure from './pages/PaymentFailure'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import VerifyOtpPage from './pages/auth/VerifyOtpPage'
import ResetPasswordPage from './pages/auth/ResetPasswordPage'
import ProfilePage from './pages/account/ProfilePage'
import OrdersPage from './pages/account/OrdersPage'
import WishlistPage from './pages/account/WishlistPage'
import AddressesPage from './pages/account/AddressesPage'
import SettingsPage from './pages/account/SettingsPage'
import CartPreview from './components/shop/CartPreview'
import ToastContainer from './components/shop/ToastContainer'

/* Admin section is lazy-loaded — pulls in recharts only when an admin visits */
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'))
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'))
const ProductsPage = lazy(() => import('./pages/admin/ProductsPage'))
const ProductFormPage = lazy(() => import('./pages/admin/ProductFormPage'))
const CategoriesPage = lazy(() => import('./pages/admin/CategoriesPage'))
const AdminOrdersPage = lazy(() => import('./pages/admin/OrdersPage'))
const AdminOrderDetailPage = lazy(() => import('./pages/admin/OrderDetailPage'))
const CustomersPage = lazy(() => import('./pages/admin/CustomersPage'))
const CustomerDetailPage = lazy(() => import('./pages/admin/CustomerDetailPage'))
const InventoryPage = lazy(() => import('./pages/admin/InventoryPage'))
const DeliveryPage = lazy(() => import('./pages/admin/DeliveryPage'))
const CouponsPage = lazy(() => import('./pages/admin/CouponsPage'))

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function NotFound() {
  return (
    <div className="min-h-screen bg-cream pt-28 flex items-center justify-center px-5">
      <div className="text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }} className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lift mb-6">
          <Leaf className="w-9 h-9 text-white" />
        </motion.div>
        <p className="text-6xl font-black text-dark/10 font-serif-display">404</p>
        <h1 className="font-serif-display text-2xl font-bold text-dark mt-2">Page not found</h1>
        <p className="text-sm text-dark/45 mt-2 font-light">The page you're looking for seems to have been eaten by a hungry goat. 🐐</p>
        <Link to="/" className="mt-6 inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-primary to-primary-dark text-white font-bold text-sm shadow-lg shadow-primary/15 hover:shadow-xl hover:-translate-y-0.5 transition-all">
          Back to Home
        </Link>
      </div>
    </div>
  )
}

function AdminLoader() {
  return (
    <div className="min-h-screen bg-[#F5F7F5] flex flex-col items-center justify-center gap-5">
      <div className="relative">
        <span className="absolute inset-0 rounded-3xl bg-primary/20 blur-xl animate-pulse" />
        <motion.div
          animate={{ rotate: [0, 180, 360] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
          className="relative w-14 h-14 rounded-3xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lift"
        >
          <Leaf className="w-6 h-6 text-white" />
        </motion.div>
      </div>
      <div className="text-center">
        <p className="font-serif-display font-extrabold text-dark">D.R<span className="text-primary">.</span>STORES</p>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/70 mt-1">Loading admin panel…</p>
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <ToastProvider>
            <RecentProvider>
              <WishlistProvider>
                <SettingsProvider>
                  <div className="grain min-h-screen bg-cream text-dark selection:bg-primary/20">
                    <ScrollToTop />
                    <Navbar />
                    <Routes>
                      <Route path="/" element={<LandingPage />} />
                      <Route path="/vegetables" element={<VegetablesPage />} />
                      <Route path="/vegetables/:id" element={<ProductDetailPage />} />
                      <Route path="/cart" element={<CartPage />} />
                      <Route path="/checkout" element={<CheckoutPage />} />
                      <Route path="/payment-success" element={<PaymentSuccess />} />
                      <Route path="/payment-failure" element={<PaymentFailure />} />
                      {/* Auth */}
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/register" element={<RegisterPage />} />
                      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                      <Route path="/verify-otp" element={<VerifyOtpPage />} />
                      <Route path="/reset-password" element={<ResetPasswordPage />} />
                      {/* Account (protected) */}
                      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                      <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
                      <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
                      <Route path="/addresses" element={<ProtectedRoute><AddressesPage /></ProtectedRoute>} />
                      <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
                      {/* Admin (role-protected, lazy-loaded) */}
                      <Route
                        path="/admin"
                        element={
                          <ProtectedRoute role="admin">
                            <Suspense fallback={<AdminLoader />}>
                              <AdminLayout />
                            </Suspense>
                          </ProtectedRoute>
                        }
                      >
                        <Route index element={<AdminDashboardPage />} />
                        <Route path="dashboard" element={<AdminDashboardPage />} />
                        <Route path="products" element={<ProductsPage />} />
                        <Route path="products/new" element={<ProductFormPage />} />
                        <Route path="products/edit/:id" element={<ProductFormPage />} />
                        <Route path="categories" element={<CategoriesPage />} />
                        <Route path="orders" element={<AdminOrdersPage />} />
                        <Route path="orders/:id" element={<AdminOrderDetailPage />} />
                        <Route path="customers" element={<CustomersPage />} />
                        <Route path="customers/:id" element={<CustomerDetailPage />} />
                        <Route path="inventory" element={<InventoryPage />} />
                        <Route path="delivery" element={<DeliveryPage />} />
                        <Route path="coupons" element={<CouponsPage />} />
                      </Route>
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                    <CartPreview />
                    <ToastContainer />
                  </div>
                </SettingsProvider>
              </WishlistProvider>
            </RecentProvider>
          </ToastProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
