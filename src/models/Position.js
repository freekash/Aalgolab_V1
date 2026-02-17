const mongoose = require('mongoose');

const positionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  symbol: String,
  entryPrice: Number,
  quantity: Number,
  side: String,
  unrealizedPnL: Number,
  leverage: Number
}, { timestamps: true });

module.exports = mongoose.model('Position', positionSchema);
