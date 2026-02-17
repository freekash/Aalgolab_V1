const mongoose = require('mongoose');

const backtestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  parameters: mongoose.Schema.Types.Mixed,
  results: {
    pnlCurve: [Number],
    stats: mongoose.Schema.Types.Mixed
  }
}, { timestamps: true });

module.exports = mongoose.model('Backtest', backtestSchema);
