const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/genericController');

router.use(auth);
router.get('/', ctrl.notImplemented);

module.exports = router;