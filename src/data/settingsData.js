/* ====================================================================
   D.R.STORES — Store Settings mock data
   All configurable store parameters. MongoDB-ready (single store doc).
   ==================================================================== */

export const defaultSettings = {
  /* Store identity */
  storeName: 'D.R.STORES',
  storeTagline: 'Farm Fresh • Trusted • Local',
  ownerName: 'Ramesh Anandhan',
  gstNumber: '33ABCDE1234F1Z5',
  phone: '+91 98765 43210',
  email: 'admin@drstores.com',
  address: {
    street: '42, Main Road',
    locality: 'Anna Nagar',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600040',
    country: 'India',
  },

  /* Business hours */
  businessHours: {
    monday: { open: '08:00', close: '22:00', active: true },
    tuesday: { open: '08:00', close: '22:00', active: true },
    wednesday: { open: '08:00', close: '22:00', active: true },
    thursday: { open: '08:00', close: '22:00', active: true },
    friday: { open: '08:00', close: '22:00', active: true },
    saturday: { open: '08:00', close: '22:00', active: true },
    sunday: { open: '09:00', close: '20:00', active: true },
  },

  /* Delivery */
  deliveryRadius: 15,
  minimumOrder: 100,
  freeDeliveryAbove: 500,
  deliveryCharges: 30,
  expressDeliveryCharge: 50,
  expressDeliveryTime: 40,

  /* Payments */
  acceptUPI: true,
  acceptCard: true,
  acceptNetBanking: true,
  acceptCOD: true,
  codLimit: 2000,

  /* Notifications */
  notifyNewOrder: true,
  notifyLowStock: true,
  notifyCancelled: true,
  notifyNewCustomer: true,
  notifyCouponExpiry: true,
  emailNotifications: true,
  smsNotifications: false,
  pushNotifications: true,

  /* Theme */
  primaryColor: '#2E7D32',
  accentColor: '#FF9800',
  darkMode: false,
  compactMode: false,

  /* System */
  maintenanceMode: false,
  maintenanceMessage: 'We\'ll be back soon! Our store is undergoing scheduled maintenance.',
  autoBackup: true,
  backupFrequency: 'daily',

  /* Meta */
  updatedAt: new Date().toISOString(),
}

export const DAY_LABELS = {
  monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday',
  thursday: 'Thursday', friday: 'Friday', saturday: 'Saturday', sunday: 'Sunday',
}
