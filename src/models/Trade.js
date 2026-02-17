const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  entryPrice: Number,
  exitPrice: Number,
  quantity: Number,
  profitLoss: Number,
  fees: Number,
  liquidation: Boolean
}, { timestamps: true });

module.exports = mongoose.model('Trade', tradeSchema);
