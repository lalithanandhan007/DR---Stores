import mongoose from 'mongoose';

const orderCounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  sequence: { type: Number, default: 0 },
});

export default mongoose.model('OrderCounter', orderCounterSchema);