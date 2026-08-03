import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell, Moon, Globe2, Shield, Trash2, LogOut, ChevronRight, X, AlertTriangle,
} from 'lucide-react'
import AccountLayout from '../../components/account/AccountLayout'
import { useAuth, useSettings } from '../../context/AuthContext'
import { useToast } from '../../context/CartContext'

function Toggle({ checked, onChange, disabled }) {
  return (
    <button
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`relative w-12 h-[26px] rounded-full overflow-hidden transition-colors duration-300 ${disabled ? 'opacity-40 cursor-not-allowed' : checked ? 'bg-primary' : 'bg-black/12'}`}
      aria-pressed={checked}
    >
      <motion.span
        animate={{ x: checked ? 22 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="absolute left-[2px] top-[2px] w-[22px] h-[22px] rounded-full bg-white shadow-sm"
      />
    </button>
  )
}

function Row({ icon: Icon, tint, title, desc, right }) {
  return (
    <div className="flex items-center gap-4 py-4">
      <span className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${tint}`}>
        <Icon className="w-4.5 h-4.5" />
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-dark">{title}</p>
        {desc && <p className="text-[11px] text-dark/40 mt-0.5">{desc}</p>}
      </div>
      <div className="shrink-0 ml-auto">{right}</div>
    </div>
  )
}

function Section({ children, title }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      className="bg-white rounded-3xl border border-black/5 shadow-soft p-5 sm:p-6"
    >
      <h3 className="text-xs font-bold uppercase tracking-wider text-dark/35 mb-1">{title}</h3>
      <div className="divide-y divide-black/5">{children}</div>
    </motion.section>
  )
}

export default function SettingsPage() {
  const { settings, updateSettings } = useSettings()
  const { logout } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()

  const [showPrivacy, setShowPrivacy] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const setNotif = (key, value) => updateSettings({ notifications: { ...settings.notifications, [key]: value } })

  const handleLogout = () => {
    logout()
    addToast('You have been logged out', 'info', 3000)
    navigate('/')
  }

  const handleDelete = () => {
    setDeleting(true)
    setTimeout(() => {
      ;['dr-user', 'dr-role', 'dr-token', 'dr-remember-email', 'dr-stores-recent']
        .forEach((k) => localStorage.removeItem(k))
      setDeleting(false)
      logout()
      addToast('Account deleted. We hope to see you again 🌱', 'info', 4000)
      navigate('/')
    }, 1400)
  }

  return (
    <AccountLayout title="Settings" subtitle="Manage notifications, preferences and your account.">
      <div className="space-y-5">
        {/* Notifications */}
        <Section title="Notifications">
          <Row icon={Bell} tint="bg-primary/10 text-primary" title="Order updates" desc="Status changes, delivery alerts" right={<Toggle checked={settings.notifications.orders} onChange={(v) => setNotif('orders', v)} />} />
          <Row icon={Bell} tint="bg-accent/10 text-accent" title="Offers & deals" desc="Fresh discounts and coupons" right={<Toggle checked={settings.notifications.offers} onChange={(v) => setNotif('offers', v)} />} />
          <Row icon={Bell} tint="bg-secondary/10 text-secondary" title="Email updates" desc="Weekly newsletter & receipts" right={<Toggle checked={settings.notifications.email} onChange={(v) => setNotif('email', v)} />} />
        </Section>

        {/* Appearance */}
        <Section title="Appearance">
          <Row icon={Moon} tint="bg-indigo-50 text-indigo-500" title="Dark Mode" desc="Coming soon — we're working on it" right={
            <span className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wide text-accent bg-accent/10 px-2 py-1 rounded-full">Soon</span>
              <Toggle checked={settings.darkMode} onChange={(v) => updateSettings({ darkMode: v })} disabled />
            </span>
          } />
        </Section>

        {/* Language */}
        <Section title="Preferences">
          <Row icon={Globe2} tint="bg-blue-50 text-blue-500" title="Language" desc="Choose your preferred language" right={
            <div className="flex items-center gap-1.5">
              {['en', 'hi', 'ta'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => { updateSettings({ language: lang }); addToast(`Language set to ${lang.toUpperCase()}`, 'success', 2500) }}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-all ${
                    settings.language === lang ? 'bg-primary text-white border-primary' : 'bg-cream text-dark/50 border-black/8 hover:border-primary/30'
                  }`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
          } />
        </Section>

        {/* Privacy */}
        <Section title="Privacy & Safety">
          <button onClick={() => setShowPrivacy(true)} className="w-full">
            <Row icon={Shield} tint="bg-emerald-50 text-emerald-500" title="Privacy Policy" desc="How we handle your data" right={<ChevronRight className="w-4 h-4 text-dark/25" />} />
          </button>
        </Section>

        {/* Danger zone */}
        <Section title="Danger Zone">
          <Row icon={Trash2} tint="bg-red-50 text-red-500" title="Delete Account" desc="Permanently remove your data" right={
            <button onClick={() => setConfirmDelete(true)} className="px-4 py-2 rounded-xl border border-red-200 text-red-500 text-xs font-bold hover:bg-red-50 transition-all">Delete</button>
          } />
          <Row icon={LogOut} tint="bg-black/5 text-dark/60" title="Logout" desc="Sign out of this device" right={
            <button onClick={handleLogout} className="px-4 py-2 rounded-xl border border-black/8 text-dark/60 text-xs font-bold hover:border-dark/20 transition-all">Logout</button>
          } />
        </Section>
      </div>

      {/* Privacy modal */}
      <AnimatePresence>
        {showPrivacy && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[80] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-dark/40 backdrop-blur-sm" onClick={() => setShowPrivacy(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ type: 'spring', stiffness: 260, damping: 24 }} className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8">
              <button onClick={() => setShowPrivacy(false)} className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-dark/30 hover:bg-black/5 transition-colors"><X className="w-4 h-4" /></button>
              <h3 className="font-serif-display text-2xl font-bold text-dark mb-3">Privacy Policy</h3>
              <div className="text-sm text-dark/55 leading-relaxed space-y-3 max-h-72 overflow-y-auto pr-2">
                <p><b className="text-dark">What we store.</b> Your account, orders, addresses, wishlist and preferences are stored securely in a MongoDB database. Only a session token is kept in your browser.</p>
                <p><b className="text-dark">Your data.</b> Name, email, phone, address and order history are used to power the storefront and your account dashboard.</p>
                <p><b className="text-dark">Clearing data.</b> Deleting your account removes your stored data and signs you out.</p>
              </div>
              <motion.button whileTap={{ scale: 0.97 }} onClick={() => setShowPrivacy(false)} className="mt-6 w-full h-12 rounded-2xl bg-gradient-to-r from-primary to-primary-dark text-white text-sm font-bold">Got it</motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete confirm modal */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[80] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-dark/40 backdrop-blur-sm" onClick={() => setConfirmDelete(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ type: 'spring', stiffness: 260, damping: 24 }} className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6 sm:p-8 text-center">
              <span className="w-16 h-16 mx-auto rounded-full bg-red-50 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </span>
              <h3 className="font-serif-display text-2xl font-bold text-dark mt-4">Delete account?</h3>
              <p className="text-sm text-dark/50 mt-2 font-light">This will permanently remove your profile, addresses, orders and wishlist. This action cannot be undone.</p>
              <div className="grid grid-cols-2 gap-3 mt-6">
                <button onClick={() => setConfirmDelete(false)} className="h-12 rounded-2xl border border-black/10 text-sm font-bold text-dark/60 hover:border-black/25 transition-all">Cancel</button>
                <motion.button whileTap={{ scale: 0.97 }} onClick={handleDelete} disabled={deleting} className="h-12 rounded-2xl bg-red-500 text-white text-sm font-bold shadow-lg shadow-red-500/20 hover:bg-red-600 disabled:opacity-60 transition-all flex items-center justify-center">
                  {deleting ? <span className="w-4.5 h-4.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Delete'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AccountLayout>
  )
}
