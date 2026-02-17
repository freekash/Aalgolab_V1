const Settings = require('../models/Settings');

exports.get = async (req, res, next) => {
  try {
    let settings = await Settings.findOne({ userId: req.user._id });
    if (!settings) {
      settings = new Settings({ userId: req.user._id });
      await settings.save();
    }
    res.json(settings);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const updates = req.body;
    const settings = await Settings.findOneAndUpdate({ userId: req.user._id }, updates, { new: true, upsert: true });
    res.json(settings);
  } catch (err) { next(err); }
};