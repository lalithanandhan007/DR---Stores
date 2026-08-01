import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Save, Store, Truck, CreditCard, Bell, Palette, Shield, Clock, MapPin, Phone, Mail,
  Globe, AlertTriangle, Check, Upload,
} from 'lucide-react'
import { defaultSettings, DAY_LABELS } from '../../data/settingsData'
import { useToast } from '../../context/CartContext'

function Section({ title, subtitle, icon: Icon, children, delay = 0 }) {
  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white rounded-3xl border border-black/5 shadow-soft p-5 sm:p-6">
      <div className="flex items-center gap-3 mb-5">
        <span className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center"><Icon className="w-5 h-5" /></span>
        <div>
          <h3 className="text-sm font-bold text-dark">{title}</h3>
          {subtitle && <p className="text-[11px] text-dark/40 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {children}
    </motion.div>
  )
}

const inputCls = 'w-full h-11 px-4 rounded-xl bg-cream border border-black/8 text-sm text-dark placeholder:text-dark/30 focus:outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10 transition-all'
const labelCls = 'block text-[13px] font-semibold text-dark/70 mb-1.5'
const toggleCls = (on) => `relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${on ? 'bg-primary' : 'bg-black/15'}`

function Toggle({ value, onChange }) {
  return (
    <button type="button" onClick={() => onChange(!value)} className={toggleCls(value)}>
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${value ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  )
}

export default function SettingsPage() {
  const { addToast } = useToast()
  const [settings, setSettings] = useState(defaultSettings)
  const [saving, setSaving] = useState(false)
  const set = (k, v) => setSettings((s) => ({ ...s, [k]: v }))

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => { setSaving(false); addToast('Settings saved successfully', 'success', 2800) }, 1000)
  }

  return (
    <div className="space-y-5 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <h1 className="font-serif-display text-2xl font-bold text-dark tracking-tight">Store Settings</h1>
            <p className="text-xs text-dark/45 mt-0.5">Configure your store, delivery, payments, and more</p>
          </div>
          <button onClick={handleSave} disabled={saving} className="ml-auto inline-flex items-center gap-2 h-10 px-5 rounded-2xl bg-gradient-to-r from-primary to-primary-dark text-white text-xs font-bold shadow-md shadow-primary/15 hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-60">
            {saving ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving…' : 'Save Settings'}
          </button>
        </div>
      </motion.div>

      {/* Store Identity */}
      <Section title="Store Identity" subtitle="Basic store information" icon={Store} delay={0.05}>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className={labelCls}>Store Name</label><input className={inputCls} value={settings.storeName} onChange={(e) => set('storeName', e.target.value)} /></div>
          <div><label className={labelCls}>Owner Name</label><input className={inputCls} value={settings.ownerName} onChange={(e) => set('ownerName', e.target.value)} /></div>
          <div><label className={labelCls}>Phone</label><input className={inputCls} value={settings.phone} onChange={(e) => set('phone', e.target.value)} /></div>
          <div><label className={labelCls}>Email</label><input type="email" className={inputCls} value={settings.email} onChange={(e) => set('email', e.target.value)} /></div>
          <div><label className={labelCls}>GST Number</label><input className={inputCls} value={settings.gstNumber} onChange={(e) => set('gstNumber', e.target.value)} /></div>
          <div><label className={labelCls}>Tagline</label><input className={inputCls} value={settings.storeTagline} onChange={(e) => set('storeTagline', e.target.value)} /></div>
        </div>
        <div className="mt-4">
          <label className={labelCls}>Business Address</label>
          <div className="grid sm:grid-cols-3 gap-3">
            <input className={inputCls} value={settings.address.street} onChange={(e) => set('address', { ...settings.address, street: e.target.value })} placeholder="Street" />
            <input className={inputCls} value={settings.address.locality} onChange={(e) => set('address', { ...settings.address, locality: e.target.value })} placeholder="Locality" />
            <input className={inputCls} value={settings.address.city} onChange={(e) => set('address', { ...settings.address, city: e.target.value })} placeholder="City" />
            <input className={inputCls} value={settings.address.state} onChange={(e) => set('address', { ...settings.address, state: e.target.value })} placeholder="State" />
            <input className={inputCls} value={settings.address.pincode} onChange={(e) => set('address', { ...settings.address, pincode: e.target.value })} placeholder="Pincode" />
            <input className={inputCls} value={settings.address.country} onChange={(e) => set('address', { ...settings.address, country: e.target.value })} placeholder="Country" />
          </div>
        </div>
        <div className="mt-4">
          <label className={labelCls}>Store Logo</label>
          <div className="flex items-center gap-4">
            <span className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-2xl font-serif-display font-extrabold">DR</span>
            <button className="h-10 px-4 rounded-xl border-2 border-dashed border-black/15 text-xs font-bold text-dark/50 hover:border-primary/30 hover:text-primary transition-all flex items-center gap-2">
              <Upload className="w-4 h-4" /> Upload Logo
            </button>
          </div>
        </div>
      </Section>

      {/* Business Hours */}
      <Section title="Business Hours" subtitle="Operating schedule for each day" icon={Clock} delay={0.1}>
        <div className="space-y-2.5">
          {Object.entries(settings.businessHours).map(([day, hours]) => (
            <div key={day} className="flex items-center gap-3">
              <Toggle value={hours.active} onChange={(v) => set('businessHours', { ...settings.businessHours, [day]: { ...hours, active: v } })} />
              <span className="w-24 text-xs font-bold text-dark capitalize">{DAY_LABELS[day]}</span>
              {hours.active ? (
                <div className="flex items-center gap-2">
                  <input type="time" value={hours.open} onChange={(e) => set('businessHours', { ...settings.businessHours, [day]: { ...hours, open: e.target.value } })}
                    className="h-9 px-3 rounded-lg bg-cream border border-black/8 text-xs text-dark focus:outline-none focus:border-primary/30" />
                  <span className="text-xs text-dark/40">to</span>
                  <input type="time" value={hours.close} onChange={(e) => set('businessHours', { ...settings.businessHours, [day]: { ...hours, close: e.target.value } })}
                    className="h-9 px-3 rounded-lg bg-cream border border-black/8 text-xs text-dark focus:outline-none focus:border-primary/30" />
                </div>
              ) : (
                <span className="text-xs text-dark/30 font-light">Closed</span>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* Delivery Settings */}
      <Section title="Delivery Settings" subtitle="Configure delivery rules and charges" icon={Truck} delay={0.15}>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className={labelCls}>Delivery Radius (km)</label><input type="number" className={inputCls} value={settings.deliveryRadius} onChange={(e) => set('deliveryRadius', Number(e.target.value))} /></div>
          <div><label className={labelCls}>Minimum Order (₹)</label><input type="number" className={inputCls} value={settings.minimumOrder} onChange={(e) => set('minimumOrder', Number(e.target.value))} /></div>
          <div><label className={labelCls}>Free Delivery Above (₹)</label><input type="number" className={inputCls} value={settings.freeDeliveryAbove} onChange={(e) => set('freeDeliveryAbove', Number(e.target.value))} /></div>
          <div><label className={labelCls}>Delivery Charges (₹)</label><input type="number" className={inputCls} value={settings.deliveryCharges} onChange={(e) => set('deliveryCharges', Number(e.target.value))} /></div>
          <div><label className={labelCls}>Express Delivery Charge (₹)</label><input type="number" className={inputCls} value={settings.expressDeliveryCharge} onChange={(e) => set('expressDeliveryCharge', Number(e.target.value))} /></div>
          <div><label className={labelCls}>Express Delivery Time (min)</label><input type="number" className={inputCls} value={settings.expressDeliveryTime} onChange={(e) => set('expressDeliveryTime', Number(e.target.value))} /></div>
        </div>
      </Section>

      {/* Payment Settings */}
      <Section title="Payment Settings" subtitle="Accepted payment methods" icon={CreditCard} delay={0.2}>
        <div className="space-y-3">
          {[
            { key: 'acceptUPI', label: 'UPI (Google Pay, PhonePe, etc.)' },
            { key: 'acceptCard', label: 'Credit / Debit Cards' },
            { key: 'acceptNetBanking', label: 'Net Banking' },
            { key: 'acceptCOD', label: 'Cash on Delivery' },
          ].map((p) => (
            <div key={p.key} className="flex items-center justify-between">
              <span className="text-sm text-dark/70">{p.label}</span>
              <Toggle value={settings[p.key]} onChange={(v) => set(p.key, v)} />
            </div>
          ))}
          {settings.acceptCOD && (
            <div className="mt-2"><label className={labelCls}>COD Limit (₹)</label><input type="number" className={`${inputCls} max-w-xs`} value={settings.codLimit} onChange={(e) => set('codLimit', Number(e.target.value))} /></div>
          )}
        </div>
      </Section>

      {/* Notification Settings */}
      <Section title="Notification Settings" subtitle="Control notification preferences" icon={Bell} delay={0.25}>
        <div className="space-y-3">
          {[
            { key: 'notifyNewOrder', label: 'New order notifications' },
            { key: 'notifyLowStock', label: 'Low stock alerts' },
            { key: 'notifyCancelled', label: 'Cancelled order alerts' },
            { key: 'notifyNewCustomer', label: 'New customer notifications' },
            { key: 'notifyCouponExpiry', label: 'Coupon expiry reminders' },
            { key: 'emailNotifications', label: 'Email notifications' },
            { key: 'smsNotifications', label: 'SMS notifications' },
            { key: 'pushNotifications', label: 'Push notifications' },
          ].map((n) => (
            <div key={n.key} className="flex items-center justify-between">
              <span className="text-sm text-dark/70">{n.label}</span>
              <Toggle value={settings[n.key]} onChange={(v) => set(n.key, v)} />
            </div>
          ))}
        </div>
      </Section>

      {/* Theme */}
      <Section title="Theme Settings" subtitle="Customize the store appearance" icon={Palette} delay={0.3}>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Primary Color</label>
            <div className="flex items-center gap-3">
              <input type="color" value={settings.primaryColor} onChange={(e) => set('primaryColor', e.target.value)} className="w-10 h-10 rounded-xl border border-black/10 cursor-pointer" />
              <input className={`${inputCls} flex-1`} value={settings.primaryColor} onChange={(e) => set('primaryColor', e.target.value)} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Accent Color</label>
            <div className="flex items-center gap-3">
              <input type="color" value={settings.accentColor} onChange={(e) => set('accentColor', e.target.value)} className="w-10 h-10 rounded-xl border border-black/10 cursor-pointer" />
              <input className={`${inputCls} flex-1`} value={settings.accentColor} onChange={(e) => set('accentColor', e.target.value)} />
            </div>
          </div>
        </div>
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between"><span className="text-sm text-dark/70">Compact mode</span><Toggle value={settings.compactMode} onChange={(v) => set('compactMode', v)} /></div>
        </div>
      </Section>

      {/* System */}
      <Section title="System" subtitle="Maintenance mode and backups" icon={Shield} delay={0.35}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div><span className="text-sm text-dark/70">Maintenance Mode</span>{settings.maintenanceMode && <span className="ml-2 text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">Active</span>}</div>
            <Toggle value={settings.maintenanceMode} onChange={(v) => set('maintenanceMode', v)} />
          </div>
          {settings.maintenanceMode && (
            <div className="rounded-2xl bg-red-50 border border-red-200 p-4">
              <div className="flex items-center gap-2 text-red-600 text-xs font-bold mb-2"><AlertTriangle className="w-4 h-4" /> Maintenance mode is ON</div>
              <input className={inputCls} value={settings.maintenanceMessage} onChange={(e) => set('maintenanceMessage', e.target.value)} placeholder="Maintenance message" />
            </div>
          )}
          <div className="h-px bg-black/5" />
          <div className="flex items-center justify-between"><span className="text-sm text-dark/70">Automatic backup</span><Toggle value={settings.autoBackup} onChange={(v) => set('autoBackup', v)} /></div>
          {settings.autoBackup && (
            <div><label className={labelCls}>Backup Frequency</label>
              <select value={settings.backupFrequency} onChange={(e) => set('backupFrequency', e.target.value)} className={`${inputCls} max-w-xs`}>
                <option value="hourly">Hourly</option><option value="daily">Daily</option><option value="weekly">Weekly</option>
              </select>
            </div>
          )}
          <button onClick={() => addToast('Manual backup initiated (demo)', 'success', 2800)} className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-white border border-black/8 text-xs font-bold text-dark/60 hover:border-primary/30 hover:text-primary transition-all">
            <Shield className="w-4 h-4" /> Backup Now
          </button>
        </div>
      </Section>
    </div>
  )
}
