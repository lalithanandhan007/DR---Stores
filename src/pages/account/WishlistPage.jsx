import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, ShoppingBag, Trash2, ShoppingCart, PackageOpen } from 'lucide-react'
import AccountLayout from '../../components/account/AccountLayout'
import { useWishlist } from '../../context/AuthContext'
import { useCart, useToast } from '../../context/CartContext'

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist()
  const { addItem } = useCart()
  const { addToast } = useToast()

  const moveToCart = (product) => {
    const weight = product.weightOptions?.[0] || ''
    addItem(product, weight, 1)
    removeFromWishlist(product.id)
    addToast(`${product.name} added to cart 🛒`, 'success', 3000)
  }

  const handleMoveAll = () => {
    wishlist.forEach((p) => addItem(p, p.weightOptions?.[0] || '', 1))
    addToast(`${wishlist.length} item${wishlist.length > 1 ? 's' : ''} moved to cart`, 'success', 3000)
    clearWishlist()
  }

  const saving = (p) => p.originalPrice > p.price ? Math.round((1 - p.price / p.originalPrice) * 100) : 0

  return (
    <AccountLayout title="My Wishlist" subtitle={`${wishlist.length} item${wishlist.length === 1 ? '' : 's'} saved for later.`}>
      {wishlist.length === 0 ? (
        <div className="bg-white rounded-3xl border border-black/5 shadow-soft py-16 px-6 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }} className="w-20 h-20 mx-auto rounded-full bg-red-50 flex items-center justify-center">
            <Heart className="w-9 h-9 text-red-300" />
          </motion.div>
          <h3 className="mt-6 font-serif-display text-2xl font-bold text-dark">Your wishlist is empty</h3>
          <p className="mt-2 text-sm text-dark/45 font-light max-w-sm mx-auto">Tap the heart on any product to save it here for later.</p>
          <Link to="/vegetables" className="mt-7 inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-primary to-primary-dark text-white font-bold text-sm shadow-lg shadow-primary/15 hover:shadow-xl hover:-translate-y-0.5 transition-all">
            <PackageOpen className="w-4 h-4" /> Explore Products
          </Link>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-dark/45">{wishlist.length} saved item{wishlist.length === 1 ? '' : 's'}</p>
            <div className="flex items-center gap-2">
              <button onClick={handleMoveAll} className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary/8 text-primary text-xs font-bold hover:bg-primary hover:text-white transition-all duration-300">
                <ShoppingCart className="w-3.5 h-3.5" /> Move All to Cart
              </button>
              <button onClick={() => { clearWishlist(); addToast('Wishlist cleared', 'info') }} className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-black/8 text-xs font-bold text-dark/50 hover:border-red-300 hover:text-red-500 transition-all duration-300">
                <Trash2 className="w-3.5 h-3.5" /> Clear All
              </button>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {wishlist.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: i * 0.06 }}
                className="group bg-white rounded-3xl border border-black/5 shadow-soft p-4 flex gap-4 hover:shadow-card hover:-translate-y-0.5 transition-all duration-300"
              >
                <Link to={`/vegetables/${product.id}`} className="relative w-24 h-24 rounded-2xl flex items-center justify-center shrink-0 overflow-hidden" style={{ background: `linear-gradient(135deg, ${product.gradient?.[0] || '#4CAF50'}25, ${product.gradient?.[1] || '#2E7D32'}10)` }}>
                  <span className="text-5xl drop-shadow-sm group-hover:scale-110 transition-transform duration-300">{product.emoji}</span>
                </Link>

                <div className="flex-1 min-w-0 flex flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <Link to={`/vegetables/${product.id}`} className="text-sm font-bold text-dark truncate hover:text-primary transition-colors">{product.name}</Link>
                    <button onClick={() => { removeFromWishlist(product.id); addToast('Removed from wishlist', 'info', 2500) }} className="w-7 h-7 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50 shrink-0 transition-colors" aria-label="Remove">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-base font-black text-dark">₹{product.price}</span>
                    {product.originalPrice > product.price && (
                      <>
                        <span className="text-xs text-dark/35 line-through">₹{product.originalPrice}</span>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">{saving(product)}% off</span>
                      </>
                    )}
                  </div>
                  <p className="text-[11px] text-dark/40 mt-0.5">per {product.weightOptions?.[0] || product.unit}</p>

                  <button
                    onClick={() => moveToCart(product)}
                    className="mt-auto inline-flex items-center justify-center gap-1.5 w-full px-3 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white text-xs font-bold shadow-md shadow-primary/15 hover:shadow-lg transition-all"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" /> Move to Cart
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </AccountLayout>
  )
}
