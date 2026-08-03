import mongoose from 'mongoose';

const deliveryPartnerSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, default: '' },
  vehicle: { type: String, default: '' },
  vehicleType: { type: String, enum: ['Motorcycle', 'Scooter', 'Van', 'Bicycle'], default: 'Scooter' },
  rating: { type: Number, default: 0, max: 5 },
  totalDeliveries: { type: Number, default: 0 },
  successfulDeliveries: { type: Number, default: 0 },
  cancelledDeliveries: { type: Number, default: 0 },
  avgDeliveryTime: { type: Number, default: 0 },
  onTimePercentage: { type: Number, default: 0 },
  status: { type: String, enum: ['online', 'offline', 'on_delivery'], default: 'offline' },
  joinedAt: { type: Date, default: Date.now },
  lastActiveAt: { type: Date, default: Date.now },
  todayDeliveries: { type: Number, default: 0 },
  todayEarnings: { type: Number, default: 0 },
  zone: { type: String, default: '' },
  shift: { type: String, default: '' },
  documents: {
    license: { type: Boolean, default: false },
    aadhaar: { type: Boolean, default: false },
    insurance: { type: Boolean, default: false },
  },
  recentDeliveries: [{
    orderId: { type: String },
    customer: { type: String },
    time: { type: Date },
    rating: { type: Number },
    earnings: { type: Number },
  }],
}, { timestamps: true });

export default mongoose.model('DeliveryPartner', deliveryPartnerSchema);
