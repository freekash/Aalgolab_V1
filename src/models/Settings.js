const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  risk: {
    stopLossPct: { type: Number, default: 1 },
    takeProfitPct: { type: Number, default: 100 },
    maxTradesPerDay: { type: Number, default: 10 },
    dailyLossCap: { type: Number, default: 100 },
    maxLeverage: { type: Number, default: 5 },
    cooldownAfterLossStreak: { type: Number, default: 1 }
  },
  bots: [{
    name: String,
    weight: Number,
    enabled: Boolean,
    trustThreshold: Number
  }],
  notifications: {
    popup: { type: Boolean, default: true },
    sound: { type: Boolean, default: false },
    telegram: { type: Boolean, default: false },
    telegramChatId: String
  },
  instruments: {
    crypto: { type: Boolean, default: true },
    nse: { type: Boolean, default: false },
    bse: { type: Boolean, default: false },
    nifty: { type: Boolean, default: false },
    bankNifty: { type: Boolean, default: false },
    commodities: { type: Boolean, default: false },
    nasdaq: { type: Boolean, default: false }
  }
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
