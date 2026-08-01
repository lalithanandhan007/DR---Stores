import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Truck, Phone, Star, Navigation, CheckCircle2, Zap } from 'lucide-react'
import { deliveryPartners } from '../../data/ordersData'
import { useOrders } from '../../context/OrdersContext'

const ETA_PRESETS = [20, 30, 45, 60]

export default function AssignDeliveryModal({ order, onClose }) {
  const { assignPartner } = useOrders()
  const [selected, setSelected] = useState(deliveryPartners[0]?._id || null)
  const [eta, setEta] = useState(30)
  const [busy, setBusy] = useState(false)

  const partner = deliveryPartners.find((p) => p._id === selected)
  if (!order) return null

  const handle = (dispatch) => {
    if (!partner) return
    setBusy(true)
    setTimeout(() => {
      assignPartner(order._id, partner, eta, dispatch)
      setBusy(false)
      onClose()
    }, 600)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-dark/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94 }}
        transition={{ type: 'spring', stiffness: 300, damping: 26 }}
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[88vh] flex flex-col"
      >
        {/* Header */}
        <div className="relative px-6 pt-6 pb-5 bg-gradient-to-br from-primary to-primary-dark">
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/15 text-white flex items-center justify-center hover:bg-white/25 transition-colors">
            <X className="w-4 h-4" />
          </button>
          <span className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center">
            <Truck className="w-5 h-5 text-white" />
          </span>
          <h3 className="mt-3 font-serif-display text-xl font-bold text-white">Assign Delivery Partner</h3>
          <p className="text-xs text-white/70 mt-0.5 font-light">
            Order <b className="text-white font-bold">{order._id}</b> · {order.delivery?.slot?.label || 'Express'} slot
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5 admin-scroll">
          {/* Partner cards */}
          <div>
            <p className="text-xs font-bold text-dark/60 uppercase tracking-wider mb-2.5">Choose partner</p>
            <div className="space-y-2.5">
              {deliveryPartners.map((p) => {
                const active = selected === p._id
                return (
                  <button
                    key={p._id}
                    onClick={() => setSelected(p._id)}
                    className={`w-full flex items-center gap-3.5 p-3.5 rounded-2xl border-2 text-left transition-all ${
                      active ? 'border-primary bg-primary/5 shadow-card' : 'border-black/8 bg-white hover:border-primary/25 hover:bg-primary/2'
                    }`}
                  >
                    <span className={`relative w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${active ? 'bg-primary text-white' : 'bg-primary/8 text-primary'}`}>
                      <Truck className="w-5 h-5" />
                      {!p.online && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-gray-300 border-2 border-white" />}
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="flex items-center gap-2">
                        <span className="text-sm font-bold text-dark truncate">{p.name}</span>
                        {p.online
                          ? <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full shrink-0">Online</span>
                          : <span className="text-[9px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full shrink-0">Offline</span>}
                      </span>
                      <span className="block text-[11px] text-dark/45 truncate mt-0.5">{p.vehicle}</span>
                      <span className="flex items-center gap-2 text-[11px] text-dark/50 mt-0.5">
                        <span className="inline-flex items-center gap-0.5"><Star className="w-3 h-3 text-amber-500 fill-amber-500" /> {p.rating}</span>
                        <span>· {p.deliveries.toLocaleString('en-IN')} deliveries</span>
                        <span className="inline-flex items-center gap-1"><Phone className="w-3 h-3" /> {p.phone}</span>
                      </span>
                    </span>
                    <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${active ? 'border-primary bg-primary' : 'border-black/15'}`}>
                      {active && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* ETA */}
          <div>
            <p className="text-xs font-bold text-dark/60 uppercase tracking-wider mb-2.5">Estimated delivery time</p>
            <div className="flex items-center gap-2.5 flex-wrap">
              {ETA_PRESETS.map((m) => (
                <button
                  key={m}
                  onClick={() => setEta(m)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border-2 transition-all ${eta === m ? 'border-primary bg-primary text-white' : 'border-black/8 text-dark/55 hover:border-primary/25'}`}
                >
                  {m} min
                </button>
              ))}
              <label className="inline-flex items-center gap-2 ml-auto">
                <Navigation className="w-3.5 h-3.5 text-dark/35" />
                <input
                  type="number"
                  min={5}
                  max={180}
                  value={eta}
                  onChange={(e) => setEta(Number(e.target.value) || 0)}
                  className="w-20 h-10 px-3 rounded-xl bg-cream border border-black/8 text-sm font-bold text-dark text-center focus:outline-none focus:border-primary/30"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-black/5 bg-cream/60 flex items-center gap-3">
          <button
            onClick={() => handle(false)}
            disabled={!partner || busy}
            className="flex-1 h-11 rounded-xl border-2 border-primary/25 text-primary text-sm font-bold hover:bg-primary/5 disabled:opacity-40 transition-all"
          >
            Assign Partner
          </button>
          <button
            onClick={() => handle(true)}
            disabled={!partner || busy}
            className="flex-1 h-11 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white text-sm font-bold shadow-md shadow-primary/15 flex items-center justify-center gap-1.5 hover:shadow-lg disabled:opacity-40 transition-all"
          >
            {busy ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Zap className="w-4 h-4" /> Assign & Dispatch</>}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
