const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/backtestController');

router.use(auth);
router.post('/', ctrl.run);
router.get('/', ctrl.list);

module.exports = router;