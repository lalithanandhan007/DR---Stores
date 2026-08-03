import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  user: { type: String, ref: 'User', required: true },
  label: { type: String, default: 'Home' },
  name: { type: String, required: true },
  house: { type: String, default: '' },
  street: { type: String, default: '' },
  locality: { type: String, default: '' },
  city: { type: String, default: '' },
  pincode: { type: String, default: '' },
  landmark: { type: String, default: '' },
  isDefault: { type: Boolean, default: false },
}, { timestamps: true });

addressSchema.index({ user: 1 });

export default mongoose.model('Address', addressSchema);
