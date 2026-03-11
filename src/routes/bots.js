const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/botsController');

router.use(auth);
router.get('/', ctrl.list);
router.post('/:name/enable', ctrl.enable);
router.post('/:name/disable', ctrl.disable);
router.put('/:name/weight', ctrl.updateWeight);

module.exports = router;