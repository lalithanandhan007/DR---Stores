import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, default: '' },
  password: { type: String, select: false },
  role: { type: String, enum: ['customer', 'admin', 'delivery'], default: 'customer' },
  avatar: { type: String, default: null },
  tag: { type: String, enum: ['vip', 'premium', 'regular', 'new'], default: 'regular' },
  blocked: { type: Boolean, default: false },
  joinedAt: { type: Date, default: Date.now },
  lastActiveAt: { type: Date, default: Date.now },
  notes: [{ type: String }],
  otp: { type: String, select: false },
  otpExpiry: { type: Date, select: false },
  resetToken: { type: String, select: false },
  resetTokenExpiry: { type: Date, select: false },
  settings: {
    notifications: { orders: { type: Boolean, default: true }, offers: { type: Boolean, default: true }, email: { type: Boolean, default: false } },
    darkMode: { type: Boolean, default: false },
    language: { type: String, default: 'en' },
  },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.otp;
  delete obj.otpExpiry;
  delete obj.resetToken;
  delete obj.resetTokenExpiry;
  delete obj.__v;
  return obj;
};

export default mongoose.model('User', userSchema);
