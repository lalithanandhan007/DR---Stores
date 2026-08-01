import { useState, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'
import { Heart, ShoppingCart, Eye, Star, Minus, Plus, Leaf, Clock, Award, TrendingUp, MapPin, Tag, Check } from 'lucide-react'
import { useCart, useToast } from '../../context/CartContext'
import { useWishlist } from '../../context/AuthContext'
import ProductVisual from './ProductVisual'

/* ---------- Premium badge component ---------- */
function Badge({ icon: Icon, label, variant = 'default' }) {
  const styles = {
    organic: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    fresh: 'bg-sky-50 text-sky-700 border-sky-200/60',
    bestseller: 'bg-amber-50 text-amber-700 border-amber-200/60',
    limited: 'bg-rose-50 text-rose-700 border-rose-200/60',
    local: 'bg-violet-50 text-violet-700 border-violet-200/60',
    default: 'bg-primary/8 text-primary border-primary/15',
  }
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.08em] px-2.5 py-1 rounded-full border backdrop-blur-sm ${styles[variant] || styles.default}`}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  )
}

/* ---------- Mouse spotlight effect ---------- */
function useSpotlight() {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const handleMouse = useCallback((e) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    x.set(e.clientX - rect.left)
    y.set(e.clientY - rect.top)
  }, [x, y])

  return { ref, x, y, handleMouse }
}

/* ---------- Ripple effect on click ---------- */
function Ripple({ x, y }) {
  return (
    <motion.span
      initial={{ width: 0, height: 0, opacity: 0.5 }}
      animate={{ width: 200, height: 200, opacity: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="absolute rounded-full bg-white/30 pointer-events-none"
      style={{ left: x - 100, top: y - 100 }}
    />
  )
}

/* ---------- Heart particles ---------- */
function HeartParticles({ show }) {
  if (!show) return null
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {[...Array(6)].map((_, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 1, x: 0, y: 0, scale: 0.5 }}
          animate={{
            opacity: 0,
            x: (Math.random() - 0.5) * 80,
            y: -40 - Math.random() * 60,
            scale: 0.8 + Math.random() * 0.4,
          }}
          transition={{ duration: 0.8 + Math.random() * 0.3, delay: i * 0.05, ease: 'easeOut' }}
          className="absolute text-red-400"
          style={{ left: '50%', top: '50%', fontSize: 10 + Math.random() * 6 }}
        >
          ♥
        </motion.span>
      ))}
    </div>
  )
}

/* ==========================================
   PREMIUM PRODUCT CARD
   ========================================== */
export default function ProductCard({ product, index = 0 }) {
  const [selectedWeight, setSelectedWeight] = useState(product.weightOptions?.[0] || '')
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [showParticles, setShowParticles] = useState(false)
  const [ripples, setRipples] = useState([])
  const { addItem } = useCart()
  const { addToast } = useToast()
  const { toggleWishlist, isWishlisted } = useWishlist()
  const liked = isWishlisted(product.id)
  const spotlight = useSpotlight()

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const handleAdd = (e) => {
    e.preventDefault()
    e.stopPropagation()
    // Ripple
    const rect = e.currentTarget.getBoundingClientRect()
    const rx = e.clientX - rect.left
    const ry = e.clientY - rect.top
    setRipples((r) => [...r, { id: Date.now(), x: rx, y: ry }])
    setTimeout(() => setRipples((r) => r.slice(1)), 700)

    addItem(product, selectedWeight, qty)
    setAdded(true)
    addToast(`${product.name} added to cart`, 'success')
    setTimeout(() => setAdded(false), 1200)
  }

  const handleLike = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!liked) {
      setShowParticles(true)
      addToast(`${product.name} added to wishlist`, 'info')
      setTimeout(() => setShowParticles(false), 1000)
    }
    toggleWishlist(product)
  }

  // Card tilt based on mouse position
  const tiltX = useTransform(spotlight.x, [0, 400], [3, -3])
  const tiltY = useTransform(spotlight.y, [0, 500], [-3, 3])

  return (
    <motion.div
      ref={spotlight.ref}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={spotlight.handleMouse}
      className="group relative"
      style={{ perspective: 800 }}
    >
      <Link to={`/vegetables/${product.id}`} className="block">
        <motion.div
          whileHover={{ y: -10 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          style={{ rotateX: hovered ? tiltY : 0, rotateY: hovered ? tiltX : 0 }}
          className="relative rounded-[1.5rem] bg-white overflow-hidden transition-shadow duration-500"
          style={{
            boxShadow: hovered
              ? `0 25px 60px -12px ${product.gradient[0]}25, 0 8px 24px -8px rgba(0,0,0,0.08)`
              : '0 4px 24px -4px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)',
          }}
        >
          {/* Animated border glow */}
          <motion.div
            animate={hovered ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 rounded-[1.5rem] pointer-events-none z-10"
            style={{
              border: `2px solid ${product.gradient[0]}30`,
              boxShadow: `inset 0 0 20px ${product.gradient[0]}08`,
            }}
          />

          {/* Mouse spotlight */}
          {hovered && (
            <motion.div
              className="absolute inset-0 pointer-events-none z-[5] rounded-[1.5rem]"
              style={{
                background: `radial-gradient(circle 180px at ${spotlight.x.get()}px ${spotlight.y.get()}px, ${product.gradient[0]}12, transparent)`,
              }}
            />
          )}

          {/* ====== VISUAL AREA (top 55%) ====== */}
          <div className="relative h-72 sm:h-80 lg:h-[22rem] overflow-hidden">
            <ProductVisual product={product} isHovered={hovered} />

            {/* Badges — top left */}
            <div className="absolute top-3.5 left-3.5 flex flex-col gap-1.5 z-10">
              {product.badges.includes('organic') && (
                <Badge icon={Leaf} label="Organic" variant="organic" />
              )}
              {product.badges.includes('fresh') && (
                <Badge icon={Clock} label="Fresh Today" variant="fresh" />
              )}
              {product.rating >= 4.8 && (
                <Badge icon={Award} label="Best Seller" variant="bestseller" />
              )}
              {product.stock <= 30 && (
                <Badge icon={TrendingUp} label="Limited Stock" variant="limited" />
              )}
            </div>

            {/* Discount chip — top right */}
            {discount > 0 && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute top-3.5 right-3.5 z-10"
              >
                <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-white bg-gradient-to-r from-accent via-orange-500 to-red-400 px-3 py-1.5 rounded-full shadow-lg">
                  <Tag className="w-3 h-3" />
                  {discount}% OFF
                </span>
              </motion.div>
            )}

            {/* Hover actions */}
            <AnimatePresence>
              {hovered && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.25 }}
                  className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between z-10"
                >
                  {/* Wishlist */}
                  <div className="relative">
                    <button
                      onClick={handleLike}
                      className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg backdrop-blur-md transition-all duration-300 ${
                        liked
                          ? 'bg-red-500 text-white shadow-red-500/30'
                          : 'bg-white/80 text-dark/50 hover:text-red-500 hover:bg-white'
                      }`}
                    >
                      <Heart className="w-4.5 h-4.5" fill={liked ? 'currentColor' : 'none'} />
                    </button>
                    <HeartParticles show={showParticles} />
                  </div>
                  {/* Quick View */}
                  <Link
                    to={`/vegetables/${product.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center shadow-lg text-dark/50 hover:text-primary hover:bg-white transition-all duration-300"
                  >
                    <Eye className="w-4.5 h-4.5" />
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ====== CONTENT AREA ====== */}
          <div className="p-5 sm:p-6">
            {/* Rating row */}
            <div className="flex items-center gap-2 mb-2.5">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? 'text-accent fill-accent' : 'text-dark/12'}`} />
                ))}
              </div>
              <span className="text-[11px] font-semibold text-dark/45">{product.rating}</span>
              <span className="text-[11px] text-dark/30">({product.reviews})</span>
            </div>

            {/* Name — large, dominant */}
            <h3 className="text-[17px] font-extrabold text-dark leading-snug tracking-tight group-hover:text-primary transition-colors duration-300">
              {product.name}
            </h3>

            {/* Description — soft, small */}
            <p className="mt-1.5 text-[12.5px] text-dark/42 leading-relaxed line-clamp-2 font-light">
              {product.description}
            </p>

            {/* Price row — dominant */}
            <div className="mt-4 flex items-end gap-2.5">
              <span className="text-[1.65rem] font-black text-dark leading-none tracking-tight">
                ₹{product.price}
              </span>
              <span className="text-[11px] text-dark/35 font-medium mb-0.5">/{product.unit}</span>
              {product.originalPrice && (
                <>
                  <span className="text-sm text-dark/28 line-through mb-0.5">₹{product.originalPrice}</span>
                  <motion.span
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200/50 px-2 py-0.5 rounded-full mb-0.5"
                  >
                    Save ₹{product.originalPrice - product.price}
                  </motion.span>
                </>
              )}
            </div>

            {/* Divider */}
            <div className="mt-4 h-px bg-gradient-to-r from-transparent via-black/8 to-transparent" />

            {/* Weight pills */}
            {product.weightOptions && product.weightOptions.length > 1 && (
              <div className="mt-3.5 flex flex-wrap gap-1.5">
                {product.weightOptions.map((w) => (
                  <button
                    key={w}
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedWeight(w) }}
                    className={`relative text-[11px] font-bold px-3.5 py-1.5 rounded-full border transition-all duration-300 ${
                      selectedWeight === w
                        ? 'bg-dark text-white border-dark shadow-soft'
                        : 'bg-cream text-dark/55 border-black/8 hover:border-dark/25 hover:text-dark'
                    }`}
                  >
                    {w}
                  </button>
                ))}
              </div>
            )}

            {/* Quantity + Add to Cart */}
            <div className="mt-4 flex items-center gap-3">
              {/* Quantity — circular controls */}
              <div className="flex items-center gap-0.5 bg-cream rounded-full border border-black/6">
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setQty((q) => Math.max(1, q - 1)) }}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-dark/40 hover:text-dark hover:bg-white transition-all duration-200"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <motion.span
                  key={qty}
                  initial={{ scale: 0.8, opacity: 0.5 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-8 text-center text-[13px] font-extrabold text-dark"
                >
                  {qty}
                </motion.span>
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setQty((q) => q + 1) }}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-dark/40 hover:text-dark hover:bg-white transition-all duration-200"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Add to Cart — premium gradient button */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleAdd}
                className={`relative flex-1 h-11 rounded-full text-[13px] font-bold flex items-center justify-center gap-2 overflow-hidden transition-all duration-500 ${
                  added
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                    : 'bg-gradient-to-r from-primary via-secondary to-primary text-white shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5'
                }`}
              >
                <AnimatePresence mode="wait">
                  {added ? (
                    <motion.span
                      key="added"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="flex items-center gap-1.5"
                    >
                      <Check className="w-4 h-4" strokeWidth={3} />
                      Added!
                    </motion.span>
                  ) : (
                    <motion.span
                      key="add"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="flex items-center gap-1.5"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </motion.span>
                  )}
                </AnimatePresence>
                {/* Ripple effects */}
                {ripples.map((r) => (
                  <Ripple key={r.id} x={r.x} y={r.y} />
                ))}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  )
}
