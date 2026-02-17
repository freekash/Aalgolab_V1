const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/genericController');

router.use(auth);
router.post('/', ctrl.notImplemented);
router.get('/', ctrl.notImplemented);
router.get('/:id', ctrl.notImplemented);

module.exports = router;
