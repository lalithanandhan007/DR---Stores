import { useState } from 'react'
import { useSettings } from '../context/AuthContext'
import L from 'leaflet'
import { motion, AnimatePresence } from 'framer-motion'
import { Bike, Clock3, MapPin, PackageCheck, X, CheckCircle2, AlertCircle } from 'lucide-react'
import { Reveal, Stagger, StaggerItem, Magnetic } from './ui'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

function Scooter() {
  return (
    <svg viewBox="0 0 320 180" className="w-full h-auto" fill="none">
      {/* Motion lines */}
      <g className="drift-line opacity-40">
        <path d="M8 150h36M20 162h52M14 138h28" stroke="#2E7D32" strokeWidth="3" strokeLinecap="round" />
      </g>
      <g className="drift-line opacity-30" style={{ animationDelay: '0.6s' }}>
        <path d="M8 150h36M20 162h52M14 138h28" stroke="#FF9800" strokeWidth="3" strokeLinecap="round" />
      </g>

      {/* Delivery box on back */}
      <g>
        <rect x="70" y="34" width="66" height="56" rx="10" fill="#2E7D32" />
        <rect x="70" y="34" width="66" height="56" rx="10" fill="url(#box-grad)" />
        <path d="M70 46h66" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
        <path d="M88 34v56M118 34v56" stroke="rgba(255,255,255,0.18)" strokeWidth="2" />
        <text x="103" y="72" textAnchor="middle" fill="white" fontSize="15" fontWeight="800" fontFamily="Inter, sans-serif">DR</text>
        <path d="M40 62h30M40 74h22" stroke="#2E7D32" strokeWidth="5" strokeLinecap="round" />
      </g>

      {/* Body */}
      <path d="M120 96c-6-22 6-40 26-46" stroke="#2E7D32" strokeWidth="7" strokeLinecap="round" fill="none" />
      <path d="M172 118l22-8 4 12-24 8z" fill="#FF9800" />
      <path d="M58 118h90" stroke="#2E7D32" strokeWidth="5" strokeLinecap="round" />
      <path d="M110 62c-8-6-18-8-28-6" stroke="#1B5E20" strokeWidth="6" strokeLinecap="round" fill="none" />
      <path d="M82 56c-4 0-7 2-8 6" stroke="#1B5E20" strokeWidth="6" strokeLinecap="round" fill="none" />

      {/* Rider */}
      <circle cx="150" cy="44" r="17" fill="#F4B183" />
      <path d="M150 61v20M150 81l-14 22M150 81l14 22" stroke="#2E7D32" strokeWidth="6" strokeLinecap="round" fill="none" />
      <circle cx="150" cy="44" r="17" fill="#F4B183" />
      <path d="M143 38c-2 3 0 6 4 6M154 36l4 2" stroke="#7B4A2B" strokeWidth="3" strokeLinecap="round" />
      <path d="M136 60c-6 2-8 8-8 14 0 3-1 5-4 6" stroke="#FF9800" strokeWidth="7" strokeLinecap="round" fill="none" />

      {/* Handlebar */}
      <path d="M186 118c4-6 12-6 18-2" stroke="#2E7D32" strokeWidth="5" strokeLinecap="round" fill="none" />

      {/* Wheels */}
      <g className="scooter-bounce">
        <g>
          <circle cx="84" cy="130" r="26" fill="#1B1B1B" />
          <circle cx="84" cy="130" r="18" fill="#333" />
          <g className="wheel-spin">
            <path d="M84 112v12M84 136v12M66 130h12M90 130h12M71 117l8 8M89 135l8 8M97 117l-8 8M79 135l-8 8" stroke="#666" strokeWidth="2.5" strokeLinecap="round" />
          </g>
          <circle cx="84" cy="130" r="5" fill="#666" />
        </g>
        <g>
          <circle cx="222" cy="132" r="26" fill="#1B1B1B" />
          <circle cx="222" cy="132" r="18" fill="#333" />
          <g className="wheel-spin" style={{ animationDirection: 'reverse' }}>
            <path d="M222 114v12M222 138v12M204 132h12M228 132h12M209 119l8 8M227 137l8 8M235 119l-8 8M217 137l-8 8" stroke="#666" strokeWidth="2.5" strokeLinecap="round" />
          </g>
          <circle cx="222" cy="132" r="5" fill="#666" />
        </g>
      </g>

      <defs>
        <linearGradient id="box-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4CAF50" />
          <stop offset="100%" stopColor="#1B5E20" />
        </linearGradient>
      </defs>
    </svg>
  )
}
function LocationPicker({ onSelect, selectedLocation }) {
  useMapEvents({
    click(e) {
      onSelect({
        latitude: e.latlng.lat,
        longitude: e.latlng.lng,
      })
    },
  })

  return selectedLocation ? (
    <Marker
      position={[
        selectedLocation.latitude,
        selectedLocation.longitude,
      ]}
    />
  ) : null
}


