import mongoose from 'mongoose'

const settingsSchema = new mongoose.Schema(
  {
    /* =========================================================
       STORE IDENTITY
       ========================================================= */

    storeName: {
      type: String,
      required: true,
      trim: true,
    },

    storeTagline: {
      type: String,
      default: 'Farm Fresh • Trusted • Local',
      trim: true,
    },

    ownerName: {
      type: String,
      default: '',
      trim: true,
    },

    gstNumber: {
      type: String,
      default: '',
      trim: true,
    },

    phone: {
      type: String,
      default: '',
      trim: true,
    },

    email: {
      type: String,
      default: '',
      trim: true,
      lowercase: true,
    },

    address: {
      street: {
        type: String,
        default: '',
      },
      locality: {
        type: String,
        default: '',
      },
      city: {
        type: String,
        default: '',
      },
      state: {
        type: String,
        default: '',
      },
      pincode: {
        type: String,
        default: '',
      },
      country: {
        type: String,
        default: 'India',
      },
    },

    /* =========================================================
       BUSINESS HOURS
       ========================================================= */

    businessHours: {
      monday: {
        open: { type: String, default: '08:30' },
        close: { type: String, default: '23:00' },
        active: { type: Boolean, default: true },
      },

      tuesday: {
        open: { type: String, default: '08:30' },
        close: { type: String, default: '23:00' },
        active: { type: Boolean, default: true },
      },

      wednesday: {
        open: { type: String, default: '08:30' },
        close: { type: String, default: '23:00' },
        active: { type: Boolean, default: true },
      },

      thursday: {
        open: { type: String, default: '08:30' },
        close: { type: String, default: '23:00' },
        active: { type: Boolean, default: true },
      },

      friday: {
        open: { type: String, default: '08:30' },
        close: { type: String, default: '23:00' },
        active: { type: Boolean, default: true },
      },

      saturday: {
        open: { type: String, default: '08:30' },
        close: { type: String, default: '23:00' },
        active: { type: Boolean, default: true },
      },

      sunday: {
        open: { type: String, default: '08:30' },
        close: { type: String, default: '20:00' },
        active: { type: Boolean, default: false },
      },
    },

    /* =========================================================
       DELIVERY SETTINGS
       ========================================================= */

    deliveryRadius: {
      type: Number,
      default: 15,
    },

    minimumOrder: {
      type: Number,
      default: 100,
    },

    freeDeliveryAbove: {
      type: Number,
      default: 500,
    },

    deliveryCharges: {
      type: Number,
      default: 30,
    },

    expressDeliveryCharge: {
      type: Number,
      default: 50,
    },

    expressDeliveryTime: {
      type: Number,
      default: 40,
    },

    /* =========================================================
       PAYMENT SETTINGS
       ========================================================= */

    acceptUPI: {
      type: Boolean,
      default: true,
    },

    acceptCard: {
      type: Boolean,
      default: true,
    },

    acceptNetBanking: {
      type: Boolean,
      default: true,
    },

    acceptCOD: {
      type: Boolean,
      default: true,
    },

    codLimit: {
      type: Number,
      default: 5000,
    },

    /* =========================================================
       APPEARANCE SETTINGS
       ========================================================= */

    primaryColor: {
      type: String,
      default: '#2E7D32',
      trim: true,
    },

    accentColor: {
      type: String,
      default: '#F9A825',
      trim: true,
    },

    compactMode: {
      type: Boolean,
      default: false,
    },

    /* =========================================================
       SECURITY / MAINTENANCE
       ========================================================= */

    maintenanceMode: {
      type: Boolean,
      default: false,
    },

    maintenanceMessage: {
      type: String,
      default: 'We are currently performing maintenance. Please check back soon.',
      trim: true,
    },

    /* =========================================================
       BACKUP
       ========================================================= */

    autoBackup: {
      type: Boolean,
      default: false,
    },

    backupFrequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly'],
      default: 'daily',
    },

    /* =========================================================
       STORE LOGO
       ========================================================= */

    logo: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('Settings', settingsSchema)