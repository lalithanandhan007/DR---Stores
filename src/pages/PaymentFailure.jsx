import { Link, useLocation, useSearchParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, RefreshCw, ArrowLeft, ShieldAlert } from 'lucide-react'
import Footer from '../components/Footer'

export default function PaymentFailure() {
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  // Get error data from either router state or URL query params
  const state = location.state || {}
  const orderId = state.orderId || searchParams.get('orderId') || null
  const errorMsg = state.error || searchParams.get('error') || 'Payment failed'
  const amount = state.amount || parseFloat(searchParams.get('amount') || '0') || 0
  const errorCode = state.code || searchParams.get('code') || null

  const [retrying, setRetrying] = useState(false)

  const handleRetry = () => {
    setRetrying(true)
    if (orderId) {
      // Navigate to checkout with orderId to resume payment
      navigate('/checkout', { state: { retryOrderId: orderId } })
    } else {
      navigate('/checkout')
    }
    setRetrying(false)
  }

  return (
    <div className="min-h-screen bg-cream pt-28">
      <div className="max-w-lg mx-auto px-5 sm:px-8 text-center">
        {/* Error animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
          className="w-28 h-28 mx-auto rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-2xl shadow-red-500/30 mb-8"
        >
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.6, type: 'spring', stiffness: 300 }}
          >
            <X className="w-14 h-14 text-white" strokeWidth={3} />
          </motion.div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="font-serif-display text-3xl sm:text-4xl font-bold text-dark tracking-tight"
        >
          Payment Failed
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="mt-3 text-dark/50 text-[15px] font-light max-w-sm mx-auto"
        >
          Something went wrong with your payment. Don't worry — your cart is safe. You can retry or choose another payment method.
        </motion.p>

        {/* Error info */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8 p-5 rounded-2xl bg-red-50 border border-red-200/60"
        >
          <div className="flex items-center justify-center gap-3">
            <ShieldAlert className="w-6 h-6 text-red-500" />
            <div className="text-left">
              <p className="text-sm font-bold text-red-700">Transaction could not be completed</p>
              <p className="text-xs text-red-500/70 mt-0.5">{errorMsg} · No amount has been deducted from your account</p>
              {errorCode && <p className="text-[10px] text-red-500/50 mt-1">Error code: {errorCode}</p>}
            </div>
          </div>
          {(amount > 0 || orderId) && (
            <div className="mt-3 pt-3 border-t border-red-200/60 space-y-1.5">
              {amount > 0 && (
                <p className="flex items-center justify-between text-xs">
                  <span className="text-red-500/80 font-semibold">Amount</span>
                  <span className="text-red-600 font-bold">₹{amount}</span>
                </p>
              )}
              {orderId && (
                <p className="flex items-center justify-between text-xs">
                  <span className="text-red-500/80 font-semibold">Order ID</span>
                  <span className="text-red-600 font-bold">{orderId}</span>
                </p>
              )}
            </div>
          )}
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85 }}
          className="mt-8 flex flex-col sm:flex-row gap-3"
        >
          <Link to="/checkout" className="flex-1 h-13 rounded-2xl border-2 border-black/10 text-sm font-bold text-dark/70 flex items-center justify-center gap-2 hover:border-dark/25 transition-all">
            <ArrowLeft className="w-4 h-4" /> Go Back
          </Link>
          <button
            onClick={handleRetry}
            disabled={retrying}
            className="flex-1 h-13 rounded-2xl bg-gradient-to-r from-primary to-primary-dark text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/15 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-60"
          >
            {retrying ? (
              <>
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-4 h-4 border-3 border-white border-t-transparent rounded-full" />
                Retrying...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" /> Retry Payment
              </>
            )}
          </button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-6 text-[11px] text-dark/30"
        >
          If the issue persists, please contact us at hello@drstores.in
        </motion.p>
      </div>
      <div className="mt-16"><Footer /></div>
    </div>
  )
}