const stats = [
  {
    icon: MapPin,
    label: 'Delivery Radius',
    tamilLabel: 'விநியோக வரம்பு',
    value: '10 KM',
    color: 'text-primary bg-primary/10',
  },
  {
    icon: Clock3,
    label: 'Average Delivery',
    tamilLabel: 'சராசரி விநியோகம்',
    value: '40 Min',
    color: 'text-accent bg-accent/10',
  },
  {
    icon: PackageCheck,
    label: 'Orders Delivered',
    tamilLabel: 'விநியோகிக்கப்பட்ட ஆர்டர்கள்',
    value: '10K+',
    color: 'text-secondary bg-secondary/10',
  },
  {
    icon: Bike,
    label: 'Own Fleet',
    tamilLabel: 'சொந்த வாகனங்கள்',
    value: '24/7',
    color: 'text-primary-dark bg-primary/10',
  },
]

export default function DeliveryBanner() {
  const [deliveryOpen, setDeliveryOpen] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [result, setResult] = useState(null)

  const { settings } = useSettings()
  const isTamil = settings.language === 'ta'

  const checkDelivery = () => {
    if (!selectedLocation) {
      setResult('select-location')
      return
    }
  
    const storeLatitude = 12.8505582
    const storeLongitude = 80.1405411
  
    const customerLatitude = selectedLocation.latitude
    const customerLongitude = selectedLocation.longitude
  
    const R = 6371
  
    const dLat = ((customerLatitude - storeLatitude) * Math.PI) / 180
    const dLon = ((customerLongitude - storeLongitude) * Math.PI) / 180
  
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((storeLatitude * Math.PI) / 180) *
        Math.cos((customerLatitude * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  
    const distance = R * c
  
    if (distance <= 10) {
      setResult({
        status: 'available',
        distance: distance.toFixed(1),
      })
    } else {
      setResult({
        status: 'unavailable',
        distance: distance.toFixed(1),
      })
    }
  }

  return (
    <>
      <section className="relative section-padding overflow-hidden">
      <div className="ambient-orb w-[460px] h-[460px] -right-52 top-0 green-blob" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 relative">
        <div className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-primary-dark via-primary to-secondary shadow-lift">
          {/* texture + glows */}
          <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.35), transparent 40%), radial-gradient(circle at 85% 85%, rgba(255,183,77,0.4), transparent 45%)' }} />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.15),transparent_60%)]" />

          <div className="relative grid lg:grid-cols-2 gap-10 items-center px-6 py-12 sm:px-12 lg:px-16 lg:py-16">
            {/* Left copy */}
            <div className="text-white">
              <Reveal>
                <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/80 bg-white/10 border border-white/20 px-4 py-2 rounded-full">
                  <Bike className="w-4 h-4" />
                  {isTamil ? 'வேகமான விநியோகம்' : 'Lightning Delivery'} 
                </span>
              </Reveal>
              <Reveal delay={0.1}>
                <h2 className="mt-5 font-serif-display text-3xl sm:text-4xl lg:text-[2.9rem] font-bold leading-[1.15] tracking-tight">
                {isTamil ? (
  <>
    எங்கள் கடையிலிருந்து
    <br />
    <span className="text-accent-light">40 நிமிடங்களில் உங்கள் வீட்டு வாசலுக்கு.</span>
  </>
) : (
  <>
    From our store to
    <br />
    <span className="text-accent-light">your door in 40 minutes.</span>
  </>
)}
                </h2>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="mt-5 text-white/70 text-base lg:text-lg font-light max-w-md leading-relaxed">
                {isTamil
  ? '5 KM சுற்றளவில் புதிய பொருட்களை வழங்குகிறோம் — ஒவ்வொரு ஆர்டரும் கவனமாக பேக் செய்யப்பட்டு, புன்னகையுடன் உங்கள் வீட்டிற்கு கொண்டு வரப்படும்.'
  : 'We deliver fresh across a 5 KM radius — hot, cold or crisp, exactly how it should be. Every order packed with care and delivered with a smile.'}
                </p>
              </Reveal>

              <Stagger delay={0.25} className="mt-8 grid grid-cols-2 gap-4 max-w-md" stagger={0.08}>
                {stats.map((s) => (
                  <StaggerItem key={s.label}>
                    <div className="flex items-center gap-3 bg-white/10 backdrop-blur rounded-2xl px-4 py-3.5 border border-white/15 hover:bg-white/15 transition-colors duration-300">
                      <span className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color} bg-white/15`}>
                        <s.icon className="w-5 h-5" />
                      </span>
                      <span>
                        <span className="block text-lg font-extrabold leading-none">{s.value}</span>
                        <span className="block text-[11px] text-white/60 mt-1 font-medium">{isTamil ? s.tamilLabel : s.label}</span>
                      </span>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>

              <Reveal delay={0.35} className="mt-8">
                <Magnetic strength={0.25}>
                <button 
                  onClick={() => {
                      setDeliveryOpen(true)
                      setResult(null)
                      setSelectedLocation(null)
                  }}
                    className="inline-flex items-center gap-2.5 text-base font-bold text-primary-dark bg-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <MapPin className="w-5 h-5" />
                    {isTamil ? 'உங்கள் பகுதியில் விநியோகம் உள்ளதா?' : 'Check Delivery in Your Area'}
                  </button>
                </Magnetic>
              </Reveal>
            </div>

            {/* Right scooter */}
            <Reveal delay={0.2} y={50} className="relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full bg-accent/20 blur-3xl" />
              <div className="relative">
                <Scooter />
              </div>
              {/* floating mini badges */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-4 left-4 glass rounded-2xl px-4 py-2.5 shadow-card flex items-center gap-2"
              >
                <Clock3 className="w-4.5 h-4.5 text-primary" />
                <span className="text-sm font-bold text-dark/80">
  {isTamil ? '40 நிமிடம்' : '40 min'}
</span>
              </motion.div>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
                className="absolute bottom-6 right-2 glass rounded-2xl px-4 py-2.5 shadow-card flex items-center gap-2"
              >
                <PackageCheck className="w-4.5 h-4.5 text-accent" />
                <span className="text-sm font-bold text-dark/80">
                {isTamil ? 'புதியது & பாதுகாப்பாக பேக் செய்யப்பட்டது' : 'Fresh & sealed'}
</span>
              </motion.div>
            </Reveal>
          </div>
        </div>
      </div>
      </section>

<AnimatePresence>
  {deliveryOpen && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={() => setDeliveryOpen(false)}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl"
      >
        <button
          onClick={() => setDeliveryOpen(false)}
          className="absolute right-4 top-4 p-2 rounded-full hover:bg-black/5"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <MapPin className="w-7 h-7" />
          </div>

          <h3 className="text-xl font-bold text-dark">
  {isTamil ? 'விநியோக வசதி உள்ளதா என சரிபார்க்கவும்' : 'Check Delivery Availability'}
</h3>

<p className="mt-2 text-sm text-dark/60">
  {isTamil
    ? 'உங்கள் பகுதியில் நாங்கள் விநியோகம் செய்கிறோமா என்பதை அறிய வரைபடத்தில் உங்கள் இருப்பிடத்தைத் தேர்ந்தெடுக்கவும்.'
    : 'Select your location on the map to check whether we deliver to your area.'}
</p>
        </div>

        <div className="mt-6 h-[300px] overflow-hidden rounded-2xl border border-black/10">
        <MapContainer
  center={[12.8505582, 80.1405411]}
  zoom={15}
  className="h-full w-full z-0"
>
  <TileLayer
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    attribution="© OpenStreetMap contributors"
  />

<LocationPicker
  selectedLocation={selectedLocation}
  onSelect={(location) => {
    setSelectedLocation(location)
    setResult(null)
  }}
/>

      </MapContainer>
      </div>

<p className="mt-3 text-center text-xs text-dark/50">
{isTamil
  ? 'உங்கள் விநியோக இருப்பிடத்தைத் தேர்ந்தெடுக்க வரைபடத்தில் எங்கு வேண்டுமானாலும் கிளிக் செய்யவும்.'
  : 'Click anywhere on the map to select your delivery location.'}
</p>

<button
  onClick={checkDelivery}
  className="mt-4 w-full rounded-xl bg-primary py-3 text-sm font-bold text-white hover:bg-primary-dark transition-colors"
>
{isTamil ? 'வசதி உள்ளதா என சரிபார்க்கவும்' : 'Check Availability'}
</button>

{result === 'select-location' && (
  <div className="mt-4 flex items-center gap-2 rounded-xl bg-amber-50 border border-amber-200 p-3 text-sm text-amber-700">
    <AlertCircle className="w-5 h-5 shrink-0" />
    {isTamil
  ? 'முதலில் வரைபடத்தில் உங்கள் விநியோக இருப்பிடத்தைத் தேர்ந்தெடுக்கவும்.'
  : 'Please select your delivery location on the map first.'}
  </div>
)}

{result?.status === 'available' && (
  <div className="mt-4 flex items-center gap-2 rounded-xl bg-green-50 border border-green-200 p-3 text-sm text-green-700">
    <CheckCircle2 className="w-5 h-5 shrink-0" />
    {isTamil
  ? `சிறப்பு! இந்த இடத்திற்கு நாங்கள் விநியோகம் செய்கிறோம். இது எங்கள் கடையிலிருந்து ${result.distance} KM தொலைவில் உள்ளது.`
  : `Great! We deliver to this location. It is ${result.distance} KM from our store.`}
  </div>
)}

{result?.status === 'unavailable' && (
  <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-700">
    <AlertCircle className="w-5 h-5 shrink-0" />
    {isTamil
  ? `மன்னிக்கவும், இந்த இடம் எங்கள் கடையிலிருந்து ${result.distance} KM தொலைவில் உள்ளது. இது எங்கள் 10 KM விநியோக வரம்பிற்கு வெளியே உள்ளது.`
  : `Sorry, this location is ${result.distance} KM from our store, which is outside our 10 KM delivery radius.`}
  </div>
)}
      </motion.div>
    </motion.div>
  )}
    </AnimatePresence>
  </>
)
}

