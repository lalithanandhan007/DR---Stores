import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useScroll } from 'framer-motion'
import { Leaf, ShoppingBasket, LogIn, UserPlus, Menu, X, UserRound, Package, Heart, MapPin, Settings, LogOut } from 'lucide-react'
import { Magnetic, scrollToId } from './ui'
import { useCart, useToast } from '../context/CartContext'
import { useAuth, ROLE_LABELS } from '../context/AuthContext'
import AccountMenu from './account/AccountMenu'

const links = [
  { label: 'Home', to: '/' },
  { label: 'Vegetables', to: '/vegetables' },
  { label: 'About', to: '/#why-us' },
  { label: 'Contact', to: '/#contact' },
]

function NavItem({ link, onClick }) {
  const isHome = link.to === '/'
  const isVegetables = link.to === '/vegetables'

  if (isVegetables) {
    return (
      <Link
        to={link.to}
        onClick={() => onClick()}
        className="group relative text-sm font-medium text-dark/70 hover:text-dark transition-colors duration-300 px-1 py-2 flex items-center gap-1.5"
      >
        {link.label}
        <span className="absolute left-0 -bottom-0.5 h-[2px] w-0 bg-gradient-to-r from-primary to-secondary transition-all duration-300 group-hover:w-full" />
      </Link>
    )
  }

  if (isHome) {
    return (
      <Link
        to="/"
        onClick={() => onClick()}
        className="group relative text-sm font-medium text-dark/70 hover:text-dark transition-colors duration-300 px-1 py-2 flex items-center gap-1.5"
      >
        {link.label}
        <span className="absolute left-0 -bottom-0.5 h-[2px] w-0 bg-gradient-to-r from-primary to-secondary transition-all duration-300 group-hover:w-full" />
      </Link>
    )
  }

  return (
    <a
      href={link.to}
      onClick={(e) => { e.preventDefault(); onClick(link) }}
      className="group relative text-sm font-medium text-dark/70 hover:text-dark transition-colors duration-300 px-1 py-2 flex items-center gap-1.5"
    >
      {link.label}
      {link.badge && (
        <span className="text-[10px] font-bold uppercase tracking-wide text-accent bg-accent/10 border border-accent/20 rounded-full px-1.5 py-0.5">
          {link.badge}
        </span>
      )}
      <span className="absolute left-0 -bottom-0.5 h-[2px] w-0 bg-gradient-to-r from-primary to-secondary transition-all duration-300 group-hover:w-full" />
    </a>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { scrollY } = useScroll()
  const location = useLocation()
  const navigate = useNavigate()
  const { totalItems } = useCart()
  const { isAuthenticated, user, role, logout } = useAuth()
  const { addToast } = useToast()

  const accountItems = [
    { to: '/profile', label: 'My Profile', icon: UserRound },
    { to: '/orders', label: 'My Orders', icon: Package },
    { to: '/wishlist', label: 'Wishlist', icon: Heart },
    { to: '/addresses', label: 'Addresses', icon: MapPin },
    { to: '/settings', label: 'Settings', icon: Settings },
  ]

  const handleLogout = () => {
    setOpen(false)
    logout()
    addToast('You have been logged out', 'info', 3000)
    navigate('/')
  }

  useEffect(() => {
    const unsub = scrollY.on('change', (v) => setScrolled(v > 24))
    return () => unsub()
  }, [scrollY])

  const handleNav = (link) => {
    setOpen(false)
  
    if (link.to.startsWith('/#')) {
      const id = link.to.replace('/', '')
  
      if (location.pathname !== '/') {
        navigate('/')
        setTimeout(() => scrollToId(id), 100)
      } else {
        scrollToId(id)
      }
    }
  }

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled ? 'glass py-3 shadow-[0_8px_32px_-12px_rgba(46,125,50,0.18)]' : 'bg-transparent py-5'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <span className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center shadow-cta group-hover:scale-105 transition-transform duration-300">
              <Leaf className="w-5.5 h-5.5 text-white" strokeWidth={2.2} />
              <span className="absolute inset-0 rounded-2xl bg-white/20 scale-0 group-hover:scale-100 transition-transform duration-500 origin-center" />
            </span>
            <span className="leading-none">
              <span className="block font-serif-display font-extrabold text-lg tracking-tight text-dark">
                D.R<span className="text-primary">.</span>STORES
              </span>
              <span className="block text-[10px] font-semibold uppercase tracking-[0.28em] text-dark/45 mt-1">
                Fresh • Trusted • Local
              </span>
            </span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden lg:flex items-center gap-8">
            {links.map((link) => (
              <li key={link.label}>
                <NavItem link={link} onClick={handleNav} />
              </li>
            ))}
          </ul>

          {/* Desktop actions */}
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <AccountMenu />
            ) : (
              <>
                <Link to="/login" className="inline-flex items-center gap-2 text-sm font-semibold text-dark/70 hover:text-primary px-4 py-2.5 rounded-full transition-colors duration-300">
                  <LogIn className="w-4 h-4" />
                  Login
                </Link>
                <Link to="/register" className="inline-flex items-center gap-2 text-sm font-bold text-primary bg-primary/8 border border-primary/20 px-5 py-2.5 rounded-full hover:bg-primary hover:text-white transition-all duration-300">
                  <UserPlus className="w-4 h-4" />
                  Register
                </Link>
              </>
            )}
            <Magnetic strength={0.25}>
              <Link
                to="/cart"
                className="relative inline-flex items-center gap-2 text-sm font-bold text-white bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary px-6 py-3 rounded-full shadow-cta hover:shadow-lift transition-all duration-300 hover:-translate-y-0.5"
              >
                <ShoppingBasket className="w-4.5 h-4.5" />
                Order Now
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-accent text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                    {totalItems}
                  </span>
                )}
              </Link>
            </Magnetic>
          </div>

          {/* Mobile toggle */}
          <div className="lg:hidden flex items-center gap-3">
            {/* Mobile cart badge */}
            <Link
              to="/cart"
              className="relative w-11 h-11 rounded-xl bg-white/80 backdrop-blur border border-black/5 flex items-center justify-center text-dark"
            >
              <ShoppingBasket className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-accent text-white text-[10px] font-bold flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              className="w-11 h-11 rounded-xl bg-white/80 backdrop-blur border border-black/5 flex items-center justify-center text-dark"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div className="absolute inset-0 bg-dark/20 backdrop-blur-sm" onClick={() => setOpen(false)} />
            <motion.div className="absolute top-20 inset-x-4 glass-card rounded-3xl p-6 shadow-card">
              <ul className="flex flex-col gap-1">
                {links.map((link, i) => (
                  <motion.li key={link.label} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}>
                    {link.to.startsWith('/#') ? (
                      <button
                        onClick={() => { handleNav(link) }}
                        className="w-full text-left px-4 py-3.5 rounded-2xl text-[15px] font-semibold text-dark/80 hover:bg-primary/8 hover:text-primary transition-colors flex items-center gap-2"
                      >
                        {link.label}
                        {link.badge && (
                          <span className="text-[10px] font-bold uppercase text-accent bg-accent/10 rounded-full px-2 py-0.5">{link.badge}</span>
                        )}
                      </button>
                    ) : (
                      <Link
                        to={link.to}
                        onClick={() => setOpen(false)}
                        className="w-full text-left px-4 py-3.5 rounded-2xl text-[15px] font-semibold text-dark/80 hover:bg-primary/8 hover:text-primary transition-colors flex items-center gap-2"
                      >
                        {link.label}
                        {link.badge && (
                          <span className="text-[10px] font-bold uppercase text-accent bg-accent/10 rounded-full px-2 py-0.5">{link.badge}</span>
                        )}
                      </Link>
                    )}
                  </motion.li>
                ))}
              </ul>
              {isAuthenticated ? (
                <>
                  <div className="mt-4 flex items-center gap-3 px-2 py-2 border-t border-black/5">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary text-white text-sm font-extrabold flex items-center justify-center">
                      {user?.name?.split(' ').slice(0, 2).map((w) => w[0]?.toUpperCase()).join('') || 'U'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-dark truncate">{user?.name}</p>
                      <p className="text-[10px] text-primary font-bold uppercase tracking-wide">{ROLE_LABELS[role] || 'Customer'}</p>
                    </div>
                  </div>
                  <ul className="mt-1">
                    {accountItems.map((item, i) => (
                      <motion.li key={item.to} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}>
                        <Link to={item.to} onClick={() => setOpen(false)} className="w-full text-left px-4 py-3 rounded-2xl text-[15px] font-semibold text-dark/80 hover:bg-primary/8 hover:text-primary transition-colors flex items-center gap-2">
                          <item.icon className="w-4.5 h-4.5" /> {item.label}
                        </Link>
                      </motion.li>
                    ))}
                    <motion.li initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                      <button onClick={handleLogout} className="w-full text-left px-4 py-3 rounded-2xl text-[15px] font-semibold text-red-500/80 hover:bg-red-50 hover:text-red-600 transition-colors flex items-center gap-2">
                        <LogOut className="w-4.5 h-4.5" /> Logout
                      </button>
                    </motion.li>
                  </ul>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-3 mt-5 pt-5 border-t border-black/5">
                  <Link to="/login" onClick={() => setOpen(false)} className="px-4 py-3 rounded-full text-sm font-bold text-dark/70 bg-white border border-black/10 text-center">
                    Login
                  </Link>
                  <Link to="/register" onClick={() => setOpen(false)} className="px-4 py-3 rounded-full text-sm font-bold text-primary bg-primary/8 border border-primary/20 text-center">
                    Register
                  </Link>
                  <button
                    onClick={() => { setOpen(false); navigate('/vegetables') }}
                    className="col-span-2 px-4 py-3 rounded-full text-sm font-bold text-white bg-gradient-to-r from-primary to-primary-dark"
                  >
                    Order Now
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
