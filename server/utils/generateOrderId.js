import OrderCounter from '../models/OrderCounter.js';

export async function generateOrderId() {
  const now = new Date();
  const datePrefix = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('');

  const counter = await OrderCounter.findOneAndUpdate(
    { _id: datePrefix },
    { $inc: { sequence: 1 } },
    { new: true, upsert: true }
  );

  return `${datePrefix}${String(counter.sequence).padStart(6, '0')}`;
}