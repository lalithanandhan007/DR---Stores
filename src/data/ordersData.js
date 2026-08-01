/* ====================================================================
   D.R.STORES — Admin Order mock data
   Structured like a MongoDB `orders` collection (each doc has _id and
   denormalised item snapshots), so the UI can be swapped to a real
   backend later with minimal changes.
   ==================================================================== */

import { adminProducts } from './productsData'

/* ====================================================================
   Status configuration — drives every badge & filter across the app.
   ==================================================================== */
export const ORDER_STATUSES = [
  { value: 'pending', label: 'Pending', badge: 'bg-amber-50 text-amber-600 border-amber-200', dot: 'bg-amber-500', order: 0 },
  { value: 'accepted', label: 'Accepted', badge: 'bg-blue-50 text-blue-600 border-blue-200', dot: 'bg-blue-500', order: 1 },
  { value: 'preparing', label: 'Preparing', badge: 'bg-violet-50 text-violet-600 border-violet-200', dot: 'bg-violet-500', order: 2 },
  { value: 'packed', label: 'Packed', badge: 'bg-indigo-50 text-indigo-600 border-indigo-200', dot: 'bg-indigo-500', order: 3 },
  { value: 'out_for_delivery', label: 'Out For Delivery', badge: 'bg-primary/8 text-primary border-primary/15', dot: 'bg-primary', order: 4 },
  { value: 'delivered', label: 'Delivered', badge: 'bg-emerald-50 text-emerald-600 border-emerald-200', dot: 'bg-emerald-500', order: 5 },
  { value: 'cancelled', label: 'Cancelled', badge: 'bg-red-50 text-red-500 border-red-200', dot: 'bg-red-500', order: 6 },
  { value: 'refunded', label: 'Refunded', badge: 'bg-gray-100 text-gray-500 border-gray-200', dot: 'bg-gray-400', order: 7 },
]

export const PAYMENT_STATUSES = [
  { value: 'paid', label: 'Paid', badge: 'bg-emerald-50 text-emerald-600 border-emerald-200', dot: 'bg-emerald-500' },
  { value: 'pending', label: 'Pending', badge: 'bg-amber-50 text-amber-600 border-amber-200', dot: 'bg-amber-500' },
  { value: 'failed', label: 'Failed', badge: 'bg-red-50 text-red-500 border-red-200', dot: 'bg-red-500' },
  { value: 'refunded', label: 'Refunded', badge: 'bg-gray-100 text-gray-500 border-gray-200', dot: 'bg-gray-400' },
  { value: 'cod', label: 'Cash On Delivery', badge: 'bg-blue-50 text-blue-600 border-blue-200', dot: 'bg-blue-500' },
]

export const PAYMENT_METHODS = ['UPI', 'Card', 'NetBanking', 'Cash on Delivery']

export function getOrderStatusMeta(value) {
  return ORDER_STATUSES.find((s) => s.value === value) || ORDER_STATUSES[0]
}
export function getPaymentStatusMeta(value) {
  return PAYMENT_STATUSES.find((s) => s.value === value) || PAYMENT_STATUSES[0]
}

/* ====================================================================
   Delivery partners
   ==================================================================== */
export const deliveryPartners = [
  { _id: 'dp_001', name: 'Ravi Kumar', phone: '+91 98840 11223', vehicle: 'Hero Splendor · TN01 AB 4521', vehicleType: 'Motorcycle', rating: 4.8, deliveries: 1284, online: true },
  { _id: 'dp_002', name: 'Sathish Babu', phone: '+91 98410 33221', vehicle: 'TVS Jupiter · TN22 CD 8090', vehicleType: 'Scooter', rating: 4.6, deliveries: 987, online: true },
  { _id: 'dp_003', name: 'Mohan Raj', phone: '+91 95000 77112', vehicle: 'Maruti Eeco · TN01 EF 1234', vehicleType: 'Van', rating: 4.9, deliveries: 1543, online: true },
  { _id: 'dp_004', name: 'Arun Prakash', phone: '+91 96290 44556', vehicle: 'Honda Activa · TN07 GH 9087', vehicleType: 'Scooter', rating: 4.5, deliveries: 756, online: false },
  { _id: 'dp_005', name: 'Karthik Raja', phone: '+91 97910 66554', vehicle: 'Bajaj Pulsar · TN10 JK 3456', vehicleType: 'Motorcycle', rating: 4.7, deliveries: 1102, online: true },
]

