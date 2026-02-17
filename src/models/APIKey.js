const mongoose = require('mongoose');

const apiKeySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  exchange: { type: String, required: true },
  label: String,
  apiKey: { type: String, required: true },
  apiSecret: { type: String, required: true },
  verified: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('APIKey', apiKeySchema);
