import { AnimatePresence, motion } from 'framer-motion'
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { useCart } from '../../context/CartContext'

export default function CartPreview() {
  const { cartItems, totalItems, totalPrice, totalSaved, previewOpen, setPreviewOpen, updateQty, removeItem } = useCart()

  return (
    <AnimatePresence>
      {previewOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-dark/30 backdrop-blur-sm z-[60]"
            onClick={() => setPreviewOpen(false)}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-[65] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-black/5">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <ShoppingBag className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-dark">Your Cart</h3>
                  <p className="text-xs text-dark/50">{totalItems} item{totalItems !== 1 ? 's' : ''}</p>
                </div>
              </div>
              <button
                onClick={() => setPreviewOpen(false)}
                className="w-9 h-9 rounded-full bg-black/5 flex items-center justify-center text-dark/50 hover:text-dark hover:bg-black/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <span className="text-6xl mb-4">🛒</span>
                  <p className="text-base font-bold text-dark/70">Your cart is empty</p>
                  <p className="text-sm text-dark/45 mt-1">Add some fresh vegetables to get started!</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {cartItems.map(({ product, weight, qty }, idx) => {
                    const key = `${product.id}-${weight}`
                    return (
                      <motion.div
                        key={key}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="flex gap-3 p-3 rounded-2xl bg-cream border border-black/5"
                      >
                        {/* Emoji */}
                        <div
                          className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
                          style={{
                            background: `linear-gradient(135deg, ${product.gradient[0]}30, ${product.gradient[1]}15)`,
                          }}
                        >
                          <span className="text-2xl">{product.emoji}</span>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-dark truncate">{product.name}</h4>
                          <p className="text-[11px] text-dark/45 mt-0.5">{weight} • ₹{product.price}/{product.unit}</p>

                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center border border-black/10 rounded-full overflow-hidden bg-white">
                              <button
                                onClick={() => updateQty(key, qty - 1)}
                                className="w-7 h-7 flex items-center justify-center text-dark/50 hover:text-dark"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-6 text-center text-xs font-bold">{qty}</span>
                              <button
                                onClick={() => updateQty(key, qty + 1)}
                                className="w-7 h-7 flex items-center justify-center text-dark/50 hover:text-dark"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-dark">₹{product.price * qty}</span>
                              <button
                                onClick={() => removeItem(key)}
                                className="w-7 h-7 rounded-full flex items-center justify-center text-dark/30 hover:text-red-500 hover:bg-red-50 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="px-6 py-5 border-t border-black/5 bg-white">
                {totalSaved > 0 && (
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-secondary">You're saving</span>
                    <span className="text-sm font-bold text-secondary">₹{totalSaved}</span>
                  </div>
                )}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold text-dark/70">Total</span>
                  <span className="text-xl font-extrabold text-dark">₹{totalPrice}</span>
                </div>
                <button className="w-full h-12 rounded-full bg-gradient-to-r from-primary to-primary-dark text-white font-bold text-sm hover:shadow-cta hover:-translate-y-0.5 transition-all duration-300">
                  Proceed to Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
