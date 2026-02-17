const mongoose = require('mongoose');

const botRunSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  botName: String,
  mode: String,
  startTime: Date,
  endTime: Date,
  status: String,
  trades: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Trade' }],
  performance: {
    pnl: Number,
    wins: Number,
    losses: Number,
    maxDrawdown: Number
  }
}, { timestamps: true });

module.exports = mongoose.model('BotRun', botRunSchema);
