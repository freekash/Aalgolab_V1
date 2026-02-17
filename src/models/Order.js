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

module.exports = mongoose.model('Order', orderSchema);
