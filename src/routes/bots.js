const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/genericController');

router.use(auth);
router.get('/', ctrl.notImplemented);
router.post('/:name/enable', ctrl.notImplemented);
router.post('/:name/disable', ctrl.notImplemented);
router.put('/:name/weight', ctrl.notImplemented);

module.exports = router;