const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/modeController');

router.use(auth);
router.post('/switch', ctrl.switchMode);

module.exports = router;
