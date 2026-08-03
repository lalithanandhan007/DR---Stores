import { useState, useEffect, useMemo, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronRight, Star, Heart, ShoppingCart, Minus, Plus, Leaf, Clock, Truck,
  ShieldCheck, MapPin, Thermometer, Award, ThumbsUp, Eye, Package, BadgeCheck,
  ArrowLeft, Check, Share2,
} from 'lucide-react'
import { useProducts } from '../context/ProductsContext'
import ProductCard from '../components/shop/ProductCard'
import ProductVisual from '../components/shop/ProductVisual'
import { useCart, useToast, useRecent } from '../context/CartContext'
import { useWishlist } from '../context/AuthContext'
import Footer from '../components/Footer'

/* ---------- Premium tab button ---------- */
function TabBtn({ label, icon: Icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 whitespace-nowrap ${
        active ? 'bg-dark text-white shadow-lg shadow-dark/15' : 'text-dark/50 hover:text-dark hover:bg-white'
      }`}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {label}
    </button>
  )
}

/* ---------- Review card ---------- */
function ReviewCard({ review, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06 }}
      className="p-5 rounded-2xl bg-white border border-black/5 hover:shadow-soft transition-shadow duration-300"
    >
      <div className="flex items-start gap-3.5">
        <span className="w-11 h-11 rounded-2xl bg-primary/8 flex items-center justify-center text-lg shrink-0">{review.avatar}</span>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-bold text-dark">{review.name}</span>
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, j) => (
                <Star key={j} className={`w-3 h-3 ${j < review.rating ? 'text-accent fill-accent' : 'text-dark/12'}`} />
              ))}
            </div>
            <span className="text-[11px] text-dark/30">{review.date}</span>
          </div>
          <p className="text-[13px] text-dark/60 leading-relaxed">{review.text}</p>
          <button className="mt-2.5 inline-flex items-center gap-1.5 text-[11px] text-dark/35 hover:text-primary transition-colors font-medium">
            <ThumbsUp className="w-3 h-3" /> Helpful ({review.helpful})
          </button>
        </div>
      </div>
    </motion.div>
  )
}

const sampleReviews = [
  { name: 'Priya S.', rating: 5, text: 'Absolutely fresh! The tomatoes were firm and juicy. Great quality as always from D.R.STORES.', date: '2 days ago', helpful: 24, avatar: '🌸' },
  { name: 'Rahul M.', rating: 5, text: 'Best vegetables I\'ve ordered online. The freshness is unmatched. Delivery was quick too!', date: '5 days ago', helpful: 18, avatar: '🌟' },
  { name: 'Ananya K.', rating: 4, text: 'Good quality and reasonable prices. The packaging was also nice. Will order again.', date: '1 week ago', helpful: 12, avatar: '✨' },
  { name: 'Vikram R.', rating: 5, text: 'My go-to store for fresh veggies. The organic selection is excellent. Highly recommended!', date: '2 weeks ago', helpful: 31, avatar: '💚' },
  { name: 'Meera T.', rating: 4, text: 'Fresh produce, fair prices, and friendly delivery. What more do you need?', date: '3 weeks ago', helpful: 9, avatar: '🌿' },
]

const nutritionIcons = {
  calories: '🔥', protein: '💪', carbs: '🌾', fiber: '🌿', fat: '🫒',
}

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { products, productById } = useProducts()
  const product = productById(id)
  const [selectedWeight, setSelectedWeight] = useState('')
  const [qty, setQty] = useState(1)
  const [activeTab, setActiveTab] = useState('nutrition')
  const [added, setAdded] = useState(false)
  const [zoomed, setZoomed] = useState(false)
  const { addItem } = useCart()
  const { addToast } = useToast()
  const { addRecent } = useRecent()
  const { toggleWishlist, isWishlisted } = useWishlist()
  const liked = isWishlisted(product?.id)
  const purchaseRef = useRef(null)

  useEffect(() => {
    if (product) {
      setSelectedWeight((w) => w || product.weightOptions?.[0] || '')
      setQty(1)
      addRecent(product)
    }
    window.scrollTo(0, 0)
  }, [id, product, addRecent])

  const related = useMemo(() => {
    if (!product) return []
    return products.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4)
  }, [product, products])

  const boughtTogether = useMemo(() => {
    if (!product) return []
    return products.filter((p) => p.id !== product.id && p.tags.some((t) => product.tags.includes(t))).slice(0, 3)
  }, [product, products])

  if (!product) {
    return (
      <div className="min-h-screen bg-cream pt-28 flex items-center justify-center">
        <div className="text-center">
          <span className="text-7xl mb-5 block">🔍</span>
          <h1 className="text-3xl font-bold text-dark/65">Product not found</h1>
          <Link to="/vegetables" className="mt-5 inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-primary to-primary-dark text-white font-bold text-sm hover:shadow-cta transition-all">
            <ArrowLeft className="w-4 h-4" /> Browse Vegetables
          </Link>
        </div>
      </div>
    )
  }

  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0

  const handleAdd = () => {
    addItem(product, selectedWeight, qty)
    setAdded(true)
    addToast(`${product.name} added to cart`, 'success')
    setTimeout(() => setAdded(false), 1200)
  }

  const tabs = [
    { id: 'nutrition', label: 'Nutrition', icon: Award },
    { id: 'benefits', label: 'Benefits', icon: Leaf },
    { id: 'origin', label: 'Origin', icon: MapPin },
    { id: 'storage', label: 'Storage', icon: Thermometer },
    { id: 'reviews', label: `Reviews (${product.reviews})`, icon: ThumbsUp },
  ]

  return (
    <div className="relative min-h-screen pt-28">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-[#f4f8f2] via-cream to-white" />
        <div className="ambient-orb w-[500px] h-[500px] -top-32 -right-40 green-blob opacity-30" />
        <div className="ambient-orb w-[400px] h-[400px] top-1/2 -left-40 orange-blob opacity-20" />
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm text-dark/40 mb-8"
        >
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/vegetables" className="hover:text-primary transition-colors">Vegetables</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-dark/65 font-medium">{product.name}</span>
        </motion.nav>

        {/* Main product section */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 mb-20">
          {/* ====== GALLERY ====== */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="relative rounded-[2rem] overflow-hidden cursor-zoom-in bg-white border border-black/5 aspect-square shadow-card"
              onClick={() => setZoomed(true)}
            >
              <ProductVisual product={product} size="detail" isHovered={false} />

              {/* Badges */}
              <div className="absolute top-5 left-5 flex flex-col gap-2 z-10">
                {product.badges.includes('organic') && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-white/90 backdrop-blur border border-emerald-200/60 px-3.5 py-1.5 rounded-full shadow-sm">
                    <Leaf className="w-3.5 h-3.5" /> Organic
                  </span>
                )}
                {product.badges.includes('fresh') && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 bg-white/90 backdrop-blur border border-sky-200/60 px-3.5 py-1.5 rounded-full shadow-sm">
                    <Clock className="w-3.5 h-3.5" /> Fresh Today
                  </span>
                )}
              </div>

              {discount > 0 && (
                <span className="absolute top-5 right-5 z-10 inline-flex items-center gap-1 text-xs font-extrabold text-white bg-gradient-to-r from-accent via-orange-500 to-red-400 px-3.5 py-1.5 rounded-full shadow-lg">
                  {discount}% OFF
                </span>
              )}

              {/* Zoom hint */}
              <div className="absolute bottom-5 right-5 glass-card rounded-xl px-3.5 py-2 flex items-center gap-2 text-xs font-medium text-dark/50">
                <Eye className="w-4 h-4" /> Click to zoom
              </div>
            </div>

            {/* Zoom overlay */}
            <AnimatePresence>
              {zoomed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[80] bg-dark/85 backdrop-blur-lg flex items-center justify-center cursor-zoom-out p-8"
                  onClick={() => setZoomed(false)}
                >
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    className="w-full max-w-2xl aspect-square rounded-[2rem] overflow-hidden bg-white shadow-2xl"
                  >
                    <ProductVisual product={product} size="detail" isHovered={false} />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* ====== PURCHASE PANEL (sticky) ====== */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            ref={purchaseRef}
            className="lg:sticky lg:top-28 lg:self-start"
          >
            {/* Top badges */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-primary bg-primary/8 border border-primary/12 px-3 py-1.5 rounded-full">
                <Package className="w-3 h-3" /> {product.category}
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-dark/50 bg-black/5 px-3 py-1.5 rounded-full">
                <BadgeCheck className="w-3 h-3" /> Premium Quality
              </span>
            </div>

            <h1 className="font-serif-display text-3xl sm:text-4xl font-bold text-dark tracking-tight leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-accent fill-accent' : 'text-dark/12'}`} />
                ))}
              </div>
              <span className="text-sm font-bold text-dark/60">{product.rating}</span>
              <span className="text-sm text-dark/35">({product.reviews} reviews)</span>
            </div>

            <p className="mt-4 text-[15px] text-dark/50 leading-relaxed font-light">{product.description}</p>

            {/* Price */}
            <div className="mt-6 flex items-end gap-3">
              <span className="text-[2.5rem] font-black text-dark leading-none tracking-tight">₹{product.price}</span>
              <span className="text-sm text-dark/35 mb-1.5">/{product.unit}</span>
              {product.originalPrice && (
                <>
                  <span className="text-lg text-dark/28 line-through mb-1">₹{product.originalPrice}</span>
                  <span className="text-sm font-bold text-emerald-600 bg-emerald-50 border border-emerald-200/50 px-3 py-1 rounded-full mb-1">
                    Save ₹{product.originalPrice - product.price}
                  </span>
                </>
              )}
            </div>

            {/* Stock */}
            <div className="mt-3 flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${product.stock > 30 ? 'bg-emerald-500' : product.stock > 10 ? 'bg-amber-500' : 'bg-red-500'}`} />
              <span className="text-sm font-medium text-dark/50">
                {product.stock > 30 ? 'In Stock — Ready to deliver' : product.stock > 10 ? `Only ${product.stock} left` : 'Low stock'}
              </span>
            </div>

            {/* Divider */}
            <div className="my-6 h-px bg-gradient-to-r from-transparent via-black/8 to-transparent" />

            {/* Weight selector */}
            {product.weightOptions && product.weightOptions.length > 0 && (
              <div className="mb-6">
                <span className="text-sm font-bold text-dark mb-3 block">Select Weight</span>
                <div className="flex flex-wrap gap-2">
                  {product.weightOptions.map((w) => (
                    <motion.button
                      key={w}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedWeight(w)}
                      className={`px-6 py-3 rounded-2xl text-sm font-bold border-2 transition-all duration-300 ${
                        selectedWeight === w
                          ? 'bg-dark text-white border-dark shadow-lg shadow-dark/15'
                          : 'bg-white text-dark/55 border-black/8 hover:border-dark/25 hover:text-dark'
                      }`}
                    >
                      {w}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + Add to Cart */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center border-2 border-black/8 rounded-2xl overflow-hidden bg-white">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-12 h-12 flex items-center justify-center text-dark/40 hover:text-dark hover:bg-black/5 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <motion.span
                  key={qty}
                  initial={{ scale: 0.8, opacity: 0.5 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-12 text-center text-lg font-extrabold text-dark"
                >
                  {qty}
                </motion.span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="w-12 h-12 flex items-center justify-center text-dark/40 hover:text-dark hover:bg-black/5 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleAdd}
                className={`flex-1 h-13 rounded-2xl text-base font-bold flex items-center justify-center gap-2.5 transition-all duration-500 ${
                  added
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                    : 'bg-gradient-to-r from-primary via-secondary to-primary text-white shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-0.5'
                }`}
              >
                <AnimatePresence mode="wait">
                  {added ? (
                    <motion.span key="added" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-2">
                      <Check className="w-5 h-5" strokeWidth={3} /> Added!
                    </motion.span>
                  ) : (
                    <motion.span key="add" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-2">
                      <ShoppingCart className="w-5 h-5" /> Add to Cart
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => { if (!liked) addToast('Added to wishlist', 'info'); toggleWishlist(product) }}
                className={`w-13 h-13 rounded-2xl border-2 flex items-center justify-center transition-all duration-300 ${
                  liked ? 'bg-red-50 border-red-200 text-red-500 shadow-lg shadow-red-500/15' : 'border-black/8 text-dark/35 hover:border-red-200 hover:text-red-500'
                }`}
              >
                <Heart className="w-5.5 h-5.5" fill={liked ? 'currentColor' : 'none'} />
              </motion.button>
            </div>

            {/* Delivery */}
            <div className="p-5 rounded-2xl bg-white border border-black/5 mb-4">
              <div className="flex items-center gap-3.5">
                <span className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Truck className="w-5.5 h-5.5" />
                </span>
                <div>
                  <p className="text-sm font-bold text-dark">Estimated delivery: 40 minutes</p>
                  <p className="text-xs text-dark/40 mt-0.5">Within 5 KM radius • Free delivery on orders above ₹200</p>
                </div>
              </div>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: ShieldCheck, label: 'Quality\nGuaranteed', color: 'text-primary', bg: 'bg-primary/8' },
                { icon: MapPin, label: 'Local\nSourced', color: 'text-secondary', bg: 'bg-secondary/8' },
                { icon: Thermometer, label: 'Cold\nChain', color: 'text-primary-dark', bg: 'bg-primary/8' },
              ].map((b) => (
                <div key={b.label} className="flex flex-col items-center gap-2 p-3.5 rounded-2xl bg-white border border-black/5">
                  <span className={`w-10 h-10 rounded-xl ${b.bg} flex items-center justify-center ${b.color}`}>
                    <b.icon className="w-5 h-5" />
                  </span>
                  <span className="text-[11px] font-bold text-dark/55 leading-tight text-center whitespace-pre-line">{b.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ====== INFO TABS ====== */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
            {tabs.map((tab) => (
              <TabBtn
                key={tab.id}
                label={tab.label}
                icon={tab.icon}
                active={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-3xl border border-black/5 p-6 sm:p-8 shadow-soft"
            >
              {activeTab === 'nutrition' && (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {Object.entries(product.nutrition).map(([key, val]) => (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: Object.keys(product.nutrition).indexOf(key) * 0.05 }}
                      className="flex items-center gap-3.5 p-4 rounded-2xl bg-cream border border-black/3 hover:shadow-soft transition-shadow"
                    >
                      <span className="text-2xl">{nutritionIcons[key] || '📊'}</span>
                      <div>
                        <span className="block text-[11px] text-dark/40 uppercase tracking-wide font-medium capitalize">{key}</span>
                        <span className="block text-base font-extrabold text-dark mt-0.5">{val}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {activeTab === 'benefits' && (
                <div className="grid sm:grid-cols-2 gap-3">
                  {product.benefits.map((b, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="flex items-start gap-3.5 p-4 rounded-2xl bg-cream border border-black/3"
                    >
                      <span className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                        <Leaf className="w-4 h-4 text-emerald-600" />
                      </span>
                      <span className="text-[13px] text-dark/65 leading-relaxed pt-1">{b}</span>
                    </motion.div>
                  ))}
                </div>
              )}

              {activeTab === 'origin' && (
                <div className="flex flex-col sm:flex-row items-start gap-5 p-6 rounded-2xl bg-cream border border-black/3">
                  <span className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <MapPin className="w-7 h-7" />
                  </span>
                  <div>
                    <h4 className="text-lg font-bold text-dark mb-2">Sourced from {product.origin}</h4>
                    <p className="text-[14px] text-dark/50 leading-relaxed font-light">
                      We partner directly with trusted local farms to ensure every vegetable reaches you at peak freshness.
                      No middlemen, no cold storage — just straight from the field to your kitchen. Our sourcing standards ensure
                      you receive the freshest produce within hours of harvest.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'storage' && (
                <div className="flex flex-col sm:flex-row items-start gap-5 p-6 rounded-2xl bg-cream border border-black/3">
                  <span className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Thermometer className="w-7 h-7" />
                  </span>
                  <div>
                    <h4 className="text-lg font-bold text-dark mb-2">Storage Instructions</h4>
                    <p className="text-[14px] text-dark/50 leading-relaxed font-light">{product.storage}</p>
                    <div className="mt-4 flex items-center gap-3">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary bg-primary/8 border border-primary/12 px-3 py-1.5 rounded-full">
                        <Clock className="w-3 h-3" /> Best consumed within 3-5 days
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-lg font-bold text-dark">Customer Reviews</h4>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cream">
                      <Star className="w-4 h-4 text-accent fill-accent" />
                      <span className="text-base font-bold text-dark">{product.rating}</span>
                      <span className="text-sm text-dark/35">/ 5</span>
                      <span className="text-sm text-dark/35 ml-1">({product.reviews})</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {sampleReviews.map((r, i) => (
                      <ReviewCard key={i} review={r} index={i} />
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* ====== FREQUENTLY BOUGHT TOGETHER ====== */}
        {boughtTogether.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-20"
          >
            <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-dark mb-8">
              Frequently Bought <span className="text-gradient">Together</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {boughtTogether.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </motion.div>
        )}

        {/* ====== RELATED PRODUCTS ====== */}
        {related.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-20"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-dark">
                Related <span className="text-gradient">Products</span>
              </h2>
              <Link to="/vegetables" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-dark transition-colors">
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  )
}
