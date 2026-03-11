// risk engine logic
const Order = require('../models/Order');

module.exports = {
  async check(order, riskSettings, userId) {
    if (!riskSettings) return { allowed: true, message: '' };

    // Check max leverage
    if (order.leverage && riskSettings.maxLeverage && order.leverage > riskSettings.maxLeverage) {
      return { allowed: false, message: `Leverage ${order.leverage}x exceeds max allowed ${riskSettings.maxLeverage}x` };
    }

    // Check max trades per day
    if (riskSettings.maxTradesPerDay && userId) {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const todayCount = await Order.countDocuments({ userId, createdAt: { $gte: startOfDay } });
      if (todayCount >= riskSettings.maxTradesPerDay) {
        return { allowed: false, message: `Daily trade limit of ${riskSettings.maxTradesPerDay} reached` };
      }
    }

    return { allowed: true, message: '' };
  }
};
