const Settings = require('../models/Settings');
const BotRun = require('../models/BotRun');

exports.list = async (req, res, next) => {
  try {
    let settings = await Settings.findOne({ userId: req.user._id });
    if (!settings) {
      settings = new Settings({ userId: req.user._id });
      await settings.save();
    }
    res.json(settings.bots || []);
  } catch (err) { next(err); }
};

exports.enable = async (req, res, next) => {
  try {
    const { name } = req.params;
    const settings = await Settings.findOneAndUpdate(
      { userId: req.user._id, 'bots.name': name },
      { $set: { 'bots.$.enabled': true } },
      { new: true }
    );
    if (!settings) return res.status(404).json({ message: 'Bot not found' });
    res.json({ ok: true, bot: settings.bots.find(b => b.name === name) });
  } catch (err) { next(err); }
};

exports.disable = async (req, res, next) => {
  try {
    const { name } = req.params;
    const settings = await Settings.findOneAndUpdate(
      { userId: req.user._id, 'bots.name': name },
      { $set: { 'bots.$.enabled': false } },
      { new: true }
    );
    if (!settings) return res.status(404).json({ message: 'Bot not found' });
    res.json({ ok: true, bot: settings.bots.find(b => b.name === name) });
  } catch (err) { next(err); }
};

exports.updateWeight = async (req, res, next) => {
  try {
    const { name } = req.params;
    const { weight } = req.body;
    if (typeof weight !== 'number' || weight < 0 || weight > 1) {
      return res.status(400).json({ message: 'weight must be a number between 0 and 1' });
    }
    const settings = await Settings.findOneAndUpdate(
      { userId: req.user._id, 'bots.name': name },
      { $set: { 'bots.$.weight': weight } },
      { new: true }
    );
    if (!settings) return res.status(404).json({ message: 'Bot not found' });
    res.json({ ok: true, bot: settings.bots.find(b => b.name === name) });
  } catch (err) { next(err); }
};
