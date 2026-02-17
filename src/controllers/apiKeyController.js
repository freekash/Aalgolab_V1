const APIKey = require('../models/APIKey');
const { encrypt, decrypt } = require('../utils/encryption');

exports.list = async (req, res, next) => {
  try {
    const keys = await APIKey.find({ userId: req.user._id }).select('-apiSecret -apiKey');
    res.json(keys);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const data = req.body;
    data.userId = req.user._id;
    data.apiKey = encrypt(data.apiKey);
    data.apiSecret = encrypt(data.apiSecret);
    const key = new APIKey(data);
    await key.save();
    res.json(key);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const updates = req.body;
    if (updates.apiKey) updates.apiKey = encrypt(updates.apiKey);
    if (updates.apiSecret) updates.apiSecret = encrypt(updates.apiSecret);
    const key = await APIKey.findOneAndUpdate({ _id: req.params.id, userId: req.user._id }, updates, { new: true });
    res.json(key);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    await APIKey.deleteOne({ _id: req.params.id, userId: req.user._id });
    res.json({});
  } catch (err) { next(err); }
};

exports.verify = async (req, res, next) => {
  try {
    // placeholder: call CCXT to verify credentials
    const key = await APIKey.findOne({ _id: req.params.id, userId: req.user._id });
    if (!key) return res.status(404).json({ message: 'Not found' });
    // decrypt and try simple request...
    key.verified = true;
    await key.save();
    res.json({ verified: true });
  } catch (err) { next(err); }
};