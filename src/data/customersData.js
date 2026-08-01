/* ====================================================================
   D.R.STORES — Customer module mock data
   Derives customer profiles from orders, enriched with tags, notes,
   addresses, wishlist, and stats. MongoDB-ready (_id fields).
   ==================================================================== */

const d = (n) => new Date(Date.now() - n * 864e5).toISOString()
const h = (n) => new Date(Date.now() - n * 36e5).toISOString()

export const CUSTOMER_TAGS = [
  { value: 'vip', label: 'VIP', badge: 'bg-amber-50 text-amber-600 border-amber-200', dot: 'bg-amber-500' },
  { value: 'premium', label: 'Premium', badge: 'bg-violet-50 text-violet-600 border-violet-200', dot: 'bg-violet-500' },
  { value: 'regular', label: 'Regular', badge: 'bg-emerald-50 text-emerald-600 border-emerald-200', dot: 'bg-emerald-500' },
  { value: 'new', label: 'New', badge: 'bg-blue-50 text-blue-600 border-blue-200', dot: 'bg-blue-500' },
]

export function getCustomerTagMeta(value) {
  return CUSTOMER_TAGS.find((t) => t.value === value) || CUSTOMER_TAGS[2]
}

export const customers = [
  {
    _id: 'cus_001', name: 'Priya Sharma', phone: '+91 98400 12345', email: 'priya.sharma@gmail.com',
    avatar: 'PS', tag: 'vip', blocked: false,
    joinedAt: d(180), lastActiveAt: h(1),
    notes: ['Loves organic vegetables', 'Prefers morning delivery slots'],
    wishlist: ['tomato', 'spinach', 'lemon', 'curry-leaves'],
    addresses: [
      { id: 'a1', label: 'Home', house: '12, Lake View Residency', street: 'MG Road', locality: 'Anna Nagar', city: 'Chennai', pincode: '600040', landmark: 'Near Anna Arch', isDefault: true },
      { id: 'a2', label: 'Office', house: '5B, Tech Park Tower', street: 'Tidel Park Road', locality: 'Taramani', city: 'Chennai', pincode: '600113', landmark: 'Opposite TIDEL', isDefault: false },
    ],
    totalOrders: 27, lifetimeSpend: 18450, avgOrderValue: 683,
  },
  {
    _id: 'cus_002', name: 'Arjun Mehta', phone: '+91 98840 99881', email: 'arjun.mehta@outlook.com',
    avatar: 'AM', tag: 'premium', blocked: false,
    joinedAt: d(120), lastActiveAt: h(3),
    notes: ['Frequent exotic vegetable buyer'],
    wishlist: ['broccoli', 'mushroom', 'zucchini'],
    addresses: [
      { id: 'a1', label: 'Home', house: '42, Sunrise Apartments', street: 'Greams Road', locality: 'Nungambakkam', city: 'Chennai', pincode: '600006', landmark: 'Near Gemini Bridge', isDefault: true },
    ],
    totalOrders: 12, lifetimeSpend: 7860, avgOrderValue: 655,
  },
  {
    _id: 'cus_003', name: 'Sneha Rao', phone: '+91 99001 22334', email: 'sneha.rao@yahoo.com',
    avatar: 'SR', tag: 'regular', blocked: false,
    joinedAt: d(60), lastActiveAt: h(6),
    notes: [],
    wishlist: ['tomato', 'onion', 'coriander'],
    addresses: [
      { id: 'a1', label: 'Home', house: '8, Green Villa', street: 'Velachery Main Road', locality: 'Velachery', city: 'Chennai', pincode: '600042', landmark: 'Next to Phoenix Mall', isDefault: true },
    ],
    totalOrders: 4, lifetimeSpend: 2190, avgOrderValue: 548,
  },
  {
    _id: 'cus_004', name: 'Karthik Nair', phone: '+91 94440 55667', email: 'karthik.nair@gmail.com',
    avatar: 'KN', tag: 'regular', blocked: false,
    joinedAt: d(90), lastActiveAt: h(2),
    notes: ['Prefers UPI payments only'],
    wishlist: ['carrot', 'beetroot', 'cucumber'],
    addresses: [
      { id: 'a1', label: 'Home', house: '15, Lakewood Enclave', street: 'ECR Road', locality: 'Thiruvanmiyur', city: 'Chennai', pincode: '600041', landmark: 'Opposite VGP Park', isDefault: true },
    ],
    totalOrders: 9, lifetimeSpend: 5340, avgOrderValue: 593,
  },
  {
    _id: 'cus_005', name: 'Divya Krishnan', phone: '+91 98420 77889', email: 'divya.krishnan@gmail.com',
    avatar: 'DK', tag: 'vip', blocked: false,
    joinedAt: d(240), lastActiveAt: h(2),
    notes: ['Birthday discount applied annually', 'Loves fresh herbs'],
    wishlist: ['spinach', 'coriander', 'mint', 'fenugreek', 'curry-leaves'],
    addresses: [
      { id: 'a1', label: 'Home', house: '23, Palm Grove', street: 'Alwarpet Main Road', locality: 'Alwarpet', city: 'Chennai', pincode: '600018', landmark: 'Near Ashtabujam Temple', isDefault: true },
      { id: 'a2', label: 'Parents', house: '7, Garden Layout', street: 'Kodambakkam High Road', locality: 'Kodambakkam', city: 'Chennai', pincode: '600024', landmark: 'Behind Hotel Palm Grove', isDefault: false },
    ],
    totalOrders: 31, lifetimeSpend: 24680, avgOrderValue: 796,
  },
  {
    _id: 'cus_006', name: 'Mohammed Irfan', phone: '+91 96290 44556', email: 'mirfan@gmail.com',
    avatar: 'MI', tag: 'new', blocked: false,
    joinedAt: d(14), lastActiveAt: h(5),
    notes: ['First-time coupon used'],
    wishlist: ['broccoli', 'zucchini', 'corn'],
    addresses: [
      { id: 'a1', label: 'Home', house: '56, Market Street', street: 'Pondy Bazaar', locality: 'T Nagar', city: 'Chennai', pincode: '600017', landmark: 'Near Parry\'s Corner', isDefault: true },
    ],
    totalOrders: 2, lifetimeSpend: 940, avgOrderValue: 470,
  },
  {
    _id: 'cus_007', name: 'Lakshmi Devi', phone: '+91 95850 33445', email: 'lakshmi.devi@gmail.com',
    avatar: 'LD', tag: 'premium', blocked: false,
    joinedAt: d(150), lastActiveAt: h(4),
    notes: ['Prefers phone orders', 'Cash payment preferred'],
    wishlist: ['lemon', 'cucumber', 'cabbage'],
    addresses: [
      { id: 'a1', label: 'Home', house: '9, Lakshmi Nagar', street: 'Porur High Road', locality: 'Porur', city: 'Chennai', pincode: '600125', landmark: 'Near Ramachandra Hospital', isDefault: true },
    ],
    totalOrders: 18, lifetimeSpend: 12980, avgOrderValue: 721,
  },
  {
    _id: 'cus_008', name: 'Rohan Iyer', phone: '+91 90030 11223', email: 'rohan.iyer@hotmail.com',
    avatar: 'RI', tag: 'new', blocked: false,
    joinedAt: d(3), lastActiveAt: h(1),
    notes: [],
    wishlist: ['tomato', 'onion', 'ginger', 'garlic'],
    addresses: [
      { id: 'a1', label: 'Home', house: '31, Brindavan Layout', street: 'Adyar Bridge Road', locality: 'Adyar', city: 'Chennai', pincode: '600020', landmark: 'Beside IIT Madras Gate 4', isDefault: true },
    ],
    totalOrders: 1, lifetimeSpend: 672, avgOrderValue: 672,
  },
  {
    _id: 'cus_009', name: 'Meera Nandini', phone: '+91 97890 66554', email: 'meera.n@gmail.com',
    avatar: 'MN', tag: 'regular', blocked: false,
    joinedAt: d(45), lastActiveAt: h(0),
    notes: ['Vegetarian only', 'Prefers evening delivery'],
    wishlist: ['sweet-potato', 'corn', 'peas'],
    addresses: [
      { id: 'a1', label: 'Home', house: '18, Marigold Avenue', street: 'R.A. Puram Main Road', locality: 'R.A. Puram', city: 'Chennai', pincode: '600028', landmark: 'Opposite Nageswara Rao Park', isDefault: true },
    ],
    totalOrders: 14, lifetimeSpend: 9630, avgOrderValue: 688,
  },
  {
    _id: 'cus_010', name: 'Suresh Kumar', phone: '+91 99940 88990', email: 'suresh.k@gmail.com',
    avatar: 'SK', tag: 'regular', blocked: true,
    joinedAt: d(75), lastActiveAt: d(10),
    notes: ['Blocked due to repeated returns — review after 30 days'],
    wishlist: ['drumstick', 'bitter-gourd', 'cluster-beans'],
    addresses: [
      { id: 'a1', label: 'Home', house: '67, Gandhi Nagar', street: 'Guindy Road', locality: 'Guindy', city: 'Chennai', pincode: '600032', landmark: 'Near Guindy Railway Station', isDefault: true },
    ],
    totalOrders: 6, lifetimeSpend: 3880, avgOrderValue: 647,
  },
  {
    _id: 'cus_011', name: 'Anita Verma', phone: '+91 98650 22331', email: 'anita.verma@gmail.com',
    avatar: 'AV', tag: 'premium', blocked: false,
    joinedAt: d(200), lastActiveAt: h(8),
    notes: ['Exotic vegetables enthusiast', 'Shares feedback often'],
    wishlist: ['broccoli', 'mushroom', 'carrot', 'cabbage'],
    addresses: [
      { id: 'a1', label: 'Home', house: '4, Jubilee Layout', street: 'Kasturba Nagar 2nd Main Road', locality: 'Kasturba Nagar', city: 'Chennai', pincode: '600082', landmark: 'Near Adyar Ananda Bhavan', isDefault: true },
      { id: 'a2', label: 'In-laws', house: '88, Rajaji Nagar', street: '100 Feet Road', locality: 'Nanganallur', city: 'Chennai', pincode: '600077', landmark: 'Near Nanganallur Murugan Temple', isDefault: false },
    ],
    totalOrders: 22, lifetimeSpend: 15640, avgOrderValue: 711,
  },
  {
    _id: 'cus_012', name: 'Vignesh Raja', phone: '+91 95000 44556', email: 'vignesh.r@gmail.com',
    avatar: 'VR', tag: 'new', blocked: false,
    joinedAt: d(20), lastActiveAt: d(0),
    notes: ['Requested raw banana availability notification'],
    wishlist: ['raw-banana', 'sweet-potato', 'potato'],
    addresses: [
      { id: 'a1', label: 'Home', house: '22, Ganesh Street', street: 'Kodambakkam High Road', locality: 'Kodambakkam', city: 'Chennai', pincode: '600024', landmark: 'Near Sathya Studios', isDefault: true },
    ],
    totalOrders: 3, lifetimeSpend: 1520, avgOrderValue: 507,
  },
]
