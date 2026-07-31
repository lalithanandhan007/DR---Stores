import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { CartProvider, ToastProvider, RecentProvider } from './context/CartContext'
import Navbar from './components/Navbar'
import LandingPage from './pages/LandingPage'
import VegetablesPage from './pages/VegetablesPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import PaymentSuccess from './pages/PaymentSuccess'
import PaymentFailure from './pages/PaymentFailure'
import CartPreview from './components/shop/CartPreview'
import ToastContainer from './components/shop/ToastContainer'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <ToastProvider>
          <RecentProvider>
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
              </Routes>
              <CartPreview />
              <ToastContainer />
            </div>
          </RecentProvider>
        </ToastProvider>
      </CartProvider>
    </BrowserRouter>
  )
}

export default App
