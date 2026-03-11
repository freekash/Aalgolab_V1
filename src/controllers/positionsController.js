const Position = require('../models/Position');

exports.list = async (req, res, next) => {
  try {
    const positions = await Position.find({ userId: req.user._id });
    res.json(positions);
  } catch (err) { next(err); }
};
