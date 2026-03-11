const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mode: String,
  exchange: String,
  symbol: String,
  side: String,
  type: String,
  quantity: Number,
  price: Number,
  status: String
}, { timestamps: true });

// Index for efficient daily trade count queries used in risk engine
orderSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);
