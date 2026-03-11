const Order = require('../models/Order');
const APIKey = require('../models/APIKey');
const Alert = require('../models/Alert');
const riskEngine = require('../services/riskEngine');

exports.create = async (req, res, next) => {
  try {
    const user = req.user;
    const orderData = { ...req.body, userId: user._id };

    // LIVE mode guard: require at least one verified API key
    if (orderData.mode === 'LIVE') {
      const verifiedKey = await APIKey.findOne({ userId: user._id, verified: true });
      if (!verifiedKey) {
        return res.status(403).json({ ok: false, code: 'LIVE_NOT_PERMITTED', message: 'LIVE mode requires at least one verified API key' });
      }
    }

    // Risk engine check
    const riskResult = await riskEngine.check(orderData, user.settings && user.settings.risk, user._id);
    if (!riskResult.allowed) {
      const alert = new Alert({ userId: user._id, type: 'red', message: riskResult.message });
      await alert.save();
      if (req.io) req.io.to(user._id.toString()).emit('alert:new', alert);
      return res.status(400).json({ ok: false, code: 'RISK_REJECTED', message: riskResult.message });
    }

    orderData.status = 'pending';
    const order = new Order(orderData);
    await order.save();

    if (req.io) req.io.to(user._id.toString()).emit('order:update', order);

    res.json(order);
  } catch (err) { next(err); }
};

exports.list = async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) { next(err); }
};

exports.get = async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, userId: req.user._id });
    if (!order) return res.status(404).json({ message: 'Not found' });
    res.json(order);
  } catch (err) { next(err); }
};