/* ====================================================================
   Customer lifetime stats (customer panel)
   ==================================================================== */
export const customerStats = {
  cus_001: { totalOrders: 27, lifetimeSpend: 18450 },
  cus_002: { totalOrders: 12, lifetimeSpend: 7860 },
  cus_003: { totalOrders: 4, lifetimeSpend: 2190 },
  cus_004: { totalOrders: 9, lifetimeSpend: 5340 },
  cus_005: { totalOrders: 31, lifetimeSpend: 24680 },
  cus_006: { totalOrders: 2, lifetimeSpend: 940 },
  cus_007: { totalOrders: 18, lifetimeSpend: 12980 },
  cus_008: { totalOrders: 1, lifetimeSpend: 672 },
  cus_009: { totalOrders: 14, lifetimeSpend: 9630 },
  cus_010: { totalOrders: 6, lifetimeSpend: 3880 },
  cus_011: { totalOrders: 22, lifetimeSpend: 15640 },
  cus_012: { totalOrders: 3, lifetimeSpend: 1520 },
}

/* ====================================================================
   Order builder — keeps totals honest so every figure in the UI matches.
   ==================================================================== */
const productById = (id) => adminProducts.find((p) => p.id === id)

function item(id, qty, weight) {
  const p = productById(id)
  return {
    productId: p.id,
    name: p.name,
    emoji: p.emoji,
    gradient: p.gradient,
    weight,
    qty,
    price: p.sellingPrice,
    mrp: p.mrp,
  }
}

const mins = (m) => new Date(Date.now() - m * 6e4).toISOString()
const hours = (h) => new Date(Date.now() - h * 36e5).toISOString()
const days = (d) => new Date(Date.now() - d * 864e5).toISOString()

const STATUS_ORDER = ['pending', 'accepted', 'preparing', 'packed', 'out_for_delivery', 'delivered']
const STEP_LABELS = [
  { status: 'pending', label: 'Order Placed' },
  { status: 'accepted', label: 'Order Accepted' },
  { status: 'preparing', label: 'Preparing Items' },
  { status: 'packed', label: 'Order Packed' },
  { status: 'out_for_delivery', label: 'Out for Delivery' },
  { status: 'delivered', label: 'Delivered' },
]
const STEP_MINUTES = [0, 3, 9, 14, 22, 31]

/* Builds the timeline trail up to the current status. Later transitions
   (done live in the UI) append further entries. */
function mkTimeline(status, createdAt, partnerName) {
  if (status === 'cancelled' || status === 'refunded') {
    return [
      { status: 'pending', label: 'Order Placed', time: createdAt, actor: 'Customer', note: 'Order received via store' },
      { status, label: status === 'cancelled' ? 'Order Cancelled' : 'Payment Refunded', time: new Date(new Date(createdAt).getTime() + 8 * 6e4).toISOString(), actor: 'Store', note: status === 'refunded' ? 'Refund initiated to source account' : 'Cancelled by store / customer' },
    ]
  }
  const idx = STATUS_ORDER.indexOf(status)
  const steps = []
  for (let i = 0; i <= idx; i++) {
    const s = STATUS_ORDER[i]
    steps.push({
      status: s,
      label: STEP_LABELS[i].label,
      note: s === 'out_for_delivery' && partnerName ? `Handed over to ${partnerName}` : s === 'delivered' ? 'Order delivered to customer' : undefined,
      time: new Date(new Date(createdAt).getTime() + STEP_MINUTES[i] * 6e4).toISOString(),
      actor: i === 0 ? 'Customer' : 'D.R.STORES',
    })
  }
  return steps
}

function buildOrder(cfg) {
  const subtotal = cfg.items.reduce((s, i) => s + i.price * i.qty, 0)
  const discount = cfg.discount || 0
  const deliveryFee = cfg.deliveryFee ?? 0
  const packagingFee = cfg.packagingFee ?? 5
  const tax = cfg.tax || 0
  const grandTotal = Math.round(subtotal - discount + deliveryFee + packagingFee + tax)
  const partner = cfg.partner
  return {
    ...cfg,
    subtotal,
    discount,
    deliveryFee,
    packagingFee,
    tax,
    grandTotal,
    timeline: mkTimeline(cfg.status, cfg.createdAt, partner?.name),
  }
}

