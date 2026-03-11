const User = require('../models/User');
const APIKey = require('../models/APIKey');

exports.switchMode = async (req, res, next) => {
  try {
    const { mode } = req.body;
    if (!['PAPER', 'LIVE', 'BACKTEST'].includes(mode)) {
      return res.status(400).json({ message: 'Invalid mode. Must be PAPER, LIVE, or BACKTEST' });
    }

    // LIVE mode requires at least one verified API key
    if (mode === 'LIVE') {
      const verifiedKey = await APIKey.findOne({ userId: req.user._id, verified: true });
      if (!verifiedKey) {
        return res.status(403).json({ ok: false, code: 'LIVE_NOT_PERMITTED', message: 'Switching to LIVE mode requires at least one verified API key' });
      }
    }

    const user = await User.findByIdAndUpdate(req.user._id, { mode }, { new: true });
    res.json({ ok: true, mode: user.mode });
  } catch (err) { next(err); }
};
