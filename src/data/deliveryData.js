/* ====================================================================
   D.R.STORES — Delivery Partners module mock data
   Extends the base partner objects from ordersData.js with richer
   performance metrics, availability schedule, and recent activity.
   MongoDB-ready.
   ==================================================================== */

const d = (n) => new Date(Date.now() - n * 864e5).toISOString()
const h = (n) => new Date(Date.now() - n * 36e5).toISOString()
const mins = (m) => new Date(Date.now() - m * 6e4).toISOString()

export const DELIVERY_STATUSES = [
  { value: 'online', label: 'Online', badge: 'bg-emerald-50 text-emerald-600 border-emerald-200', dot: 'bg-emerald-500' },
  { value: 'offline', label: 'Offline', badge: 'bg-gray-100 text-gray-500 border-gray-200', dot: 'bg-gray-400' },
  { value: 'on_delivery', label: 'On Delivery', badge: 'bg-primary/8 text-primary border-primary/15', dot: 'bg-primary' },
]

export function getDeliveryStatusMeta(value) {
  return DELIVERY_STATUSES.find((s) => s.value === value) || DELIVERY_STATUSES[1]
}

export const deliveryPartners = [
  {
    _id: 'dp_001', name: 'Ravi Kumar', phone: '+91 98840 11223',
    email: 'ravi.kumar@drstores.com',
    vehicle: 'Hero Splendor · TN01 AB 4521', vehicleType: 'Motorcycle',
    rating: 4.8, totalDeliveries: 1284, successfulDeliveries: 1261, cancelledDeliveries: 23,
    avgDeliveryTime: 34, // minutes
    onTimePercentage: 94,
    status: 'online',
    joinedAt: d(300), lastActiveAt: mins(5),
    todayDeliveries: 8, todayEarnings: 960,
    zone: 'Anna Nagar / T. Nagar',
    shift: '8:00 AM – 6:00 PM',
    documents: { license: true, aadhaar: true, insurance: true },
    recentDeliveries: [
      { orderId: 'ORD-8473', customer: 'Priya Sharma', time: h(3), rating: 5, earnings: 120 },
      { orderId: 'ORD-8469', customer: 'Divya Krishnan', time: h(4), rating: 5, earnings: 120 },
      { orderId: 'ORD-8467', customer: 'Lakshmi Devi', time: h(5), rating: 4, earnings: 100 },
    ],
  },
  {
    _id: 'dp_002', name: 'Sathish Babu', phone: '+91 98410 33221',
    email: 'sathish.b@drstores.com',
    vehicle: 'TVS Jupiter · TN22 CD 8090', vehicleType: 'Scooter',
    rating: 4.6, totalDeliveries: 987, successfulDeliveries: 970, cancelledDeliveries: 17,
    avgDeliveryTime: 38, onTimePercentage: 91,
    status: 'on_delivery',
    joinedAt: d(240), lastActiveAt: mins(2),
    todayDeliveries: 6, todayEarnings: 720,
    zone: 'Velachery / Adyar',
    shift: '10:00 AM – 8:00 PM',
    documents: { license: true, aadhaar: true, insurance: true },
    recentDeliveries: [
      { orderId: 'ORD-8465', customer: 'Meera Nandini', time: mins(22), rating: null, earnings: 110 },
    ],
  },
  {
    _id: 'dp_003', name: 'Mohan Raj', phone: '+91 95000 77112',
    email: 'mohan.r@drstores.com',
    vehicle: 'Maruti Eeco · TN01 EF 1234', vehicleType: 'Van',
    rating: 4.9, totalDeliveries: 1543, successfulDeliveries: 1531, cancelledDeliveries: 12,
    avgDeliveryTime: 42, onTimePercentage: 96,
    status: 'on_delivery',
    joinedAt: d(365), lastActiveAt: mins(1),
    todayDeliveries: 10, todayEarnings: 1400,
    zone: 'City-wide (bulk orders)',
    shift: '7:00 AM – 5:00 PM',
    documents: { license: true, aadhaar: true, insurance: true },
    recentDeliveries: [
      { orderId: 'ORD-8471', customer: 'Sneha Rao', time: mins(48), rating: null, earnings: 150 },
    ],
  },
  {
    _id: 'dp_004', name: 'Arun Prakash', phone: '+91 96290 44556',
    email: 'arun.p@drstores.com',
    vehicle: 'Honda Activa · TN07 GH 9087', vehicleType: 'Scooter',
    rating: 4.5, totalDeliveries: 756, successfulDeliveries: 742, cancelledDeliveries: 14,
    avgDeliveryTime: 40, onTimePercentage: 89,
    status: 'offline',
    joinedAt: d(180), lastActiveAt: d(1),
    todayDeliveries: 0, todayEarnings: 0,
    zone: 'Porur / Vadapalani',
    shift: '12:00 PM – 10:00 PM',
    documents: { license: true, aadhaar: true, insurance: false },
    recentDeliveries: [],
  },
  {
    _id: 'dp_005', name: 'Karthik Raja', phone: '+91 97910 66554',
    email: 'karthik.r@drstores.com',
    vehicle: 'Bajaj Pulsar · TN10 JK 3456', vehicleType: 'Motorcycle',
    rating: 4.7, totalDeliveries: 1102, successfulDeliveries: 1085, cancelledDeliveries: 17,
    avgDeliveryTime: 32, onTimePercentage: 93,
    status: 'online',
    joinedAt: d(270), lastActiveAt: mins(8),
    todayDeliveries: 5, todayEarnings: 600,
    zone: 'T. Nagar / Nungambakkam',
    shift: '9:00 AM – 7:00 PM',
    documents: { license: true, aadhaar: true, insurance: true },
    recentDeliveries: [
      { orderId: 'ORD-8463', customer: 'Anita Verma', time: h(8), rating: 5, earnings: 130 },
    ],
  },
  {
    _id: 'dp_006', name: 'Deepak Singh', phone: '+91 94450 88771',
    email: 'deepak.s@drstores.com',
    vehicle: 'Honda CB Shine · TN04 LM 7890', vehicleType: 'Motorcycle',
    rating: 4.3, totalDeliveries: 342, successfulDeliveries: 330, cancelledDeliveries: 12,
    avgDeliveryTime: 45, onTimePercentage: 85,
    status: 'offline',
    joinedAt: d(45), lastActiveAt: d(2),
    todayDeliveries: 0, todayEarnings: 0,
    zone: 'Guindy / Saidapet',
    shift: '6:00 PM – 11:00 PM',
    documents: { license: true, aadhaar: false, insurance: false },
    recentDeliveries: [],
  },
  {
    _id: 'dp_007', name: 'Vikram Patel', phone: '+91 98760 55432',
    email: 'vikram.p@drstores.com',
    vehicle: 'TVS Ntorq · TN09 NO 2345', vehicleType: 'Scooter',
    rating: 4.4, totalDeliveries: 518, successfulDeliveries: 508, cancelledDeliveries: 10,
    avgDeliveryTime: 36, onTimePercentage: 90,
    status: 'online',
    joinedAt: d(120), lastActiveAt: mins(12),
    todayDeliveries: 3, todayEarnings: 360,
    zone: 'Thiruvanmiyur / Sholinganallur',
    shift: '8:00 AM – 4:00 PM',
    documents: { license: true, aadhaar: true, insurance: true },
    recentDeliveries: [],
  },
]

/* Delivery performance summary (last 7 days) */
export const deliveryPerformance = [
  { day: 'Mon', delivered: 121, onTime: 113, avgTime: 36 },
  { day: 'Tue', delivered: 134, onTime: 125, avgTime: 34 },
  { day: 'Wed', delivered: 128, onTime: 119, avgTime: 37 },
  { day: 'Thu', delivered: 149, onTime: 141, avgTime: 33 },
  { day: 'Fri', delivered: 165, onTime: 154, avgTime: 35 },
  { day: 'Sat', delivered: 182, onTime: 170, avgTime: 38 },
  { day: 'Sun', delivered: 178, onTime: 167, avgTime: 36 },
]
