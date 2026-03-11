const Backtest = require('../models/Backtest');
const simulation = require('../services/simulation');

exports.run = async (req, res, next) => {
  try {
    const parameters = req.body;
    if (parameters.candles !== undefined && !Array.isArray(parameters.candles)) {
      return res.status(400).json({ message: 'candles must be an array' });
    }
    if (parameters.feeRate !== undefined && (typeof parameters.feeRate !== 'number' || parameters.feeRate < 0)) {
      return res.status(400).json({ message: 'feeRate must be a non-negative number' });
    }
    if (parameters.slippagePct !== undefined && (typeof parameters.slippagePct !== 'number' || parameters.slippagePct < 0)) {
      return res.status(400).json({ message: 'slippagePct must be a non-negative number' });
    }
    const results = simulation.runBacktest(parameters);
    const backtest = new Backtest({
      userId: req.user._id,
      parameters,
      results
    });
    await backtest.save();
    res.json(backtest);
  } catch (err) { next(err); }
};

exports.list = async (req, res, next) => {
  try {
    const backtests = await Backtest.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(backtests);
  } catch (err) { next(err); }
};