const A = (name, phone) => ({
  name,
  phone,
  address: {
    name,
    house: '12, Lake View Residency',
    street: 'MG Road',
    locality: 'Anna Nagar',
    city: 'Chennai',
    pincode: '600040',
    landmark: 'Near Anna Arch',
    instructions: 'Leave with security if not reachable',
  },
})

/* ====================================================================
   Orders — 22 realistic records covering every status & payment state.
   ==================================================================== */
export const orders = [
  buildOrder({
    _id: 'ORD-8473', customer: { _id: 'cus_001', name: 'Priya Sharma', phone: '+91 98400 12345', email: 'priya.sharma@gmail.com', avatar: 'PS' },
    items: [item('tomato', 2, '1kg'), item('potato', 3, '1kg'), item('onion', 2, '1kg'), item('spinach', 1, 'bunch')],
    discount: 0, coupon: null, deliveryFee: 0, packagingFee: 5,
    payment: { method: 'UPI', status: 'paid', ref: 'upi_8F3K2X9QZ' },
    status: 'delivered', source: 'Mobile App',
    partner: deliveryPartners[0],
    delivery: { slot: { id: 'morning', label: 'Morning', time: '8:00 AM – 11:00 AM' }, expectedAt: mins(120), deliveredAt: mins(85) },
    ...A('Priya Sharma', '+91 98400 12345'),
    notes: { admin: [], customer: 'Call before delivery', special: 'Keep vegetables fresh — avoid plastic bags' },
    createdAt: mins(220), priority: 'normal',
  }),
  buildOrder({
    _id: 'ORD-8472', customer: { _id: 'cus_002', name: 'Arjun Mehta', phone: '+91 98840 99881', email: 'arjun.mehta@outlook.com', avatar: 'AM' },
    items: [item('carrot', 2, '500g'), item('broccoli', 1, '250g'), item('capsicum-green', 3, '250g')],
    discount: 50, coupon: 'WELCOME50', deliveryFee: 30, packagingFee: 5,
    payment: { method: 'Card', status: 'paid', ref: 'card_4771' },
    status: 'preparing', source: 'Website',
    partner: null,
    delivery: { slot: { id: 'express', label: 'Express Delivery', time: '40 minutes' }, expectedAt: mins(38) },
    ...A('Arjun Mehta', '+91 98840 99881'),
    notes: { admin: ['Verify brocolli freshness before packing'], customer: '', special: '' },
    createdAt: mins(35), priority: 'high',
  }),
  buildOrder({
    _id: 'ORD-8471', customer: { _id: 'cus_003', name: 'Sneha Rao', phone: '+91 99001 22334', email: 'sneha.rao@yahoo.com', avatar: 'SR' },
    items: [item('onion', 1, '1kg'), item('tomato', 2, '1kg'), item('mint', 2, '100g'), item('curry-leaves', 1, '100g'), item('coriander', 2, '100g'), item('garlic', 1, '250g')],
    discount: 0, coupon: null, deliveryFee: 0, packagingFee: 5,
    payment: { method: 'Cash on Delivery', status: 'cod', ref: null },
    status: 'out_for_delivery', source: 'Mobile App',
    partner: deliveryPartners[2],
    delivery: { slot: { id: 'afternoon', label: 'Afternoon', time: '12:00 PM – 3:00 PM' }, expectedAt: mins(40) },
    ...A('Sneha Rao', '+91 99001 22334'),
    notes: { admin: [], customer: '', special: 'Call on arrival — apartment gate closes at 2 PM' },
    createdAt: mins(48), priority: 'normal',
  }),
  buildOrder({
    _id: 'ORD-8470', customer: { _id: 'cus_004', name: 'Karthik Nair', phone: '+91 94440 55667', email: 'karthik.nair@gmail.com', avatar: 'KN' },
    items: [item('mushroom', 2, '200g')],
    discount: 0, coupon: null, deliveryFee: 30, packagingFee: 5,
    payment: { method: 'UPI', status: 'pending', ref: null },
    status: 'pending', source: 'Website',
    partner: null,
    delivery: { slot: { id: 'express', label: 'Express Delivery', time: '40 minutes' }, expectedAt: mins(33) },
    ...A('Karthik Nair', '+91 94440 55667'),
    notes: { admin: [], customer: '', special: '' },
    createdAt: mins(6), priority: 'high',
  }),
  buildOrder({
    _id: 'ORD-8469', customer: { _id: 'cus_005', name: 'Divya Krishnan', phone: '+91 98420 77889', email: 'divya.krishnan@gmail.com', avatar: 'DK' },
    items: [item('beetroot', 2, '500g'), item('carrot', 1, '1kg'), item('spinach', 1, 'bunch')],
    discount: 0, coupon: null, deliveryFee: 0, packagingFee: 5,
    payment: { method: 'UPI', status: 'paid', ref: 'upi_9L1T8G4HB' },
    status: 'delivered', source: 'Mobile App',
    partner: deliveryPartners[1],
    delivery: { slot: { id: 'morning', label: 'Morning', time: '8:00 AM – 11:00 AM' }, expectedAt: hours(2), deliveredAt: hours(3) },
    ...A('Divya Krishnan', '+91 98420 77889'),
    notes: { admin: [], customer: '', special: '' },
    createdAt: hours(3), priority: 'normal',
  }),
  buildOrder({
    _id: 'ORD-8468', customer: { _id: 'cus_006', name: 'Mohammed Irfan', phone: '+91 96290 44556', email: 'mirfan@gmail.com', avatar: 'MI' },
    items: [item('broccoli', 1, '250g'), item('zucchini', 2, '250g'), item('mushroom', 1, '200g'), item('corn', 2, '250g')],
    discount: 100, coupon: 'FRESH100', deliveryFee: 0, packagingFee: 5,
    payment: { method: 'Card', status: 'refunded', ref: 'card_3342' },
    status: 'refunded', source: 'Website',
    partner: null,
    delivery: { slot: { id: 'evening', label: 'Evening', time: '5:00 PM – 8:00 PM' }, expectedAt: null },
    ...A('Mohammed Irfan', '+91 96290 44556'),
    notes: { admin: ['Refund processed against cancelled order'], customer: 'Requested to cancel — item out of stock', special: '' },
    createdAt: hours(5), priority: 'normal',
  }),
  buildOrder({
    _id: 'ORD-8467', customer: { _id: 'cus_007', name: 'Lakshmi Devi', phone: '+91 95850 33445', email: 'lakshmi.devi@gmail.com', avatar: 'LD' },
    items: [item('lemon', 6, '1 piece'), item('cucumber', 2, '500g'), item('cabbage', 1, '500g')],
    discount: 0, coupon: null, deliveryFee: 0, packagingFee: 5,
    payment: { method: 'NetBanking', status: 'paid', ref: 'nb_11223' },
    status: 'delivered', source: 'Phone',
    partner: deliveryPartners[0],
    delivery: { slot: { id: 'morning', label: 'Morning', time: '8:00 AM – 11:00 AM' }, expectedAt: hours(4), deliveredAt: hours(5) },
    ...A('Lakshmi Devi', '+91 95850 33445'),
    notes: { admin: [], customer: 'Ring twice — bell is broken', special: '' },
    createdAt: hours(6), priority: 'normal',
  }),
  buildOrder({
    _id: 'ORD-8466', customer: { _id: 'cus_008', name: 'Rohan Iyer', phone: '+91 90030 11223', email: 'rohan.iyer@hotmail.com', avatar: 'RI' },
    items: [item('tomato', 1, '1kg'), item('onion', 1, '1kg'), item('ginger', 1, '250g'), item('garlic', 1, '250g')],
    discount: 0, coupon: null, deliveryFee: 0, packagingFee: 5,
    payment: { method: 'UPI', status: 'paid', ref: 'upi_4E7B2R8PL' },
    status: 'accepted', source: 'Mobile App',
    partner: null,
    delivery: { slot: { id: 'afternoon', label: 'Afternoon', time: '12:00 PM – 3:00 PM' }, expectedAt: hours(2) },
    ...A('Rohan Iyer', '+91 90030 11223'),
    notes: { admin: [], customer: '', special: 'Double bag the onions' },
    createdAt: mins(14), priority: 'normal',
  }),
  buildOrder({
    _id: 'ORD-8465', customer: { _id: 'cus_009', name: 'Meera Nandini', phone: '+91 97890 66554', email: 'meera.n@gmail.com', avatar: 'MN' },
    items: [item('sweet-potato', 2, '500g'), item('corn', 1, '250g'), item('peas', 1, '250g')],
    discount: 0, coupon: null, deliveryFee: 0, packagingFee: 5,
    payment: { method: 'Cash on Delivery', status: 'cod', ref: null },
    status: 'packed', source: 'Website',
    partner: null,
    delivery: { slot: { id: 'evening', label: 'Evening', time: '5:00 PM – 8:00 PM' }, expectedAt: hours(3) },
    ...A('Meera Nandini', '+91 97890 66554'),
    notes: { admin: [], customer: '', special: '' },
    createdAt: mins(22), priority: 'normal',
  }),
  buildOrder({
    _id: 'ORD-8464', customer: { _id: 'cus_010', name: 'Suresh Kumar', phone: '+91 99940 88990', email: 'suresh.k@gmail.com', avatar: 'SK' },
    items: [item('drumstick', 2, '250g'), item('bitter-gourd', 1, '250g'), item('cluster-beans', 1, '250g')],
    discount: 0, coupon: null, deliveryFee: 0, packagingFee: 5,
    payment: { method: 'UPI', status: 'failed', ref: null },
    status: 'pending', source: 'Mobile App',
    partner: null,
    delivery: { slot: { id: 'morning', label: 'Morning', time: '8:00 AM – 11:00 AM' }, expectedAt: hours(5) },
    ...A('Suresh Kumar', '+91 99940 88990'),
    notes: { admin: ['Retry payment — UPI declined once'], customer: '', special: '' },
    createdAt: mins(30), priority: 'normal',
  }),
  buildOrder({
    _id: 'ORD-8463', customer: { _id: 'cus_011', name: 'Anita Verma', phone: '+91 98650 22331', email: 'anita.verma@gmail.com', avatar: 'AV' },
    items: [item('broccoli', 2, '250g'), item('mushroom', 1, '200g'), item('carrot', 1, '500g'), item('cabbage', 1, '1kg')],
    discount: 100, coupon: 'FRESH100', deliveryFee: 0, packagingFee: 5,
    payment: { method: 'Card', status: 'paid', ref: 'card_5590' },
    status: 'delivered', source: 'Mobile App',
    partner: deliveryPartners[4],
    delivery: { slot: { id: 'afternoon', label: 'Afternoon', time: '12:00 PM – 3:00 PM' }, expectedAt: days(0), deliveredAt: days(0) },
    ...A('Anita Verma', '+91 98650 22331'),
    notes: { admin: [], customer: '', special: '' },
    createdAt: hours(8), priority: 'normal',
  }),
  buildOrder({
    _id: 'ORD-8462', customer: { _id: 'cus_002', name: 'Arjun Mehta', phone: '+91 98840 99881', email: 'arjun.mehta@outlook.com', avatar: 'AM' },
    items: [item('spinach', 2, 'bunch'), item('coriander', 2, '100g'), item('mint', 1, '100g')],
    discount: 0, coupon: null, deliveryFee: 30, packagingFee: 5,
    payment: { method: 'Card', status: 'paid', ref: 'card_7788' },
    status: 'delivered', source: 'Website',
    partner: deliveryPartners[1],
    delivery: { slot: { id: 'express', label: 'Express Delivery', time: '40 minutes' }, expectedAt: hours(10), deliveredAt: hours(10) },
    ...A('Arjun Mehta', '+91 98840 99881'),
    notes: { admin: [], customer: '', special: '' },
    createdAt: hours(11), priority: 'normal',
  }),
  buildOrder({
    _id: 'ORD-8461', customer: { _id: 'cus_012', name: 'Vignesh Raja', phone: '+91 95000 44556', email: 'vignesh.r@gmail.com', avatar: 'VR' },
    items: [item('raw-banana', 2, '1kg'), item('sweet-potato', 1, '500g'), item('potato', 2, '1kg')],
    discount: 10, coupon: 'DR10', deliveryFee: 0, packagingFee: 5,
    payment: { method: 'Cash on Delivery', status: 'cod', ref: null },
    status: 'cancelled', source: 'Phone',
    partner: null,
    delivery: { slot: { id: 'morning', label: 'Morning', time: '8:00 AM – 11:00 AM' }, expectedAt: null },
    ...A('Vignesh Raja', '+91 95000 44556'),
    notes: { admin: ['Customer cancelled — changed mind'], customer: 'Cancelled after order', special: '' },
    createdAt: hours(14), priority: 'normal',
  }),
  buildOrder({
    _id: 'ORD-8460', customer: { _id: 'cus_001', name: 'Priya Sharma', phone: '+91 98400 12345', email: 'priya.sharma@gmail.com', avatar: 'PS' },
    items: [item('lemon', 12, '1 piece'), item('mint', 2, '100g'), item('cucumber', 2, '1kg')],
    discount: 0, coupon: null, deliveryFee: 0, packagingFee: 5,
    payment: { method: 'UPI', status: 'paid', ref: 'upi_2C5N9W3TR' },
    status: 'delivered', source: 'Mobile App',
    partner: deliveryPartners[3],
    delivery: { slot: { id: 'morning', label: 'Morning', time: '8:00 AM – 11:00 AM' }, expectedAt: days(1), deliveredAt: days(1) },
    ...A('Priya Sharma', '+91 98400 12345'),
    notes: { admin: [], customer: '', special: '' },
    createdAt: days(1), priority: 'normal',
  }),
  buildOrder({
    _id: 'ORD-8459', customer: { _id: 'cus_005', name: 'Divya Krishnan', phone: '+91 98420 77889', email: 'divya.krishnan@gmail.com', avatar: 'DK' },
    items: [item('tomato', 3, '1kg'), item('capsicum-green', 2, '250g'), item('broccoli', 1, '250g'), item('corn', 1, '250g')],
    discount: 0, coupon: null, deliveryFee: 0, packagingFee: 5,
    payment: { method: 'UPI', status: 'paid', ref: 'upi_7H1M4P6QT' },
    status: 'delivered', source: 'Website',
    partner: deliveryPartners[2],
    delivery: { slot: { id: 'evening', label: 'Evening', time: '5:00 PM – 8:00 PM' }, expectedAt: days(2), deliveredAt: days(2) },
    ...A('Divya Krishnan', '+91 98420 77889'),
    notes: { admin: [], customer: '', special: 'Leave at door' },
    createdAt: days(2), priority: 'normal',
  }),
  buildOrder({
    _id: 'ORD-8458', customer: { _id: 'cus_007', name: 'Lakshmi Devi', phone: '+91 95850 33445', email: 'lakshmi.devi@gmail.com', avatar: 'LD' },
    items: [item('onion', 2, '1kg'), item('potato', 2, '1kg'), item('garlic', 1, '500g')],
    discount: 0, coupon: null, deliveryFee: 0, packagingFee: 5,
    payment: { method: 'NetBanking', status: 'paid', ref: 'nb_44556' },
    status: 'delivered', source: 'Phone',
    partner: deliveryPartners[0],
    delivery: { slot: { id: 'afternoon', label: 'Afternoon', time: '12:00 PM – 3:00 PM' }, expectedAt: days(3), deliveredAt: days(3) },
    ...A('Lakshmi Devi', '+91 95850 33445'),
    notes: { admin: [], customer: '', special: '' },
    createdAt: days(3), priority: 'normal',
  }),
  buildOrder({
    _id: 'ORD-8457', customer: { _id: 'cus_009', name: 'Meera Nandini', phone: '+91 97890 66554', email: 'meera.n@gmail.com', avatar: 'MN' },
    items: [item('mushroom', 1, '200g'), item('ginger', 2, '100g')],
    discount: 0, coupon: null, deliveryFee: 30, packagingFee: 5,
    payment: { method: 'UPI', status: 'paid', ref: 'upi_9Y8U6I2OA' },
    status: 'preparing', source: 'Mobile App',
    partner: null,
    delivery: { slot: { id: 'express', label: 'Express Delivery', time: '40 minutes' }, expectedAt: mins(25) },
    ...A('Meera Nandini', '+91 97890 66554'),
    notes: { admin: [], customer: 'Fast — making dinner', special: '' },
    createdAt: mins(18), priority: 'high',
  }),
  buildOrder({
    _id: 'ORD-8456', customer: { _id: 'cus_004', name: 'Karthik Nair', phone: '+91 94440 55667', email: 'karthik.nair@gmail.com', avatar: 'KN' },
    items: [item('carrot', 1, '500g'), item('beetroot', 1, '500g'), item('cucumber', 1, '500g')],
    discount: 50, coupon: 'WELCOME50', deliveryFee: 0, packagingFee: 5,
    payment: { method: 'Card', status: 'refunded', ref: 'card_1234' },
    status: 'refunded', source: 'Website',
    partner: null,
    delivery: { slot: { id: 'morning', label: 'Morning', time: '8:00 AM – 11:00 AM' }, expectedAt: null },
    ...A('Karthik Nair', '+91 94440 55667'),
    notes: { admin: ['Refunded — items damaged in transit'], customer: 'Complained about crushed carrots', special: '' },
    createdAt: days(4), priority: 'normal',
  }),
  buildOrder({
    _id: 'ORD-8455', customer: { _id: 'cus_011', name: 'Anita Verma', phone: '+91 98650 22331', email: 'anita.verma@gmail.com', avatar: 'AV' },
    items: [item('spinach', 2, 'bunch'), item('fenugreek', 1, '100g'), item('curry-leaves', 2, '100g')],
    discount: 0, coupon: null, deliveryFee: 0, packagingFee: 5,
    payment: { method: 'UPI', status: 'paid', ref: 'upi_3B6D8F1QW' },
    status: 'delivered', source: 'Mobile App',
    partner: deliveryPartners[4],
    delivery: { slot: { id: 'morning', label: 'Morning', time: '8:00 AM – 11:00 AM' }, expectedAt: days(4), deliveredAt: days(4) },
    ...A('Anita Verma', '+91 98650 22331'),
    notes: { admin: [], customer: '', special: '' },
    createdAt: days(4), priority: 'normal',
  }),
  buildOrder({
    _id: 'ORD-8454', customer: { _id: 'cus_003', name: 'Sneha Rao', phone: '+91 99001 22334', email: 'sneha.rao@yahoo.com', avatar: 'SR' },
    items: [item('tomato', 2, '1kg'), item('onion', 1, '1kg'), item('green-chilli', 1, '100g')],
    discount: 0, coupon: null, deliveryFee: 0, packagingFee: 5,
    payment: { method: 'Cash on Delivery', status: 'cod', ref: null },
    status: 'cancelled', source: 'Phone',
    partner: null,
    delivery: { slot: { id: 'evening', label: 'Evening', time: '5:00 PM – 8:00 PM' }, expectedAt: null },
    ...A('Sneha Rao', '+91 99001 22334'),
    notes: { admin: ['Cancelled — delivery zone temporarily paused'], customer: '', special: '' },
    createdAt: days(5), priority: 'normal',
  }),
  buildOrder({
    _id: 'ORD-8453', customer: { _id: 'cus_001', name: 'Priya Sharma', phone: '+91 98400 12345', email: 'priya.sharma@gmail.com', avatar: 'PS' },
    items: [item('broccoli', 1, '250g'), item('mushroom', 1, '200g'), item('lemon', 4, '1 piece')],
    discount: 0, coupon: null, deliveryFee: 0, packagingFee: 5,
    payment: { method: 'Card', status: 'paid', ref: 'card_9021' },
    status: 'delivered', source: 'Website',
    partner: deliveryPartners[1],
    delivery: { slot: { id: 'afternoon', label: 'Afternoon', time: '12:00 PM – 3:00 PM' }, expectedAt: days(6), deliveredAt: days(6) },
    ...A('Priya Sharma', '+91 98400 12345'),
    notes: { admin: [], customer: '', special: '' },
    createdAt: days(6), priority: 'normal',
  }),
  buildOrder({
    _id: 'ORD-8452', customer: { _id: 'cus_006', name: 'Mohammed Irfan', phone: '+91 96290 44556', email: 'mirfan@gmail.com', avatar: 'MI' },
    items: [item('potato', 2, '1kg'), item('onion', 2, '1kg'), item('garlic', 1, '250g'), item('ginger', 1, '250g'), item('tomato', 2, '1kg')],
    discount: 100, coupon: 'FRESH100', deliveryFee: 0, packagingFee: 5,
    payment: { method: 'UPI', status: 'paid', ref: 'upi_5R7T9Y1UO' },
    status: 'delivered', source: 'Mobile App',
    partner: deliveryPartners[2],
    delivery: { slot: { id: 'morning', label: 'Morning', time: '8:00 AM – 11:00 AM' }, expectedAt: days(7), deliveredAt: days(7) },
    ...A('Mohammed Irfan', '+91 96290 44556'),
    notes: { admin: [], customer: '', special: '' },
    createdAt: days(7), priority: 'normal',
  }),
]

export const orderSourceOptions = ['Mobile App', 'Website', 'Phone']
